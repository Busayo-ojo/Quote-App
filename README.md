# Quote App

A React + Vite application built with Tailwind CSS for displaying and managing quotes.

## Development

```bash
npm install
npm run dev
```

## Deployment

This project is configured to deploy to GitHub Pages using GitHub Actions.

### Setup Instructions:

1. **Push your code to GitHub** (if you haven't already):

   ```bash
   git add .
   git commit -m "Add GitHub Actions deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**:

   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy your app when you push to the main branch

3. **Your app will be available at**: `https://[your-username].github.io/Quote-App/`

### How it works:

- The GitHub Action triggers on pushes to `main` or `master` branch
- It builds your React app using `npm run build`
- Deploys the built files to GitHub Pages
- Your app will be automatically updated on each push

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- Lucide React (for icons)
