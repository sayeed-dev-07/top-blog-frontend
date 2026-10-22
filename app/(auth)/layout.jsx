// components/layouts/AuthLayout.jsx
import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-dvh bg-[#fdfbf7] selection:bg-rose-200 overflow-hidden">
      {/* Decorative background doodles */}
      <span aria-hidden="true" className="absolute top-20 right-20 text-6xl text-rose-500/10 -rotate-12 pointer-events-none">✿</span>
      <span aria-hidden="true" className="absolute bottom-20 left-20 text-8xl text-teal-600/10 rotate-12 pointer-events-none">✳</span>

      <Link
        href="/"
        className=" absolute z-10 bottom-8 right-8 md:bottom-auto md:right-auto md:top-8 md:left-8 hidden md:inline-flex items-center gap-2 rounded-full border-2 border-[#29221f] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#29221f] shadow-[3px_4px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[4px_6px_0_#29221f] transition-all"
      >
        <span aria-hidden="true" className="text-rose-500 text-lg leading-none">←</span>
        Home
      </Link>

      {children}
    </div>
  );
}