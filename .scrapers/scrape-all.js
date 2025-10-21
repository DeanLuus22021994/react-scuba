import { existsSync, mkdirSync, writeFileSync } from 'fs';
import http from 'http';
import https from 'https';
import { join } from 'path';
import { URL } from 'url';

// Create organized directory structure
const baseDir = './ocean-spirit-content';
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

function fetchUrl(url, timeout = 10000) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const timer = setTimeout(() => {
      resolve({ statusCode: 408, data: null, error: 'Timeout' });
    }, timeout);

    protocol
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        clearTimeout(timer);

        if (res.statusCode === 301 || res.statusCode === 302) {
          resolve(fetchUrl(res.headers.location, timeout));
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            data: Buffer.concat(chunks),
            headers: res.headers,
          });
        });
        res.on('error', (err) => {
          clearTimeout(timer);
          resolve({ statusCode: 0, data: null, error: err.message });
        });
      })
      .on('error', (err) => {
        clearTimeout(timer);
        resolve({ statusCode: 0, data: null, error: err.message });
      });
  });
}

function extractContent(html) {
  const content = {
    text: [],
    links: [],
    images: [],
    contacts: {
      phones: [],
      emails: [],
      whatsapp: [],
    },
  };

  // Extract phone numbers
  const phoneRegex = /(\+?\d{1,4}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9})/g;
  const phones = html.match(phoneRegex) || [];
  phones.forEach((p) => {
    const cleaned = p.trim();
    if (cleaned.length > 8 && !content.contacts.phones.includes(cleaned)) {
      content.contacts.phones.push(cleaned);
    }
  });

  // Extract emails
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emails = html.match(emailRegex) || [];
  emails.forEach((e) => {
    if (!content.contacts.emails.includes(e)) {
      content.contacts.emails.push(e);
    }
  });

  // Extract WhatsApp
  const whatsappRegex = /whatsapp[:\s]*([+\d\s]+)/gi;
  const whatsapp = html.matchAll(whatsappRegex);
  for (const match of whatsapp) {
    if (!content.contacts.whatsapp.includes(match[1].trim())) {
      content.contacts.whatsapp.push(match[1].trim());
    }
  }

  // Extract images
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  const imgMatches = html.matchAll(imgRegex);
  for (const match of imgMatches) {
    let imgUrl = match[1];
    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
    if (imgUrl.startsWith('/')) imgUrl = 'https://www.osdiving.com' + imgUrl;
    if (imgUrl.startsWith('http')) {
      content.images.push(imgUrl);
      imageUrls.add(imgUrl);
    }
  }

  // Extract background images from CSS
  const bgRegex = /background-image:\s*url\(['"]?([^'"]+)['"]?\)/gi;
  const bgMatches = html.matchAll(bgRegex);
  for (const match of bgMatches) {
    let imgUrl = match[1];
    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
    if (imgUrl.startsWith('http')) {
      content.images.push(imgUrl);
      imageUrls.add(imgUrl);
    }
  }

  // Extract Wix media URLs
  const wixRegex = /https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~\-./]+/gi;
  const wixMatches = html.matchAll(wixRegex);
  for (const match of wixMatches) {
    imageUrls.add(match[0]);
    content.images.push(match[0]);
  }

  // Extract links
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  const linkMatches = html.matchAll(linkRegex);
  for (const match of linkMatches) {
    let url = match[1];
    if (url.startsWith('/') && !url.startsWith('//')) {
      url = 'https://www.osdiving.com' + url;
    }
    if (url.includes('osdiving.com') && !content.links.includes(url)) {
      content.links.push(url);
    }
  }

  // Extract text content
  const textRegex = /<(?:p|h1|h2|h3|h4|h5|h6|li|span)[^>]*>([^<]+)<\//gi;
  const textMatches = html.matchAll(textRegex);
  for (const match of textMatches) {
    const text = match[1].trim();
    if (text.length > 10 && !text.includes('{') && !text.includes('function')) {
      content.text.push(text);
    }
  }

  return content;
}

async function scrapePage(url) {
  console.info(`📄 Scraping: ${url}`);

  const result = await fetchUrl(url, 15000);

  if (result.statusCode !== 200 || !result.data) {
    console.warn(`   ✗ Failed (${result.statusCode}): ${result.error || 'Unknown'}`);
    return null;
  }

  const html = result.data.toString();
  const content = extractContent(html);

  const filename = url.replace('https://www.osdiving.com/', '').replace(/\//g, '_') || 'home';
  writeFileSync(join(dirs.pages, `${filename}.html`), html);
  writeFileSync(join(dirs.pages, `${filename}.json`), JSON.stringify(content, null, 2));

  console.info(
    `   ✓ Saved: ${filename} (${content.images.length} images, ${content.contacts.phones.length} phones)`
  );

  pageContent[url] = content;
  return content;
}

async function downloadImage(url, index) {
  if (downloadedImages.has(url)) return;

  const result = await fetchUrl(url, 8000);

  if (result.statusCode !== 200 || !result.data) {
    console.warn(`   ✗ Image failed: ${url.substring(0, 60)}...`);
    return;
  }

  const ext = url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)?.[1] || 'jpg';
  const filename = `image-${String(index).padStart(4, '0')}.${ext}`;
  const filepath = join(dirs.images, filename);

  writeFileSync(filepath, result.data);
  downloadedImages.add(url);
  console.info(`   ✓ Image ${index}: ${filename}`);
}

async function main() {
  console.info('\n🚀 OCEAN SPIRIT CONTENT SCRAPER');
  console.info('================================\n');

  // Phase 1: Scrape all pages
  console.info('📑 PHASE 1: Scraping pages...\n');
  const scrapePromises = pagesToScrape.map((url) => scrapePage(url));
  await Promise.allSettled(scrapePromises);

  // Discover additional pages from extracted links
  const allLinks = new Set();
  Object.values(pageContent).forEach((content) => {
    content.links.forEach((link) => {
      if (link.includes('osdiving.com') && link.includes('single-post')) {
        allLinks.add(link);
      }
    });
  });

  if (allLinks.size > 0) {
    console.info(`\n📰 Found ${allLinks.size} blog posts, scraping...\n`);
    const blogPromises = Array.from(allLinks).map((url) => scrapePage(url));
    await Promise.allSettled(blogPromises);
  }

  // Phase 2: Download all images (parallel, non-blocking)
  console.info(`\n🖼️  PHASE 2: Downloading ${imageUrls.size} images...\n`);

  const imageArray = Array.from(imageUrls);
  const batchSize = 10;

  for (let i = 0; i < imageArray.length; i += batchSize) {
    const batch = imageArray.slice(i, i + batchSize);
    const downloadPromises = batch.map((url, idx) => downloadImage(url, i + idx + 1));
    await Promise.allSettled(downloadPromises);
  }

  // Phase 3: Aggregate all contact info
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
      if (link.includes('facebook.com')) allContacts.social.facebook.push(link);
      if (link.includes('instagram.com')) allContacts.social.instagram.push(link);
      if (link.includes('twitter.com')) allContacts.social.twitter.push(link);
      if (link.includes('youtube.com')) allContacts.social.youtube.push(link);
      if (link.includes('tripadvisor.com')) allContacts.social.tripadvisor.push(link);
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
  console.info('✅ SCRAPING COMPLETE!\n');
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
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
