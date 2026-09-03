import './globals.css';

export const metadata = {
  title: 'Evolution Academy Online',
  description: 'Credit Direct - Learning & Development',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
