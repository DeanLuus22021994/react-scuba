# Ocean Spirit Data

The oceanSpirit data structure contains comprehensive business information, contact details, certifications, and content for the Ocean Spirit Scuba Diving Mauritius website.

## Business Information

### Basic Details

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

console.log(oceanSpiritContent.name);
// "Ocean Spirit Scuba Diving Mauritius"

console.log(oceanSpiritContent.tagline);
// "PADI 5 Star ECO Green Fins Scuba Diving Centre"
```

## Contact Information

### Contact Details

```javascript
const { contact } = oceanSpiritContent;

console.log(contact);
// {
//   whatsapp: '+230 5255 2732',
//   office: '+230 2634468',
//   email: 'info@osdiving.com',
//   location: 'Coastal Road Pereybere Mauritius',
//   googleMapsUrl: 'https://goo.gl/maps/TQAZLNVg7Jk9MtfG7'
// }
```

### Contact Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function ContactInfo() {
  const { contact } = oceanSpiritContent;

  return (
    <div className="contact-info">
      <h3>Contact Ocean Spirit</h3>
      <div className="contact-methods">
        <a href={`https://wa.me/${contact.whatsapp.replace(/\s+/g, '')}`}>
          WhatsApp: {contact.whatsapp}
        </a>
        <a href={`tel:${contact.office}`}>Office: {contact.office}</a>
        <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
        <a href={contact.googleMapsUrl} target="_blank" rel="noopener">
          Location: {contact.location}
        </a>
      </div>
    </div>
  );
}
```

## About Content

### About Sections

```javascript
const { about } = oceanSpiritContent;

console.log(about.description);
// "Scuba diving in Mauritius means that from the day you arrive..."

console.log(about.instructors);
// "Our patient skilled PADI Instructors focus on safety..."

console.log(about.diving);
// "Diving Mauritius is in warm water, with good visibility..."

console.log(about.values);
// "Ocean Spirit Scuba Diving has grown in its commitment..."
```

### About Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function AboutSection() {
  const { about } = oceanSpiritContent;

  return (
    <section className="about-section">
      <h2>About Ocean Spirit</h2>
      <p>{about.description}</p>

      <div className="about-highlights">
        <div className="highlight">
          <h3>Our Instructors</h3>
          <p>{about.instructors}</p>
        </div>
        <div className="highlight">
          <h3>Diving in Mauritius</h3>
          <p>{about.diving}</p>
        </div>
        <div className="highlight">
          <h3>Our Values</h3>
          <p>{about.values}</p>
        </div>
      </div>
    </section>
  );
}
```

## Certifications and Specialties

### Certifications

```javascript
const { certifications } = oceanSpiritContent;

console.log(certifications);
// [
//   'PADI 5 Star ECO Centre',
//   'Green Fins Member',
//   'Reef-World Federation Partner',
//   'Green Star Rating'
// ]
```

### Specialties

```javascript
const { specialties } = oceanSpiritContent;

console.log(specialties);
// [
//   'Wreck Diving',
//   'Turtle Diving',
//   'Shark Diving',
//   'Macro Photography',
//   'Deep Diving',
//   'Coral Reef Exploration',
//   'Open Water Shark Diving (45 min boat ride to Mascarene Plateau)'
// ]
```

