# Production Setup Guide

Complete guide for deploying the Mauritius Scuba Diving website to production.

## Table of Contents

1. [Google Tag Manager Setup](#google-tag-manager-setup)
2. [Google Analytics 4 Setup](#google-analytics-4-setup)
3. [Google reCAPTCHA Setup](#google-recaptcha-setup)
4. [Google Calendar API Setup](#google-calendar-api-setup)
5. [Backend API Setup](#backend-api-setup)
6. [Currency Exchange API](#currency-exchange-api)
7. [Domain Configuration](#domain-configuration)
8. [Environment Variables](#environment-variables)
9. [Deployment](#deployment)

---

## Google Tag Manager Setup

### 1. Create GTM Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click **Create Account**
3. Enter:
   - Account Name: "Mauritius Scuba Diving"
   - Country: Mauritius
   - Container Name: Your website URL
   - Target Platform: Web
4. Accept Terms of Service
5. Copy your **GTM Container ID** (format: GTM-XXXXXXX)

### 2. Configure GTM Container

1. In GTM dashboard, go to **Variables**
2. Enable all Built-in Variables
3. Create Custom Variables:

   **Data Layer Variables:**

   - Variable Name: `eventCategory`

     - Type: Data Layer Variable
     - Data Layer Variable Name: `eventCategory`

   - Variable Name: `eventAction`

     - Type: Data Layer Variable
     - Data Layer Variable Name: `eventAction`

   - Variable Name: `eventLabel`

     - Type: Data Layer Variable
     - Data Layer Variable Name: `eventLabel`

   - Variable Name: `eventValue`
     - Type: Data Layer Variable
     - Data Layer Variable Name: `eventValue`

### 3. Install GTM Code

The GTM code is already integrated in `src/index.jsx`. Just add your Container ID to `.env`:

```env
VITE_GTM_ID=GTM-XXXXXXX
```

### 4. Verify Installation

1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website
3. Click Tag Assistant icon
4. Verify GTM container is loading

---

## Google Analytics 4 Setup

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left)
3. Under Account, click **Create Property**
4. Enter:
   - Property Name: "Mauritius Scuba Diving Website"
   - Time Zone: (GMT+04:00) Mauritius
   - Currency: Mauritian Rupee (MUR)
5. Complete business information
6. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

### 2. Configure Data Streams

1. In Property, go to **Data Streams**
2. Click **Add stream** → **Web**
3. Enter your website URL
4. Enable **Enhanced measurement**
5. Toggle ON:
   - Page views
   - Scrolls
   - Outbound clicks
   - Site search
   - File downloads

### 3. Create Custom Events

Go to **Configure** → **Events** → **Create Event**

Create these custom events (they'll be triggered by GTM):

1. **contact_submit**

   - Matching conditions: event_name equals contact_submit
   - Conversions: Mark as conversion

2. **course_inquiry**

   - Matching conditions: event_name equals course_inquiry
   - Conversions: Mark as conversion

3. **booking_request**

   - Matching conditions: event_name equals booking_request
   - Conversions: Mark as conversion

4. **calendar_booking_complete**

   - Matching conditions: event_name equals calendar_booking_complete
   - Conversions: Mark as conversion
   - Add value parameter

5. **phone_click**
   - Matching conditions: event_name equals phone_click
   - Conversions: Mark as conversion

### 4. Link GA4 to GTM

1. In GTM, create new **Tag**
2. Tag Type: Google Analytics: GA4 Configuration
3. Measurement ID: Your G-XXXXXXXXXX
4. Trigger: All Pages
5. Save and Publish

### 5. Set Measurement ID in Environment

```env
VITE_GA4_ID=G-XXXXXXXXXX
```

---

## Google reCAPTCHA Setup

### 1. Register Site

1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click **+** (Register a new site)
3. Enter:
   - Label: "Mauritius Scuba Contact Form"
   - reCAPTCHA type: **reCAPTCHA v2** → "I'm not a robot"
   - Domains: yourwebsite.com (add localhost for testing)
4. Accept Terms of Service
5. Submit

### 2. Get Keys

Copy both keys:

- **Site Key** (public, used in frontend)
- **Secret Key** (private, used in backend)

### 3. Configure Frontend

```env
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

### 4. Configure Backend

Backend should verify reCAPTCHA token:

```javascript
// Node.js example
const axios = require("axios");

async function verifyRecaptcha(token) {
  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    }
  );
  return response.data.success;
}
```

---

## Google Calendar API Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Project name: "Scuba Diving Bookings"
4. Click **Create**

### 2. Enable Calendar API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### 3. Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Enter:
   - Name: "Booking System"
   - Description: "Service account for managing dive bookings"
4. Click **Create and Continue**
5. Grant role: **Project** → **Editor**
6. Click **Done**

### 4. Create Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON**
5. Download the JSON key file (keep it secure!)

### 5. Create Calendar

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click **+** next to "Other calendars"
3. Select **Create new calendar**
4. Enter:
   - Name: "Dive Bookings"
   - Time zone: (GMT+04:00) Mauritius
5. Click **Create calendar**

### 6. Share Calendar with Service Account

1. In Google Calendar, find your "Dive Bookings" calendar
2. Click the three dots → **Settings and sharing**
3. Scroll to **Share with specific people**
4. Click **Add people**
5. Enter the service account email from the JSON file
   (format: booking-system@project-id.iam.gserviceaccount.com)
6. Permission: **Make changes to events**
7. Click **Send**

### 7. Get Calendar ID

1. In Calendar Settings, scroll to **Integrate calendar**
2. Copy the **Calendar ID** (format: xxxxx@group.calendar.google.com)

### 8. Configure Environment

```env
VITE_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
```

### 9. Backend Configuration

Store the service account JSON key securely on your backend:

```javascript
// Node.js example with googleapis
const { google } = require("googleapis");

const calendar = google.calendar({
  version: "v3",
  auth: new google.auth.GoogleAuth({
    keyFile: "./service-account-key.json",
    scopes: ["https://www.googleapis.com/auth/calendar"],
  }),
});

// Check availability
async function checkAvailability(date, time) {
  const response = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    timeMin: new Date(date).toISOString(),
    timeMax: new Date(date).toISOString(),
    singleEvents: true,
  });
  // Check for conflicts
  return response.data.items.length === 0;
}

// Create booking
async function createBooking(bookingData) {
  const event = {
    summary: `${bookingData.itemName} - ${bookingData.name}`,
    description: `Participants: ${bookingData.participants}\nPhone: ${bookingData.phone}\nEmail: ${bookingData.email}`,
    start: {
      dateTime: new Date(
        `${bookingData.date}T${bookingData.time}`
      ).toISOString(),
      timeZone: "Indian/Mauritius",
    },
    end: {
      dateTime: new Date(
        new Date(`${bookingData.date}T${bookingData.time}`).getTime() +
          3 * 60 * 60 * 1000
      ).toISOString(),
      timeZone: "Indian/Mauritius",
    },
  };

  return calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    resource: event,
  });
}
```

---

## Backend API Setup

### Required Endpoints

Create a Node.js/Express backend with these endpoints:

#### 1. POST /api/contact

```javascript
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, inquiryType, message, recaptchaToken } = req.body;

  // Verify reCAPTCHA
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return res
      .status(400)
      .json({ success: false, error: "reCAPTCHA verification failed" });
  }

  // Send email notification
  await sendEmail({
    to: "info@mauritius-scuba.com",
    subject: `New Contact: ${inquiryType}`,
    body: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`,
  });

  // Save to database
  // ...

  res.json({ success: true });
});
```

#### 2. POST /api/booking

```javascript
app.post("/api/booking", async (req, res) => {
  const bookingData = req.body;

  // Check calendar availability
  const available = await checkAvailability(bookingData.date, bookingData.time);
  if (!available) {
    return res
      .status(409)
      .json({ success: false, error: "Time slot not available" });
  }

  // Create calendar event
  await createBooking(bookingData);

  // Send confirmation email
  await sendEmail({
    to: bookingData.email,
    subject: "Booking Confirmation",
    body: `Your booking for ${bookingData.itemName} has been received...`,
  });

  res.json({ success: true });
});
```

#### 3. GET /api/calendar/availability

```javascript
app.get("/api/calendar/availability", async (req, res) => {
  const { date, time } = req.query;
  const available = await checkAvailability(date, time);
  res.json({ available });
});
```

#### 4. GET /api/exchange-rates

```javascript
app.get("/api/exchange-rates", async (req, res) => {
  // Use a service like exchangerate-api.com or openexchangerates.org
  const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/MUR`
  );
  res.json({ rates: response.data.conversion_rates });
});
```

### Deployment

Deploy to:

- **Heroku**: `heroku create && git push heroku main`
- **Vercel**: `vercel --prod`
- **Railway**: `railway up`
- **AWS EC2**: Manual server setup

---

## Currency Exchange API

### Option 1: ExchangeRate-API (Recommended - Free tier available)

1. Sign up at [ExchangeRate-API](https://www.exchangerate-api.com/)
2. Get your API key
3. Free tier: 1,500 requests/month

```javascript
const response = await axios.get(
  `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/MUR`
);
```

### Option 2: Open Exchange Rates

1. Sign up at [OpenExchangeRates](https://openexchangerates.org/)
2. Free tier: 1,000 requests/month

```javascript
const response = await axios.get(
  `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`
);
```

---

## Domain Configuration

### 1. Register Domain

Register your domain with a provider like:

- Namecheap
- GoDaddy
- Google Domains

### 2. DNS Configuration

Add these DNS records:

```
Type  | Name | Value
------|------|------
A     | @    | Your server IP
CNAME | www  | yourwebsite.com
```

### 3. SSL Certificate

Most hosting providers offer free SSL (Let's Encrypt).

For manual setup:

```bash
sudo certbot --nginx -d yourwebsite.com -d www.yourwebsite.com
```

---

## Environment Variables

Create `.env` file with:

```env
# Google Services
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=your_site_key
VITE_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com

