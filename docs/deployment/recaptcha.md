# reCAPTCHA Deployment

Implement Google reCAPTCHA for bot protection, spam prevention, and user verification in your SCUBA Bali application forms.

## Overview

reCAPTCHA provides:

- Bot detection and prevention
- Spam protection for forms
- User verification without friction
- Multiple integration options (v2, v3, Enterprise)
- Analytics and monitoring dashboard

## Prerequisites

- Google account
- reCAPTCHA site registration
- Basic understanding of form security

## Quick Setup

### 1. Register reCAPTCHA Site

1. **Go to Google reCAPTCHA Admin Console**
2. **Click "Create"**
3. **Fill site details:**
   - Label: "SCUBA Bali Production"
   - reCAPTCHA type: v3 (recommended) or v2 "I'm not a robot" Checkbox
   - Domains: Add your domain(s)
   - Click "Submit"

4. **Get site key and secret key**

### 2. Install reCAPTCHA Package

```bash
npm install react-google-recaptcha @types/react-google-recaptcha
```

### 3. Environment Variables

Add to your deployment platform:

```bash
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Important:** Never expose the secret key in client-side code. Keep it server-side only.

## reCAPTCHA v3 Implementation

### Basic Setup

```javascript
// src/components/ReCaptcha.jsx
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptcha = ({ onVerify, onExpired }) => {
  const recaptchaRef = useRef(null);

  const handleVerify = (token) => {
    onVerify(token);
  };

  const handleExpired = () => {
    onExpired && onExpired();
  };

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={handleVerify}
      onExpired={handleExpired}
      size="invisible"
    />
  );
};

export default ReCaptcha;
```

### Form Integration

```javascript
// src/components/ContactForm.jsx
import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        // Reset form
        setFormData({ name: '', email: '', message: '' });
        setRecaptchaToken(null);
        recaptchaRef.current.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      alert('Error sending message. Please try again.');
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={handleRecaptchaChange}
        size="invisible"
      />
      <button type="submit" disabled={!recaptchaToken}>
        Send Message
      </button>
    </form>
  );
};
```

## reCAPTCHA v2 Implementation

### Checkbox Version

```javascript
// src/components/ReCaptchaV2.jsx
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaV2 = ({ onVerify, onExpired }) => {
  return (
    <ReCAPTCHA
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={onVerify}
      onExpired={onExpired}
      theme="light" // or "dark"
      size="normal" // or "compact"
    />
  );
};
```

### Invisible Version

```javascript
// src/components/ReCaptchaInvisible.jsx
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaInvisible = ({ onVerify }) => {
  const recaptchaRef = useRef(null);

  const handleSubmit = async () => {
    const token = await recaptchaRef.current.executeAsync();
    onVerify(token);
    recaptchaRef.current.reset();
  };

  return (
    <>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        size="invisible"
        onChange={onVerify}
      />
      <button onClick={handleSubmit}>Submit Form</button>
    </>
  );
};
```

## Server-Side Verification

### Backend Verification (Node.js/Express)

```javascript
// server/routes/contact.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