### Certifications Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function CertificationsSection() {
  const { certifications, specialties } = oceanSpiritContent;

  return (
    <section className="certifications-section">
      <h2>Certifications & Specialties</h2>

      <div className="certifications">
        <h3>Our Certifications</h3>
        <ul>
          {certifications.map((cert, index) => (
            <li key={index}>{cert}</li>
          ))}
        </ul>
      </div>

      <div className="specialties">
        <h3>Diving Specialties</h3>
        <ul>
          {specialties.map((specialty, index) => (
            <li key={index}>{specialty}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

## Temperature Information

### Seasonal Temperatures

```javascript
const { temperature } = oceanSpiritContent;

console.log(temperature.summer);
// {
//   air: { range: '28°C - 35°C', months: 'November - May' },
//   water: { range: '26°C - 29°C' }
// }

console.log(temperature.winter);
// {
//   air: { range: '18°C - 28°C', months: 'April - October' },
//   water: { range: '23°C - 25°C' }
// }
```

### Temperature Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function TemperatureInfo() {
  const { temperature } = oceanSpiritContent;

  return (
    <div className="temperature-info">
      <h3>Diving Temperatures</h3>

      <div className="season summer">
        <h4>Summer Season ({temperature.summer.air.months})</h4>
        <p>Air: {temperature.summer.air.range}</p>
        <p>Water: {temperature.summer.water.range}</p>
      </div>

      <div className="season winter">
        <h4>Winter Season ({temperature.winter.air.months})</h4>
        <p>Air: {temperature.winter.air.range}</p>
        <p>Water: {temperature.winter.water.range}</p>
      </div>
    </div>
  );
}
```

## Special Offers

### Current Offers

```javascript
const { offers } = oceanSpiritContent;

console.log(offers);
// [
//   {
//     name: 'Discover Scuba Diving',
//     description: 'PADI and Ocean Spirit - Step one of your PADI Open Water Certification',
//     type: 'Couples DSD Special'
//   },
//   {
//     name: 'Best of the North - 10 Dive Package',
//     price: 'MUR 20,000',
//     includes: ['10 dives total', '2 dive Safari to Coin de Mire island', 'Trou Aux Biches diving']
//   }
// ]
```

### Offers Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function SpecialOffers() {
  const { offers } = oceanSpiritContent;

  return (
    <section className="special-offers">
      <h2>Special Offers</h2>
      {offers.map((offer, index) => (
        <div key={index} className="offer-card">
          <h3>{offer.name}</h3>
          <p>{offer.description}</p>
          {offer.type && <span className="offer-type">{offer.type}</span>}
          {offer.price && <div className="price">{offer.price}</div>}
          {offer.includes && (
            <ul>
              {offer.includes.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
```

## Dive Sites

### Featured Dive Sites

```javascript
const { diveSites } = oceanSpiritContent;

console.log(diveSites);
// [
//   'Coin de Mire Island',
//   'Trou Aux Biches',
//   'Djabeda Ship Wreck',
//   'Shallow Coral Reef',
//   'Whale Rock',
//   'Deep sites around Northern Mauritius'
// ]
```

## Social Media Links

### Social Media Profiles

```javascript
const { social } = oceanSpiritContent;

console.log(social);
// {
//   facebook: 'https://www.facebook.com/oceanspiritdiving/',
//   instagram: 'https://www.instagram.com/divingmauritius/',
//   twitter: 'https://twitter.com/OceanSpirit13',
//   youtube: 'https://www.youtube.com/user/oceandivermu',
//   tripAdvisor: 'https://www.tripadvisor.com.my/Attraction_Review-...'
// }
```

### Social Links Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function SocialLinks() {
  const { social } = oceanSpiritContent;

  return (
    <div className="social-links">
      <a href={social.facebook} target="_blank" rel="noopener">
        Facebook
      </a>
      <a href={social.instagram} target="_blank" rel="noopener">
        Instagram
      </a>
      <a href={social.twitter} target="_blank" rel="noopener">
        Twitter
      </a>
      <a href={social.youtube} target="_blank" rel="noopener">
        YouTube
      </a>
      <a href={social.tripAdvisor} target="_blank" rel="noopener">
        TripAdvisor
      </a>
    </div>
  );
}
```

## Images

### Brand Images

```javascript
const { images } = oceanSpiritContent;

console.log(images);
// {
//   logo: '/photos/logo-ocean-spirit.png',
//   hero: '/photos/hero-ocean-spirit.jpg',
//   banner: '/photos/banner-underwater.jpg'
// }
```

## Complete Data Structure

```javascript
{
  name: 'Ocean Spirit Scuba Diving Mauritius',
  tagline: 'PADI 5 Star ECO Green Fins Scuba Diving Centre',

  contact: {
    whatsapp: '+230 5255 2732',
    office: '+230 2634468',
    email: 'info@osdiving.com',
    location: 'Coastal Road Pereybere Mauritius',
    googleMapsUrl: 'https://goo.gl/maps/TQAZLNVg7Jk9MtfG7'
  },

  about: {
    description: '...',
    instructors: '...',
    diving: '...',
    values: '...'
  },

  certifications: ['PADI 5 Star ECO Centre', 'Green Fins Member', ...],
  specialties: ['Wreck Diving', 'Turtle Diving', ...],

  temperature: {
    summer: { air: {...}, water: {...} },
    winter: { air: {...}, water: {...} }
  },

  offers: [
    { name: '...', description: '...', type: '...', price: '...', includes: [...] },
    ...
  ],

  diveSites: ['Coin de Mire Island', 'Trou Aux Biches', ...],

  social: {
    facebook: '...',
    instagram: '...',
    twitter: '...',
    youtube: '...',
    tripAdvisor: '...'
  },

  images: {
    logo: '/photos/logo-ocean-spirit.png',
    hero: '/photos/hero-ocean-spirit.jpg',
    banner: '/photos/banner-underwater.jpg'
  }
}
```

## Usage Examples

### Business Header Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function BusinessHeader() {
  return (
    <header className="business-header">
      <img src={oceanSpiritContent.images.logo} alt={oceanSpiritContent.name} />
      <h1>{oceanSpiritContent.name}</h1>
      <p>{oceanSpiritContent.tagline}</p>
    </header>
  );
}
```

### Footer Component

```javascript
import { oceanSpiritContent } from '@/data/oceanSpirit';

function Footer() {
  const { contact, social } = oceanSpiritContent;

  return (
    <footer className="footer">
      <div className="contact-info">
        <p>{contact.location}</p>
        <p>{contact.office}</p>
        <p>{contact.email}</p>
      </div>
      <SocialLinks />
    </footer>
  );
}
```
