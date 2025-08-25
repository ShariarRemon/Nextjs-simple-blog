import './globals.css';
import Nav from '../components/Nav';

export const metadata = {
  title: 'Simple Blog Project',
  description: 'A demo blog built with Next.js App Router',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container py-6">{children}</main>
        <footer className="container py-10 text-center text-sm text-gray-500 border-t">
          © {new Date().getFullYear()} Simple Blog. Built with Next.js.
        </footer>
      </body>
    </html>
  );
}
