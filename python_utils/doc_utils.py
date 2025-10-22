#!/usr/bin/env python3
"""Documentation utilities for React Scuba project."""

import os
import re
import requests
from pathlib import Path
from typing import List, Dict, Set
from urllib.parse import urljoin, urlparse
import yaml
import json
from concurrent.futures import ThreadPoolExecutor, as_completed


class DocUtils:
    """Utilities for documentation management."""

    def __init__(self, docs_path: str = "docs"):
        self.docs_path = Path(docs_path)
        self.base_url = "https://deanluus22021994.github.io/react-scuba/"

    def find_markdown_files(self) -> List[Path]:
        """Find all markdown files in the docs directory."""
        return list(self.docs_path.rglob("*.md"))

    def extract_links(self, file_path: Path) -> List[str]:
        """Extract all links from a markdown file."""
        links = []
        try:
            content = file_path.read_text(encoding='utf-8')

            # Find markdown links [text](url)
            md_links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
            for _, url in md_links:
                if not url.startswith(('http://', 'https://', '#')):
                    # Relative link - convert to absolute
                    links.append(urljoin(self.base_url, url))
                else:
                    links.append(url)

        except Exception as e:
            print(f"Error reading {file_path}: {e}")

        return links

    def check_links(self, max_workers: int = 10) -> Dict[str, List[str]]:
        """Check all links in documentation for validity."""
        results = {"valid": [], "broken": [], "skipped": []}

        # Find all markdown files
        md_files = self.find_markdown_files()
        all_links = set()

        # Collect all unique links
        for file_path in md_files:
            links = self.extract_links(file_path)
            all_links.update(links)

        print(f"Found {len(all_links)} unique links to check...")

        def check_link(url: str) -> tuple[str, bool, str]:
            """Check a single link."""
            try:
                # Skip local development URLs
                if 'localhost' in url or '127.0.0.1' in url:
                    return url, True, "skipped"

                response = requests.head(url, timeout=10, allow_redirects=True)
                return url, response.status_code < 400, f"status: {response.status_code}"
            except requests.RequestException as e:
                return url, False, str(e)

        # Check links concurrently
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [executor.submit(check_link, url) for url in all_links]

            for future in as_completed(futures):
                url, is_valid, reason = future.result()
                if "skipped" in reason:
                    results["skipped"].append(url)
                elif is_valid:
                    results["valid"].append(url)
                else:
                    results["broken"].append(f"{url} ({reason})")

        return results

    def generate_component_inventory(self, src_path: str = "src") -> Dict:
        """Generate an inventory of React components."""
        components = {"pages": [], "components": [], "hooks": [], "utils": []}

        src_dir = Path(src_path)

        # Find component files
        component_files = list(src_dir.rglob("*.jsx")) + list(src_dir.rglob("*.js"))

        for file_path in component_files:
            relative_path = file_path.relative_to(src_dir)
            content = file_path.read_text(encoding='utf-8')

            # Determine category
            if "pages" in str(relative_path):
                category = "pages"
            elif "hooks" in str(relative_path):
                category = "hooks"
            elif "utils" in str(relative_path):
                category = "utils"
            else:
                category = "components"

            # Extract component name from export
            component_name = self._extract_component_name(content, file_path.name)

            components[category].append({
                "name": component_name,
                "file": str(relative_path),
                "path": str(file_path)
            })

        return components

    def _extract_component_name(self, content: str, filename: str) -> str:
        """Extract component name from file content."""
        # Try to find export default
        export_match = re.search(r'export default (\w+)', content)
        if export_match:
            return export_match.group(1)

        # Try to find function declaration
        func_match = re.search(r'(?:function|const|class) (\w+)', content)
        if func_match:
            return func_match.group(1)

        # Fallback to filename
        return filename.replace('.jsx', '').replace('.js', '')


def main():
    """Main CLI entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="React Scuba Documentation Utilities")
    parser.add_argument("command", choices=["check-links", "inventory"], help="Command to run")
    parser.add_argument("--docs-path", default="docs", help="Path to docs directory")
    parser.add_argument("--src-path", default="src", help="Path to source directory")

    args = parser.parse_args()

    utils = DocUtils(args.docs_path)

    if args.command == "check-links":
        print("🔗 Checking documentation links...")
        results = utils.check_links()

        print(f"✅ Valid links: {len(results['valid'])}")
        print(f"❌ Broken links: {len(results['broken'])}")
        print(f"⏭️  Skipped links: {len(results['skipped'])}")

        if results["broken"]:
            print("\nBroken links:")
            for link in results["broken"]:
                print(f"  - {link}")

    elif args.command == "inventory":
        print("📦 Generating component inventory...")
        inventory = utils.generate_component_inventory(args.src_path)

        print(f"📄 Pages: {len(inventory['pages'])}")
        print(f"🧩 Components: {len(inventory['components'])}")
        print(f"🪝 Hooks: {len(inventory['hooks'])}")
        print(f"🛠️  Utils: {len(inventory['utils'])}")

        # Save to JSON
        with open("docs/testing/component-inventory.json", "w") as f:
            json.dump(inventory, f, indent=2)

        print("📝 Inventory saved to docs/testing/component-inventory.json")


if __name__ == "__main__":
    main()
