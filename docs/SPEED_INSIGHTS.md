# Vercel Speed Insights Configuration

## Overview

This project has been configured with Vercel Speed Insights to track web performance metrics on the landing page.

## What is Speed Insights?

Vercel Speed Insights tracks Core Web Vitals and other performance metrics for your web application, including:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

## Installation

The `@vercel/speed-insights` package has been installed as a dependency:

```bash
npm install @vercel/speed-insights
```

## Configuration

### 1. Landing Page (`public/index.html`)

The Speed Insights script has been added to the landing page using the vanilla JavaScript implementation:

```html
<!-- Vercel Speed Insights -->
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

### 2. Express Configuration (`src/index.js`)

The Express server has been configured to serve static files from the `public` directory:

```javascript
const path = require('path');

// Static Files - Serve public directory for landing page with Speed Insights
app.use(express.static(path.join(__dirname, '../public')));
```

### 3. Vercel Deployment (`vercel.json`)

A Vercel configuration file has been created to ensure proper deployment.

## Enabling Speed Insights on Vercel

To enable Speed Insights for your deployed application:

1. **Deploy to Vercel**: Push your code to GitHub and connect it to Vercel, or use `vercel deploy`
2. **Enable Speed Insights in Dashboard**:
   - Go to your Vercel dashboard
   - Select your project
   - Navigate to "Speed Insights" in the sidebar
   - Click "Enable Speed Insights"
3. **Verify Installation**: After deployment, the Speed Insights script will be automatically injected at `/_vercel/speed-insights/script.js`

## Testing Locally

To test the landing page locally:

```bash
npm start
```

Then visit `http://localhost:3000` in your browser to see the landing page with Speed Insights enabled.

## Monitoring Performance

After deployment and enabling Speed Insights:

1. Visit your deployed site to generate performance data
2. Go to your Vercel dashboard
3. Navigate to Speed Insights for your project
4. View real-time performance metrics and Core Web Vitals

## Important Notes

- **Backend API**: This is primarily a backend API, so Speed Insights tracks performance for the landing page only
- **Data Collection**: Speed Insights data is collected only after deployment to Vercel and enabling the feature in the dashboard
- **Privacy**: Speed Insights is privacy-friendly and doesn't collect personal information

## Files Modified

- `package.json` - Added @vercel/speed-insights dependency
- `src/index.js` - Added static file serving for the public directory
- `public/index.html` - Created landing page with Speed Insights script
- `vercel.json` - Created Vercel deployment configuration

## Additional Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Core Web Vitals](https://web.dev/vitals/)
- [Vercel Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart)
