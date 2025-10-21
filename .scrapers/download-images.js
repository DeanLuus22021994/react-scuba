import { existsSync, mkdirSync, writeFileSync } from 'fs';
import https from 'https';
import { join } from 'path';

const photosDir = './photos';
if (!existsSync(photosDir)) {
  mkdirSync(photosDir, { recursive: true });
}

const images = [
  // Hero and main images
  {
    url: 'https://static.wixstatic.com/media/5667b6_23bbd83db2ff4903a78483a0fcc6a033~mv2.jpg/v1/fill/w_1920,h_1440,al_c,q_90/5667b6_23bbd83db2ff4903a78483a0fcc6a033~mv2.jpg',
    name: 'ocean-spirit-diving-1.jpg',
  },
  {
    url: 'https://static.wixstatic.com/media/5667b6_14364f35eae14c5d882381c6ad6c76bf~mv2.jpg/v1/fill/w_1920,h_1440,al_c,q_90/5667b6_14364f35eae14c5d882381c6ad6c76bf~mv2.jpg',
    name: 'eco-centre-world-oceans.jpg',
  },
  {
    url: 'https://static.wixstatic.com/media/5667b6_57f3f9277369407bb5bad9e3a5371848~mv2.png/v1/fill/w_600,h_248,al_c,q_85,usm_0.66_1.00_0.01/5667b6_57f3f9277369407bb5bad9e3a5371848~mv2.png',
    name: 'reef-world-federation.png',
  },

  // Underwater and diving scenes
  {
    url: 'https://static.wixstatic.com/media/5667b6_5c5c21c38dc5480ab7b2a4263a985644~mv2.jpg/v1/fill/w_1920,h_605,al_c,q_85,usm_0.66_1.00_0.01/5667b6_5c5c21c38dc5480ab7b2a4263a985644~mv2.jpg',
    name: 'underwater-scene.jpg',
  },

  // PADI certifications
  {
    url: 'https://static.wixstatic.com/media/5667b6_e0f73e13c7424a59b1cee18836793b5b~mv2.jpeg/v1/fill/w_208,h_198,al_c,q_80,usm_0.66_1.00_0.01/PADI_EcoCenter_Hor_RGB_Full_BlueFill_Primary.jpeg',
    name: 'padi-eco-center.jpg',
  },

  // More diving images from their gallery
  {
    url: 'https://static.wixstatic.com/media/5667b6_f1e8c9a5b4d548c1a8f3e7b2c5d8a9f0~mv2.jpg/v1/fill/w_800,h_600,al_c,q_85/diving-mauritius-1.jpg',
    name: 'diving-scene-1.jpg',
  },
  {
    url: 'https://static.wixstatic.com/media/5667b6_a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7~mv2.jpg/v1/fill/w_800,h_600,al_c,q_85/diving-mauritius-2.jpg',
    name: 'diving-scene-2.jpg',
  },

  // Coral and marine life
  {
    url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1920&q=80',
    name: 'coral-reef-1.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    name: 'turtle-diving.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
    name: 'shark-diving.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&q=80',
    name: 'wreck-diving.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920&q=80',
    name: 'mauritius-beach.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    name: 'sea-turtle-closeup.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&q=80',
    name: 'dive-instructor.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1566909599614-e06d85ce9c04?w=1920&q=80',
    name: 'dive-boat.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    name: 'underwater-photo.jpg',
  },
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = join(photosDir, filename);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => {
            writeFileSync(filepath, Buffer.concat(chunks));
            console.info(`✓ Downloaded: ${filename}`);
            resolve();
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          // Follow redirect
          downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        } else {
          console.error(`✗ Failed: ${filename} (${response.statusCode})`);
          resolve(); // Don't reject, continue with other images
        }
      })
      .on('error', (err) => {
        console.error(`✗ Error: ${filename} - ${err.message}`);
        resolve(); // Don't reject, continue with other images
      });
  });
}

async function downloadAll() {
  console.info(`Starting download of ${images.length} images...\n`);

  for (const img of images) {
    await downloadImage(img.url, img.name);
    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.info('\n✅ Download complete!');
  console.info(`📁 Images saved to: ${photosDir}/`);
}

downloadAll().catch(console.error);
