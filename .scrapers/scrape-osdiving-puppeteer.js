import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { launch } from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create organized directory structure
const baseDir = join(__dirname, 'ocean-spirit-puppeteer');
const dirs = {
  images: join(baseDir, 'images'),
  pages: join(baseDir, 'pages'),
  data: join(baseDir, 'data'),
};

Object.values(dirs).forEach((dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// All known Ocean Spirit pages
const pagesToScrape = [
  'https://www.osdiving.com/',
  'https://www.osdiving.com/scuba-diving-mauritius-contact',
  'https://www.osdiving.com/ocean-spirit-dive-centre',
  'https://www.osdiving.com/equipment-gear-and-operations',
  'https://www.osdiving.com/ocean-spirit-team',
  'https://www.osdiving.com/ocean-spirit-projects',
  'https://www.osdiving.com/press-news',
  'https://www.osdiving.com/blog',
  'https://www.osdiving.com/padi-open-water-mauritius',
  'https://www.osdiving.com/padi-advanced-open-water',
  'https://www.osdiving.com/padi-rescue-diver',
  'https://www.osdiving.com/padi-dive-master',
  'https://www.osdiving.com/padi-speciality-courses',
  'https://www.osdiving.com/discover-scuba-diving',
  'https://www.osdiving.com/freediving',
  'https://www.osdiving.com/mauritius-scuba-diving-sites',
  'https://www.osdiving.com/booking',
];

const imageUrls = new Set();
const downloadedImages = new Set();
const pageContent = {};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const http = require('http');

    const protocol = url.startsWith('https') ? https : http;
    protocol
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => {
            writeFileSync(filepath, Buffer.concat(chunks));
            console.info(`✓ Downloaded: ${basename(filepath)}`);
            resolve();
          });
        } else {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

async function scrapePage(browser, url) {
  console.info(`📄 Scraping: ${url}`);

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Extract content using Puppeteer
    const content = await page.evaluate(() => {
      const data = {
        title: document.title,
        headings: [],
        paragraphs: [],
        images: [],
        links: [],
        contacts: {
          phones: [],
          emails: [],
          whatsapp: [],
        },
        text: [],
      };

      // Headings
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
        data.headings.push({
          level: el.tagName,
          text: el.textContent.trim(),
        });
      });

      // Paragraphs and text content
      document.querySelectorAll('p, div, span').forEach((el) => {
        const text = el.textContent.trim();
        if (text && text.length > 10 && !text.includes('{') && !text.includes('function')) {
          data.paragraphs.push(text);
          data.text.push(text);
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

      // Extract phone numbers
      const phoneRegex = /(\+?\d{1,4}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9})/g;
      const phones = document.body.textContent.match(phoneRegex) || [];
      phones.forEach((p) => {
        const cleaned = p.trim();
        if (cleaned.length > 8 && !data.contacts.phones.includes(cleaned)) {
          data.contacts.phones.push(cleaned);
        }
      });

      // Extract emails
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
      const emails = document.body.textContent.match(emailRegex) || [];
      emails.forEach((e) => {
        if (!data.contacts.emails.includes(e)) {
          data.contacts.emails.push(e);
        }
      });

      // Extract WhatsApp
      const whatsappRegex = /whatsapp[:\s]*([+\d\s]+)/gi;
      const whatsapp = document.body.textContent.matchAll(whatsappRegex);
      for (const match of whatsapp) {
        if (!data.contacts.whatsapp.includes(match[1].trim())) {
          data.contacts.whatsapp.push(match[1].trim());
        }
      }

      return data;
    });

    // Save HTML and JSON
    const html = await page.content();
    const filename = url.replace('https://www.osdiving.com/', '').replace(/\//g, '_') || 'home';
    writeFileSync(join(dirs.pages, `${filename}.html`), html);
    writeFileSync(join(dirs.pages, `${filename}.json`), JSON.stringify(content, null, 2));

    console.info(
      `   ✓ Saved: ${filename} (${content.images.length} images, ${content.contacts.phones.length} phones)`
    );

    // Collect image URLs
    content.images.forEach((img) => {
      if (img.src) imageUrls.add(img.src);
    });

    pageContent[url] = content;

    await page.close();
    return content;
  } catch (_error) {
    console.error(`   ✗ Failed to scrape ${url}:`, _error.message);
    return null;
  }
}

async function downloadAllImages() {
  console.info(`\n🖼️  Downloading ${imageUrls.size} images...\n`);

  const imageArray = Array.from(imageUrls);
  let index = 1;

  for (const url of imageArray) {
    if (downloadedImages.has(url)) continue;

    try {
      const ext = url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)?.[1] || 'jpg';
      const filename = `image-${String(index).padStart(4, '0')}.${ext}`;
      const filepath = join(dirs.images, filename);

      await downloadImage(url, filepath);
      downloadedImages.add(url);
      index++;
    } catch (_error) {
      console.error(`Failed to download image: ${url.substring(0, 60)}...`);
    }
  }
}

