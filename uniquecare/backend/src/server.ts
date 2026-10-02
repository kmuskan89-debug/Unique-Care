import app from './app';

const PORT = process.env.PORT || 5000;

// Only start the server if not running in Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
  });
}
