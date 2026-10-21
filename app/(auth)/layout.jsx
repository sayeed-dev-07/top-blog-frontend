import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-dvh bg-white">
      <Link
        href="/"
        className="absolute z-10 bottom-8 right-8 md:bottom-auto md:right-auto md:top-8 md:left-8 text-sm font-bold uppercase border border-black bg-white px-4 py-2  transition-colors hover:bg-black hover:text-white"
      >
        Home
      </Link>
      {children}
    </div>
  );
}