# API Configuration
VITE_API_ENDPOINT=https://api.yourwebsite.com/api

# Contact Information
VITE_PHONE_NUMBER=+230XXXXXXXX
VITE_WHATSAPP_NUMBER=+230XXXXXXXX
VITE_EMAIL=info@mauritius-scuba.com

# Social Media
VITE_FACEBOOK_URL=https://facebook.com/yourpage
VITE_INSTAGRAM_URL=https://instagram.com/yourpage
VITE_TWITTER_URL=https://twitter.com/yourpage
```

---

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel --prod
```

3. Add environment variables in Vercel dashboard

### Deploy to Netlify

1. Install Netlify CLI:

```bash
npm i -g netlify-cli
```

2. Deploy:

```bash
netlify deploy --prod
```

### Deploy to Traditional Hosting

1. Build the project
2. Upload `dist/` folder to your web server
3. Configure web server to serve `index.html` for all routes

**Nginx example:**

```nginx
server {
    listen 80;
    server_name yourwebsite.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Post-Deployment Checklist

- [ ] Test all forms with real submissions
- [ ] Verify Google Analytics tracking
- [ ] Test booking calendar integration
- [ ] Check reCAPTCHA on contact form
- [ ] Test currency conversion
- [ ] Verify phone/WhatsApp CTAs work
- [ ] Test on mobile devices
- [ ] Check page load speed (Google PageSpeed Insights)
- [ ] Verify SSL certificate
- [ ] Submit sitemap to Google Search Console
- [ ] Test all conversion events in GA4
- [ ] Link GA4 to Google Ads (see ADWORDS.md)

---

## Troubleshooting

### GTM Not Loading

- Check Container ID in `.env`
- Verify GTM code in browser console
- Check for ad blockers

### Calendar API Errors

- Verify service account permissions
- Check calendar sharing settings
- Ensure API is enabled in Google Cloud

### Currency Conversion Not Working

- Check API key validity
- Verify API endpoint
- Check network requests in browser DevTools

---

## Support

For technical support:

- Documentation: Check ADWORDS.md for Google Ads setup
- Email: dev@mauritius-scuba.com
