# Client Template

This template provides a starting point for onboarding new diving center clients to the React Scuba platform.

## Usage

1. Copy this template to a new directory with your client slug:
   `bash
   cp -r server/clients/_template server/clients/your-client-slug
   `

2. Edit config.json and replace all TODO placeholders with actual client data

3. Generate a new UUID for 	enant.id: https://www.uuidgenerator.net/

4. Create client-specific image directories:
   - images/team/ - Team member photos
   - images/branding/ - Logo, favicon, hero image
   - images/courses/ - Course images (optional)

5. Validate configuration:
   `bash
   npm run validate-config your-client-slug
   `

6. Deploy configuration and test tenant resolution

## Required Fields

All fields marked with 'TODO:' in config.json must be filled before deployment.

## Asset Guidelines

- Logo: PNG format, transparent background, minimum 200x200px
- Hero Image: JPG format, minimum 1920x1080px
- Team Photos: JPG format, 800x800px recommended
- Favicon: ICO format, 32x32px and 16x16px sizes

## Support

For assistance with client onboarding, contact the development team.