router.post('/contact', async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;

  try {
    // Verify reCAPTCHA token
    const verificationResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    const { success, score, 'error-codes': errorCodes } = verificationResponse.data;

    if (!success) {
      return res.status(400).json({
        error: 'reCAPTCHA verification failed',
        details: errorCodes,
      });
    }

    // For v3, check score (0.0 - 1.0)
    if (score !== undefined && score < 0.5) {
      return res.status(400).json({
        error: 'Suspicious activity detected',
        score: score,
      });
    }

    // Process the form submission
    // Send email, save to database, etc.

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

### Verification Utility

```javascript
// src/utils/recaptcha.js
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export const verifyRecaptcha = async (token) => {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
      score: data.score,
      errorCodes: data['error-codes'],
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: error.message };
  }
};
```

## Advanced Configuration

### Score-Based Actions

For reCAPTCHA v3, implement different actions based on score:

```javascript
// src/utils/recaptchaActions.js
export const handleRecaptchaScore = (score) => {
  if (score >= 0.9) {
    // High confidence - proceed normally
    return 'allow';
  } else if (score >= 0.5) {
    // Medium confidence - add additional verification
    return 'challenge';
  } else {
    // Low confidence - block or require manual review
    return 'block';
  }
};

// Usage in form submission
const submitForm = async (token) => {
  const verification = await verifyRecaptcha(token);

  if (!verification.success) {
    throw new Error('reCAPTCHA verification failed');
  }

  const action = handleRecaptchaScore(verification.score);

  switch (action) {
    case 'allow':
      // Proceed with form submission
      await submitToAPI(formData);
      break;
    case 'challenge':
      // Show additional verification (e.g., v2 checkbox)
      showAdditionalVerification();
      break;
    case 'block':
      // Block submission
      throw new Error('Suspicious activity detected');
  }
};
```

### Multiple reCAPTCHA Instances

Handle multiple forms on the same page:

```javascript
// src/hooks/useRecaptcha.js
import { useRef, useCallback } from 'react';

export const useRecaptcha = () => {
  const recaptchaRefs = useRef(new Map());

  const registerRecaptcha = useCallback((id, ref) => {
    recaptchaRefs.current.set(id, ref);
  }, []);

  const executeRecaptcha = useCallback(async (id) => {
    const ref = recaptchaRefs.current.get(id);
    if (ref) {
      return await ref.current.executeAsync();
    }
    throw new Error(`reCAPTCHA with id ${id} not found`);
  }, []);

  const resetRecaptcha = useCallback((id) => {
    const ref = recaptchaRefs.current.get(id);
    if (ref) {
      ref.current.reset();
    }
  }, []);

  return {
    registerRecaptcha,
    executeRecaptcha,
    resetRecaptcha,
  };
};
```

## Error Handling

### Common Error Codes

```javascript
// src/utils/recaptchaErrors.js
const ERROR_MESSAGES = {
  'missing-input-secret': 'The secret parameter is missing',
  'invalid-input-secret': 'The secret parameter is invalid or malformed',
  'missing-input-response': 'The response parameter is missing',
  'invalid-input-response': 'The response parameter is invalid or malformed',
  'bad-request': 'The request is invalid or malformed',
  'timeout-or-duplicate':
    'The response is no longer valid: either is too old or has been used previously',
};

export const getErrorMessage = (errorCode) => {
  return ERROR_MESSAGES[errorCode] || 'Unknown reCAPTCHA error';
};
```

### Retry Logic

```javascript
// src/utils/recaptchaRetry.js
export const verifyWithRetry = async (token, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await verifyRecaptcha(token);
      if (result.success) {
        return result;
      }

      // If it's a temporary error, retry
      if (result.errorCodes?.includes('timeout-or-duplicate') && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};
```

## Testing and Development

### Test Keys

Google provides test keys for development:

```javascript
// Use these keys only for testing
const TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const TEST_SECRET_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
```

### Mock Implementation for Testing

```javascript
// src/utils/recaptchaMock.js
export const mockRecaptcha = {
  verify: async (token) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock successful verification
    return {
      success: true,
      score: 0.9,
      challenge_ts: new Date().toISOString(),
      hostname: window.location.hostname,
    };
  },
};

// Use in test environment
export const verifyRecaptcha = import.meta.env.DEV ? mockRecaptcha.verify : realVerifyRecaptcha;
```

## Analytics and Monitoring

### reCAPTCHA Dashboard

Monitor your reCAPTCHA usage:

1. **Go to reCAPTCHA Admin Console**
2. **View analytics:**
   - Verification success rates
   - Score distributions
   - Error rates by type
   - Traffic patterns

### Custom Analytics

Track reCAPTCHA performance in your analytics:

```javascript
// src/utils/recaptchaAnalytics.js
export const trackRecaptchaEvent = (event, data) => {
  if (window.gtag) {
    window.gtag('event', `recaptcha_${event}`, {
      event_category: 'reCAPTCHA',
      event_label: data?.error || 'success',
      value: data?.score || 0,
    });
  }

  // Also track in dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'recaptcha_event',
    recaptcha_event_type: event,
    recaptcha_data: data,
  });
};
```

## Security Considerations

### Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// src/middleware/rateLimit.js
const rateLimit = new Map();

export const checkRateLimit = (ip, maxRequests = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip);
  const recentRequests = requests.filter((time) => time > windowStart);

  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  return true;
};
```

### IP Whitelisting

Allow certain IPs to bypass reCAPTCHA:

```javascript
// src/utils/ipWhitelist.js
const WHITELISTED_IPS = [
  '127.0.0.1', // localhost
  '192.168.1.1', // office IP
];

export const isWhitelisted = (ip) => {
  return WHITELISTED_IPS.includes(ip);
};
```

## Accessibility

### Screen Reader Support

Ensure reCAPTCHA is accessible:

```javascript
// src/components/AccessibleRecaptcha.jsx
const AccessibleRecaptcha = ({ onVerify }) => {
  return (
    <div>
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={onVerify}
        size="invisible"
      />
      <div className="sr-only" aria-live="polite">
        reCAPTCHA verification completed
      </div>
    </div>
  );
};
```

## Troubleshooting

### Common Issues

**reCAPTCHA not loading:**

```javascript
// Check if script is loaded
console.log('reCAPTCHA loaded:', typeof grecaptcha !== 'undefined');

// Manual script loading
const loadRecaptchaScript = () => {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};
```

**Verification failing:**

- Check secret key is correct
- Verify token is not expired (2 minutes)
- Ensure token is used only once

**Low scores in development:**

- Use test keys for development
- Implement score thresholds appropriately
- Test with various user behaviors

### Debug Mode

Enable debug logging:

```javascript
// src/utils/recaptchaDebug.js
const DEBUG = import.meta.env.DEV;

export const debugRecaptcha = (message, data) => {
  if (DEBUG) {
    console.log(`[reCAPTCHA] ${message}`, data);
  }
};
```

## Best Practices

### Implementation

- Always verify tokens server-side
- Use appropriate reCAPTCHA version for your use case
- Implement proper error handling
- Test thoroughly in different environments

### User Experience

- Use invisible reCAPTCHA when possible
- Provide clear error messages
- Allow users to retry failed verifications
- Consider accessibility requirements

### Security

- Never expose secret keys in client code
- Implement rate limiting
- Monitor for suspicious activity
- Keep reCAPTCHA library updated

### Performance

- Load reCAPTCHA script asynchronously
- Use invisible version to reduce friction
- Cache verification results when appropriate
- Monitor impact on page load times
