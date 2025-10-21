# Google Ads Conversion Tracking Setup

Complete guide for setting up Google Ads conversion tracking to optimize AdWords campaigns for the Mauritius Scuba Diving website.

## Table of Contents

1. [Google Ads Account Setup](#google-ads-account-setup)
2. [Link Google Ads to Google Analytics 4](#link-google-ads-to-google-analytics-4)
3. [Import GA4 Conversions to Google Ads](#import-ga4-conversions-to-google-ads)
4. [Conversion Values](#conversion-values)
5. [Enhanced Conversions](#enhanced-conversions)
6. [Campaign Structure](#campaign-structure)
7. [Tracking Validation](#tracking-validation)
8. [Optimization Tips](#optimization-tips)

---

## Google Ads Account Setup

### 1. Create Google Ads Account

1. Go to [Google Ads](https://ads.google.com/)
2. Click **Start Now**
3. Follow the setup wizard:
   - Business name: Mauritius Scuba Diving
   - Website: yourwebsite.com
   - Business location: Mauritius
4. Skip campaign creation for now
5. Switch to **Expert Mode**

### 2. Account Structure

Create this account structure:

```
Account: Mauritius Scuba Diving
├── Campaign 1: Search - Dive Courses
│   ├── Ad Group: Open Water Course
│   ├── Ad Group: Advanced Course
│   └── Ad Group: Discover Scuba
├── Campaign 2: Search - Dive Sites
│   ├── Ad Group: Blue Bay
│   ├── Ad Group: Coin de Mire
│   └── Ad Group: General Diving
└── Campaign 3: Display - Remarketing
    └── Ad Group: Website Visitors
```

### 3. Set Billing

1. Go to **Tools & Settings** → **Billing**
2. Add payment method
3. Set budget alerts

---

## Link Google Ads to Google Analytics 4

### 1. In Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left)
3. In the **Property** column, click **Google Ads Links**
4. Click **Link**
5. Select your Google Ads account
6. Click **Next**
7. Enable:
   - ✅ Personalized advertising
   - ✅ Enable data import
8. Click **Submit**

### 2. In Google Ads

1. Go to [Google Ads](https://ads.google.com/)
2. Click **Tools & Settings** → **Linked accounts**
3. Find **Google Analytics (GA4) & Firebase**
4. Click **Details**
5. Verify the link shows as "Connected"

---

## Import GA4 Conversions to Google Ads

### 1. Create Conversions in GA4

All conversions are already implemented in the code (`src/utils/analytics.js`):

1. **contact_submit** - Contact form submission
2. **course_inquiry** - Course information request
3. **booking_request** - Booking inquiry submitted
4. **calendar_booking_complete** - Calendar booking confirmed
5. **phone_click** - Phone number clicked
6. **whatsapp_click** - WhatsApp button clicked

### 2. Import to Google Ads

1. In Google Ads, go to **Tools & Settings** → **Conversions**
2. Click **+ New conversion action**
3. Select **Import**
4. Choose **Google Analytics 4 properties**
5. Click **Continue**
6. Select these events:
   - ✅ contact_submit
   - ✅ course_inquiry
   - ✅ booking_request
   - ✅ calendar_booking_complete
   - ✅ phone_click
   - ✅ whatsapp_click
7. Click **Import and Continue**

### 3. Configure Each Conversion

For each imported conversion, click **Edit settings** and configure:

#### contact_submit

- **Goal**: Submit lead form
- **Value**: Use different values for each conversion (see below)
- **Count**: Every conversion
- **Conversion window**: 30 days
- **View-through conversion window**: 1 day
- **Attribution model**: Data-driven

#### course_inquiry

- **Goal**: Submit lead form
- **Value**: 2,000 MUR ($45 USD)
- **Count**: Every conversion
- **Conversion window**: 30 days
- **Attribution model**: Data-driven

#### booking_request

- **Goal**: Book appointment
- **Value**: 5,000 MUR ($112 USD)
- **Count**: Every conversion
- **Conversion window**: 30 days
- **Attribution model**: Data-driven

#### calendar_booking_complete

- **Goal**: Purchase
- **Value**: Use transaction-specific value (passed from website)
- **Count**: One
- **Conversion window**: 30 days
- **Attribution model**: Data-driven

#### phone_click

- **Goal**: Submit lead form
- **Value**: 1,500 MUR ($34 USD)
- **Count**: Every conversion
- **Conversion window**: 1 day
- **Attribution model**: Last click

#### whatsapp_click

- **Goal**: Submit lead form
- **Value**: 1,200 MUR ($27 USD)
- **Count**: Every conversion
- **Conversion window**: 1 day
- **Attribution model**: Last click

---

## Conversion Values

Recommended conversion values based on typical customer journey:

### Micro Conversions (Top of Funnel)

| Action         | Value (MUR) | Value (USD) | Reasoning          |
| -------------- | ----------- | ----------- | ------------------ |
| Phone Click    | 1,500       | $34         | 20% likely to book |
| WhatsApp Click | 1,200       | $27         | 15% likely to book |
| Contact Form   | 2,000       | $45         | 25% likely to book |
| Course Inquiry | 2,000       | $45         | High intent        |

### Macro Conversions (Bottom of Funnel)

| Action           | Value (MUR)  | Value (USD) | Reasoning              |
| ---------------- | ------------ | ----------- | ---------------------- |
| Booking Request  | 5,000        | $112        | 50% likely to complete |
| Calendar Booking | Actual Price | Variable    | Confirmed booking      |

### Course Values (for Calendar Bookings)

| Course         | Price (MUR) | Price (USD) |
| -------------- | ----------- | ----------- |
| Discover Scuba | 4,500       | $100        |
| Open Water     | 15,000      | $335        |
| Advanced       | 12,000      | $268        |
| Rescue         | 14,000      | $313        |
| Divemaster     | 45,000      | $1,005      |

### Dive Trip Values

| Dive Type   | Price (MUR) | Price (USD) |
| ----------- | ----------- | ----------- |
| Single Dive | 2,500       | $56         |
| Double Dive | 4,000       | $89         |
| Night Dive  | 3,500       | $78         |

### Calculating ROI

To determine if your ads are profitable:

1. **Track Cost Per Conversion**:

   - Total Ad Spend ÷ Number of Conversions = Cost Per Conversion

2. **Compare to Conversion Value**:

   - If Cost Per Conversion < Conversion Value = Profitable
   - If Cost Per Conversion > Conversion Value = Losing money

3. **Target ROAS** (Return on Ad Spend):
   - Recommended: 400% (4:1 ratio)
   - Formula: (Conversion Value ÷ Cost) × 100

**Example:**

- You spend 10,000 MUR on ads
- You get 8 bookings worth 15,000 MUR each
- Total revenue: 120,000 MUR
- ROAS: (120,000 ÷ 10,000) × 100 = 1,200%
- **Result: Very profitable!**

---

## Enhanced Conversions

Enhanced conversions improve tracking accuracy by sending hashed user data.

### 1. Enable in Google Ads

1. Go to **Tools & Settings** → **Conversions**
2. Select a conversion action
3. Click **Settings**
4. Under **Enhanced conversions**, toggle **Turn on enhanced conversions**
5. Select **Google Tag Manager** as implementation method
6. Click **Save**

### 2. Configure in GTM

1. In Google Tag Manager, go to **Variables**
2. Create new **User-Provided Data** variables:

   - Email
   - Phone Number
   - First Name
   - Last Name
   - Address

3. Update conversion tags to include user data

### 3. Website Implementation

The code already collects this data in ContactModal and BookingModal:

```javascript
// In ContactModal.jsx and BookingModal.jsx
const submissionData = {
  name: data.name,
  email: data.email,
  phone: data.phone,
  // ... other fields
};
```

This data is automatically passed to GA4 and can be used for enhanced conversions.

---

## Campaign Structure

### Search Campaign 1: Dive Courses

**Budget**: 200 MUR/day ($5/day)

**Ad Groups:**

#### Open Water Course

Keywords:

- "open water course mauritius"
- "padi open water mauritius"
- "scuba certification mauritius"
- "learn to dive mauritius"

Ad:

```
Headline 1: PADI Open Water Course
Headline 2: Certified in 3-4 Days
Headline 3: Book Your Mauritius Course
Description 1: Expert PADI instructors, small groups, modern equipment. Start your diving adventure today!
Description 2: From 15,000 MUR. Free online learning included.
```

#### Advanced Course

Keywords:

- "advanced open water mauritius"
- "padi advanced mauritius"
- "advanced diving course"

#### Discover Scuba

Keywords:

- "try scuba diving mauritius"
- "first time diving mauritius"
- "discover scuba mauritius"
- "diving for beginners"

### Search Campaign 2: Dive Sites

**Budget**: 150 MUR/day ($3.50/day)

**Ad Groups:**

#### Blue Bay

Keywords:

- "blue bay diving"
- "dive blue bay mauritius"
- "blue bay marine park diving"

#### Coin de Mire

Keywords:

- "coin de mire diving"
- "diving north mauritius"
- "best dive sites mauritius"

### Display Campaign 3: Remarketing

**Budget**: 100 MUR/day ($2.50/day)

**Audience**: Website visitors who didn't convert

**Ad Creative**:

- Images of underwater scenes
- "Book Your Mauritius Dive" CTA
- Special offer: "10% off your first course"

---

## Tracking Validation

### 1. Test Conversions

1. **Install Google Tag Assistant**:

   - Chrome extension: [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)

2. **Test Each Conversion**:

   - Visit your website
   - Enable Tag Assistant
   - Complete a conversion action (e.g., submit contact form)
   - Verify the event fires in Tag Assistant

3. **Check GA4 Real-Time**:

   - Go to GA4 → **Reports** → **Realtime**
   - Verify conversion events appear

4. **Check Google Ads**:
   - Go to Google Ads → **Tools** → **Conversions**
   - Look for test conversions (may take 24 hours to appear)

### 2. UTM Parameters

Use UTM parameters in your Google Ads campaigns to track sources:

```
https://yourwebsite.com/?utm_source=google&utm_medium=cpc&utm_campaign=dive_courses&utm_content=open_water
```

Google Ads automatically adds UTM parameters, but verify in **Campaign settings** → **Campaign URL options**.

### 3. Conversion Tracking Checklist

- [ ] GTM container installed and firing
- [ ] GA4 property receiving data
- [ ] All conversion events marked as conversions in GA4
- [ ] Conversions imported to Google Ads
- [ ] Conversion values configured
- [ ] Test conversions verified in Google Ads
- [ ] Enhanced conversions enabled
- [ ] UTM parameters added to campaigns

---

## Optimization Tips

### 1. Bidding Strategies

**Start with:**

- **Manual CPC** - Full control, learn what works
- Bid: 5-10 MUR per click

**After 30 conversions, switch to:**

- **Maximize Conversions** - Automated bidding
- Set Target CPA (Cost Per Acquisition)
- Target: 1,000-2,000 MUR per booking

**After 50 conversions:**

- **Maximize Conversion Value** - Focus on high-value bookings
- Set Target ROAS: 400%

### 2. Keyword Optimization

**Weekly tasks:**

1. Check **Search Terms Report**
2. Add high-performing search terms as keywords
3. Add negative keywords for irrelevant searches
4. Pause keywords with high cost, zero conversions

**Common negative keywords for dive center:**

- diving equipment (unless you sell it)
- free diving
- jobs
- salary
- certification cost

### 3. Ad Testing

**Test 2-3 ad variations per ad group:**

- Different headlines
- Different descriptions
- Different CTAs

**After 100 clicks, pause low-performing ads**

### 4. Landing Page Optimization

**Best practices:**

- Direct to relevant page (e.g., Courses ad → Courses page)
- Clear CTA above the fold
- Mobile-optimized
- Fast loading (< 3 seconds)
- Trust signals (PADI certification, reviews)

### 5. Audience Targeting

**Create audiences in GA4:**

1. **High-Intent Visitors**:

   - Visited Courses page
   - Spent > 2 minutes on site
   - Visited > 3 pages

2. **Cart Abandoners**:

   - Started booking form
   - Didn't complete

3. **Past Customers**:
   - Completed booking
   - (Exclude from acquisition campaigns)

### 6. Seasonal Adjustments

**High season** (May-December):

- Increase budgets by 30-50%
- Add seasonal keywords (e.g., "summer diving")
- Bid more aggressively

**Low season** (January-April):

- Reduce budgets
- Focus on brand awareness
- Run special promotions

### 7. Competitor Analysis

**Monitor competitors:**

1. Search your keywords
2. Note competitor ads
3. Visit competitor websites
4. Identify gaps in your offering

**Use Auction Insights:**

- Google Ads → **Campaigns** → **Auction Insights**
- Compare your impression share
- Identify top competitors

### 8. Quality Score Improvement

**Quality Score factors:**

1. **Expected CTR** - Write compelling ads
2. **Ad Relevance** - Match keywords to ad copy
3. **Landing Page Experience** - Fast, relevant, mobile-friendly

**Check Quality Score:**

- Add "Quality Score" column to keywords view
- Aim for 7-10 for all keywords
- Pause keywords with QS < 5

---

## Monthly Reporting

Track these metrics monthly:

| Metric              | Target      | Formula                      |
| ------------------- | ----------- | ---------------------------- |
| Impressions         | 10,000+     | -                            |
| Clicks              | 200+        | -                            |
| CTR                 | 5%+         | (Clicks ÷ Impressions) × 100 |
| CPC                 | < 10 MUR    | Cost ÷ Clicks                |
| Conversions         | 20+         | -                            |
| Conversion Rate     | 10%+        | (Conversions ÷ Clicks) × 100 |
| Cost Per Conversion | < 2,000 MUR | Cost ÷ Conversions           |
| ROAS                | 400%+       | (Revenue ÷ Cost) × 100       |

---

## Troubleshooting

### Conversions Not Tracking

1. **Check GTM**:

   - GTM Preview mode
   - Verify dataLayer events fire

2. **Check GA4**:

   - Realtime report
   - Debug View (install GA4 Debugger extension)

3. **Check Google Ads**:
   - Conversion status should be "Recording conversions"
   - Not "No recent conversions" (after 7 days)

### Low Conversion Rate

**Possible causes:**

1. Poor ad targeting - keywords too broad
2. Weak ad copy - doesn't match search intent
3. Wrong landing page - not relevant to ad
4. High prices - not competitive
5. Poor website UX - slow, confusing, not mobile-friendly

### High Cost Per Conversion

**Solutions:**

1. Lower bids on expensive keywords
2. Add negative keywords
3. Improve Quality Score
4. Target more specific keywords (long-tail)
5. Improve landing pages

---

## Advanced Strategies

### 1. Smart Bidding with Value

Once you have enough data (50+ conversions):

```
Target ROAS = (Average Order Value ÷ Target CPA) × 100
```

**Example:**

- Average booking value: 15,000 MUR
- Target CPA: 3,000 MUR
- Target ROAS: (15,000 ÷ 3,000) × 100 = 500%

### 2. Dynamic Remarketing

Show specific courses/dives users viewed:

1. Set up **dynamic remarketing feed**
2. Upload product catalog (courses, dive trips)
3. Create dynamic ads
4. Target users who viewed specific pages

### 3. Maximize Value with Smart Bidding

```
In Google Ads:
1. Campaign Settings → Bidding
2. Select "Maximize conversion value"
3. Set target ROAS: 400%
4. Let algorithm optimize bids
```

---

## Resources

- [Google Ads Help Center](https://support.google.com/google-ads)
- [GA4 Documentation](https://support.google.com/analytics)
- [Google Tag Manager Help](https://support.google.com/tagmanager)
- [Google Ads Certification](https://skillshop.withgoogle.com/)

---

## Support

For Google Ads management assistance:

- Email: marketing@mauritius-scuba.com
- Phone: +230 XXXX XXXX

Consider hiring a certified Google Ads specialist if monthly ad spend > 20,000 MUR.
