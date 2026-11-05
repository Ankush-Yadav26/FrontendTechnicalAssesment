import ThemeRegistry from '@/theme/ThemeRegistry';

export const metadata = {
  title: 'Help Study Abroad - Admin Portal',
  description: 'Senior Frontend Technical Assessment built with Next.js, Material UI, and Zustand.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}

