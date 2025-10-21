import { existsSync, mkdirSync, writeFileSync } from 'fs';
import http from 'http';
import https from 'https';
import { basename, dirname, join } from 'path';
import { launch } from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const photosDir = join(__dirname, 'photos');
if (!existsSync(photosDir)) {
  mkdirSync(photosDir, { recursive: true });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => {
            writeFileSync(filepath, Buffer.concat(chunks));
            console.log(`Downloaded: ${basename(filepath)}`);
            resolve();
          });
        } else {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

async function scrapeOSDiving() {
  console.log('Launching browser...');
  const browser = await launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    console.log('Navigating to osdiving.com...');
    await page.goto('https://www.osdiving.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    console.log('Extracting content...');

    // Extract all content
    const content = await page.evaluate(() => {
      const data = {
        title: document.title,
        headings: [],
        paragraphs: [],
        images: [],
        links: [],
        contact: {},
        offers: [],
      };

      // Headings
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
        data.headings.push({
          level: el.tagName,
          text: el.textContent.trim(),
        });
      });

      // Paragraphs
      document.querySelectorAll('p').forEach((el) => {
        const text = el.textContent.trim();
        if (text && text.length > 20) {
          data.paragraphs.push(text);
        }
      });

      // Images
      document.querySelectorAll('img').forEach((img) => {
        const src = img.src;
        const alt = img.alt || '';
        if (src && !src.includes('data:image')) {
          data.images.push({ src, alt });
        }
      });

      // Links
      document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.href;
        const text = link.textContent.trim();
        if (text && href) {
          data.links.push({ href, text });
        }
      });

      // Extract contact info
      const whatsapp = document.body.textContent.match(/Whatsapp:\s*([+\d\s]+)/);
      const office = document.body.textContent.match(/Office\s*([+\d\s]+)/);
      const email = document.body.textContent.match(
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
      );

      if (whatsapp) data.contact.whatsapp = whatsapp[1].trim();
      if (office) data.contact.office = office[1].trim();
      if (email) data.contact.email = email[1].trim();
      data.contact.location = 'Coastal Road Pereybere Mauritius';

      return data;
    });

    // Save content to JSON
    const contentFile = join(__dirname, 'photos', 'osdiving-content.json');
    writeFileSync(contentFile, JSON.stringify(content, null, 2));
    console.log(`Saved content to ${contentFile}`);

    // Download images
    console.log(`Found ${content.images.length} images. Downloading...`);
    let downloadCount = 0;

    for (let i = 0; i < content.images.length && i < 50; i++) {
      const img = content.images[i];
      try {
        // Get full resolution image URL (remove size parameters)
        const fullResUrl = img.src.replace(/\/fill\/[^/]+\//, '/v1/').replace(/\?.*$/, '');

        const filename = `image-${i + 1}-${basename(new URL(fullResUrl).pathname)}`;
        const filepath = join(photosDir, filename);

        await downloadImage(fullResUrl, filepath);
        downloadCount++;
      } catch (error) {
        console.error(`Failed to download image ${i + 1}:`, error.message);
      }
    }

    console.log(`\n✅ Scraping complete!`);
    console.log(`📁 Downloaded ${downloadCount} images to /photos/`);
    console.log(`📄 Content saved to /photos/osdiving-content.json`);

    return content;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeOSDiving()
  .then((content) => {
    console.log('\n📊 Summary:');
    console.log(`   - ${content.headings.length} headings`);
    console.log(`   - ${content.paragraphs.length} paragraphs`);
    console.log(`   - ${content.images.length} images found`);
    console.log(`   - ${content.links.length} links`);
    console.log('\n📞 Contact Info:');
    console.log(`   - WhatsApp: ${content.contact.whatsapp || 'N/A'}`);
    console.log(`   - Office: ${content.contact.office || 'N/A'}`);
    console.log(`   - Email: ${content.contact.email || 'N/A'}`);
    console.log(`   - Location: ${content.contact.location || 'N/A'}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