async function main() {
  console.info('\n🚀 OCEAN SPIRIT PUPPETEER SCRAPER');
  console.info('==================================\n');

  console.info('Launching browser...');
  const browser = await launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Phase 1: Scrape all pages
    console.info('📑 PHASE 1: Scraping pages...\n');
    for (const url of pagesToScrape) {
      await scrapePage(browser, url);
      // Small delay to be respectful
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Phase 2: Download images
    await downloadAllImages();

    // Phase 3: Aggregate contact info
    console.info('\n📞 PHASE 3: Aggregating contact information...\n');

    const allContacts = {
      phones: new Set(),
      emails: new Set(),
      whatsapp: new Set(),
      social: {
        facebook: [],
        instagram: [],
        twitter: [],
        youtube: [],
        tripadvisor: [],
      },
      location: [],
    };

    Object.values(pageContent).forEach((content) => {
      content.contacts.phones.forEach((p) => allContacts.phones.add(p));
      content.contacts.emails.forEach((e) => allContacts.emails.add(e));
      content.contacts.whatsapp.forEach((w) => allContacts.whatsapp.add(w));

      content.text.forEach((text) => {
        if (text.toLowerCase().includes('location') || text.toLowerCase().includes('pereybere')) {
          allContacts.location.push(text);
        }
      });

      content.links.forEach((link) => {
        if (link.href.includes('facebook.com')) allContacts.social.facebook.push(link.href);
        if (link.href.includes('instagram.com')) allContacts.social.instagram.push(link.href);
        if (link.href.includes('twitter.com')) allContacts.social.twitter.push(link.href);
        if (link.href.includes('youtube.com')) allContacts.social.youtube.push(link.href);
        if (link.href.includes('tripadvisor.com')) allContacts.social.tripadvisor.push(link.href);
      });
    });

    const contactData = {
      phones: Array.from(allContacts.phones),
      emails: Array.from(allContacts.emails),
      whatsapp: Array.from(allContacts.whatsapp),
      social: allContacts.social,
      location: allContacts.location,
    };

    writeFileSync(join(dirs.data, 'contacts.json'), JSON.stringify(contactData, null, 2));

    // Save all extracted text content
    const allText = [];
    Object.entries(pageContent).forEach(([url, content]) => {
      allText.push({
        url,
        text: content.text,
      });
    });
    writeFileSync(join(dirs.data, 'all-text-content.json'), JSON.stringify(allText, null, 2));

    // Summary
    console.info('\n' + '='.repeat(50));
    console.info('✅ PUPPETEER SCRAPING COMPLETE!\n');
    console.info(`📄 Pages scraped: ${Object.keys(pageContent).length}`);
    console.info(`🖼️  Images downloaded: ${downloadedImages.size}/${imageUrls.size}`);
    console.info(`📞 Phone numbers found: ${contactData.phones.length}`);
    console.info(`📧 Email addresses: ${contactData.emails.length}`);
    console.info(`💬 WhatsApp numbers: ${contactData.whatsapp.length}`);
    console.info(`\n📁 Content saved to: ${baseDir}/`);
    console.info('   - images/     (all images)');
    console.info('   - pages/      (HTML + JSON for each page)');
    console.info('   - data/       (contacts.json, all-text-content.json)');
    console.info('='.repeat(50) + '\n');

    // Display contact info
    console.info('📞 CONTACT INFORMATION:');
    console.info('------------------------');
    contactData.phones.forEach((p) => console.info(`   Phone: ${p}`));
    contactData.emails.forEach((e) => console.info(`   Email: ${e}`));
    contactData.whatsapp.forEach((w) => console.info(`   WhatsApp: ${w}`));
    console.info('');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
