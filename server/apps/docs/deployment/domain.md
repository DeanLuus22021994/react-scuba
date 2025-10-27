# Domain Configuration

Configure custom domains, DNS settings, SSL certificates, and CDN for your SCUBA Bali deployment.

## Domain Registration

### Choosing a Domain

**Recommended domain registrars:**

- Namecheap - Affordable with good support
- Porkbun - Privacy-focused with competitive pricing
- Google Domains - Simple interface with reliable service
- Cloudflare Registrar - Integrated with CDN services

**Domain tips:**

- Keep it short and memorable
- Use .com for commercial sites
- Consider local TLDs (.id for Indonesia)
- Check availability with WHOIS tools

### DNS Basics

**DNS Record Types:**

- **A Record**: Points domain to IPv4 address
- **AAAA Record**: Points domain to IPv6 address
- **CNAME Record**: Aliases one domain to another
- **MX Record**: Email server configuration
- **TXT Record**: Verification and SPF records

## Platform-Specific Domain Setup

### GitHub Pages

1. **Enable custom domain in repository settings**
   - Go to Settings → Pages
   - Enter your custom domain
   - Save changes

2. **Configure DNS records**

```text
# For apex domain (scubabali.com)
A Record: @ → 185.199.108.153
A Record: @ → 185.199.109.153
A Record: @ → 185.199.110.153
A Record: @ → 185.199.111.153

# For www subdomain (www.scubabali.com)
CNAME: www → yourusername.github.io
```

3. **SSL Certificate**
   - GitHub Pages automatically provisions SSL
   - Enable "Enforce HTTPS" in repository settings

### Netlify

1. **Add domain in Netlify dashboard**
   - Site Settings → Domain Management
   - Add custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration**

```text
# Primary domain
A Record: @ → 75.2.60.5

# www subdomain
CNAME: www → your-site.netlify.app
```

3. **Automatic SSL**
   - Netlify provides free SSL certificates
   - Automatic renewal and HTTP → HTTPS redirects

### Vercel

1. **Configure domain in Vercel dashboard**
   - Project Settings → Domains
   - Add your custom domain

2. **DNS Setup**

```text
# Primary domain
A Record: @ → 76.76.21.21

# www subdomain
CNAME: www → cname.vercel-dns.com
```

3. **SSL & Performance**
   - Automatic SSL certificate provisioning
   - Global CDN with edge network

## SSL/TLS Configuration

### Certificate Types

**DV (Domain Validated)** - Basic validation, free
**OV (Organization Validated)** - Business verification, paid
**EV (Extended Validation)** - Highest trust level, paid

### SSL Best Practices

```nginx
# nginx configuration for SSL
server {
    listen 443 ssl http2;
    server_name scubabali.com www.scubabali.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS header
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### SSL Testing

**Test your SSL configuration:**

```bash
# Check certificate
openssl s_client -connect scubabali.com:443 -servername scubabali.com

# SSL Labs test
curl -s https://www.ssllabs.com/ssltest/analyze.html?d=scubabali.com
```

## CDN Configuration

### Content Delivery Networks

**Cloudflare (Recommended for most sites):**

- Free tier with excellent performance
- DDoS protection and security features
- Easy DNS management

**CloudFront (AWS):**

- Integrated with AWS ecosystem
- Advanced caching and performance features
- Pay-as-you-go pricing

**Fastly:**

- Real-time content purging
- Advanced VCL customization
- Enterprise-grade features

### Cloudflare Setup

1. **Sign up for Cloudflare**
2. **Add your domain**
3. **Update nameservers**

```text
# Cloudflare nameservers (example)
ns1.cloudflare.com
ns2.cloudflare.com
```

4. **Configure DNS records**

```text
# Point to your origin server
CNAME: @ → your-deployment-url.netlify.app
CNAME: www → your-deployment-url.netlify.app
```

5. **Enable performance features**
   - Auto Minify (HTML, CSS, JS)
   - Brotli compression
   - HTTP/2 and HTTP/3
   - Always Online (caches pages for offline access)

### CDN Optimization

**Cache Configuration:**

```javascript
// Cache headers for static assets
const cacheHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'CDN-Cache-Control': 'max-age=31536000',
  'Vercel-CDN-Cache-Control': 'max-age=31536000',
};
```

**Dynamic Content:**

- Set appropriate cache times for API responses
- Use cache-busting for updated assets
- Implement proper ETags

## DNS Management

### DNS Propagation

**Propagation time:**

- A/CNAME records: 5-30 minutes
- NS changes: 24-48 hours
- Full propagation: up to 72 hours globally

**Check propagation:**

```bash
# Check DNS resolution
dig scubabali.com

