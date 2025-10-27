#!/bin/bash
# ====================================================================================
# Node Modules Volume Health Check
# Verifies that critical packages are installed in the volume mount
# ====================================================================================

set -e

echo "🔍 Checking node_modules volume health..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Critical packages to verify
CRITICAL_PACKAGES=(
    "react"
    "react-dom"
    "vite"
    "tailwindcss"
    "@tanstack/react-query"
    "zustand"
    "react-router-dom"
)

# Check if node_modules directory exists
if [ ! -d "/app/node_modules" ]; then
    echo -e "${RED}❌ FAIL: /app/node_modules directory does not exist${NC}"
    exit 1
fi

echo -e "${GREEN}✓ node_modules directory exists${NC}"

# Check if package.json exists
if [ ! -f "/app/package.json" ]; then
    echo -e "${RED}❌ FAIL: /app/package.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ package.json found${NC}"

# Verify critical packages
MISSING_PACKAGES=()
for package in "${CRITICAL_PACKAGES[@]}"; do
    PACKAGE_PATH="/app/node_modules/$package"
    if [ ! -d "$PACKAGE_PATH" ]; then
        MISSING_PACKAGES+=("$package")
        echo -e "${RED}❌ MISSING: $package${NC}"
    else
        echo -e "${GREEN}✓ $package installed${NC}"
    fi
done

# Report missing packages
if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
    echo -e "${RED}❌ FAIL: ${#MISSING_PACKAGES[@]} critical package(s) missing:${NC}"
    for package in "${MISSING_PACKAGES[@]}"; do
        echo -e "${RED}  - $package${NC}"
    done
    exit 1
fi

# Measure startup time (check if node can load react quickly)
echo ""
echo "⏱️  Measuring startup performance..."
START_TIME=$(date +%s%N)
node -e "require('react'); require('react-dom'); require('vite');" 2>/dev/null
END_TIME=$(date +%s%N)
ELAPSED_MS=$(( (END_TIME - START_TIME) / 1000000 ))

if [ $ELAPSED_MS -lt 1000 ]; then
    echo -e "${GREEN}✓ Startup test passed: ${ELAPSED_MS}ms (excellent)${NC}"
elif [ $ELAPSED_MS -lt 3000 ]; then
    echo -e "${YELLOW}⚠ Startup test passed: ${ELAPSED_MS}ms (acceptable)${NC}"
else
    echo -e "${RED}❌ SLOW: Startup took ${ELAPSED_MS}ms (>3000ms threshold)${NC}"
    exit 1
fi

# Check volume mount integrity
echo ""
echo "📦 Checking volume mount integrity..."
VOLUME_MOUNTED=$(df -h /app/node_modules | tail -1 | awk '{print $1}')
if [[ "$VOLUME_MOUNTED" == *"/dev/"* ]] || [[ "$VOLUME_MOUNTED" == *"overlay"* ]]; then
    echo -e "${GREEN}✓ node_modules is properly volume-mounted${NC}"
else
    echo -e "${YELLOW}⚠ node_modules may be on bind mount (check docker-compose.yml)${NC}"
fi

# Calculate total size
NODE_MODULES_SIZE=$(du -sh /app/node_modules 2>/dev/null | awk '{print $1}')
echo -e "${GREEN}✓ node_modules size: $NODE_MODULES_SIZE${NC}"

# Final summary
echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✓ Volume mount: healthy${NC}"
echo -e "${GREEN}✓ Critical packages: ${#CRITICAL_PACKAGES[@]}/${#CRITICAL_PACKAGES[@]} installed${NC}"
echo -e "${GREEN}✓ Startup performance: ${ELAPSED_MS}ms${NC}"
echo -e "${GREEN}✓ Total size: $NODE_MODULES_SIZE${NC}"

exit 0
