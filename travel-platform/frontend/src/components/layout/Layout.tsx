import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