# Global propagation check
curl -s https://www.whatsmydns.net/#A/scubabali.com
```

### DNS Security

**DNSSEC Setup:**

```bash
# Generate DNSSEC keys
dnssec-keygen -a RSASHA256 -b 2048 scubabali.com

# Add DS records to registrar
# Follow registrar's DNSSEC setup guide
```

**SPF/DKIM/DMARC for Email:**

```text
# SPF record
TXT: @ → "v=spf1 include:_spf.google.com ~all"

# DKIM record
TXT: google._domainkey → "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."

# DMARC record
TXT: _dmarc → "v=DMARC1; p=quarantine; rua=mailto:dmarc@scubabali.com"
```

## Performance Optimization

### HTTP Headers

**Security Headers:**

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline';" always;
```

**Performance Headers:**

```nginx
# Compression
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;

# Cache control
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Monitoring & Analytics

**Domain Monitoring:**

- Uptime monitoring (UptimeRobot, Pingdom)
- SSL certificate expiry alerts
- DNS propagation monitoring

**Performance Monitoring:**

- WebPageTest for loading performance
- Google PageSpeed Insights
- Lighthouse CI for automated testing

## Troubleshooting

### Common DNS Issues

**Domain not resolving:**

```bash
# Check DNS records
dig scubabali.com

# Check nameservers
dig NS scubabali.com

# Clear local DNS cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns            # Windows
sudo systemd-resolve --flush-caches  # Linux
```

**SSL certificate errors:**

```bash
# Check certificate validity
openssl s_client -connect scubabali.com:443 -servername scubabali.com | openssl x509 -noout -dates

# Check certificate chain
openssl s_client -connect scubabali.com:443 -servername scubabali.com -showcerts
```

**Mixed content warnings:**

- Ensure all resources load over HTTPS
- Update internal links to use HTTPS
- Check for hardcoded HTTP URLs

### CDN Issues

**Caching problems:**

```bash
# Purge Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

**CDN not serving content:**

- Check origin server connectivity
- Verify DNS configuration
- Check CDN status page for outages

## Migration Guide

### Moving from One Provider to Another

1. **Prepare new domain configuration**
2. **Set up SSL certificates**
3. **Configure DNS records**
4. **Test new setup**
5. **Update DNS with low TTL**
6. **Monitor propagation**
7. **Clean up old configuration**

### Zero-Downtime Migration

**Blue-Green Deployment:**

1. Set up new environment (green)
2. Test thoroughly
3. Switch DNS to new environment
4. Keep old environment as backup
5. Clean up after successful migration

**Gradual Migration:**

1. Use weighted DNS routing
2. Gradually increase traffic to new setup
3. Monitor performance and errors
4. Complete migration once confident

## Cost Optimization

### Domain Costs

**Registration:** $10-20/year
**Renewal:** Same as registration
**Privacy protection:** $2-8/year additional

### SSL Certificate Costs

**Free options:**

- Let's Encrypt (automated renewal)
- Cloudflare Universal SSL
- Platform-provided certificates

**Paid certificates:** $50-500/year depending on type

### CDN Costs

**Free tiers:**

- Cloudflare: Unlimited bandwidth
- Netlify/Vercel: Included with hosting

**Paid plans:** $20-200/month depending on usage

## Best Practices

### Domain Management

- Use DNS hosting separate from registrar when possible
- Enable DNSSEC for security
- Set appropriate TTL values
- Keep domain registration and hosting separate
- Use domain privacy protection

### Security

- Regularly monitor DNS records for unauthorized changes
- Use strong passwords for domain registrar accounts
- Enable two-factor authentication
- Keep contact information updated
- Set up domain expiration alerts

### Performance

- Use CDN for global distribution
- Enable HTTP/2 and HTTP/3
- Implement proper caching strategies
- Optimize images and assets
- Monitor Core Web Vitals

### Compliance

- GDPR compliance for EU users
- Cookie consent management
- Privacy policy for data collection
- Terms of service for user agreements
