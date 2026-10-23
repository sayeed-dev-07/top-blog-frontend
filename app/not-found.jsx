import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata = {
    title: 'Page not found',
    description: 'This page could not be found. Head back to the blog to keep reading.',
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <section className="w-full max-w-xl rounded-[1.5rem] border-2 border-[#29221f] bg-[#fffaf0] p-8 text-center shadow-[6px_7px_0_#29221f] sm:p-12">
                    <span aria-hidden="true" className="mb-4 inline-block text-5xl text-rose-400">✿</span>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-rose-600">404 · Page not found</p>
                    <h1 className="mb-4 font-title text-3xl text-[#29221f] sm:text-4xl">This page wandered off.</h1>
                    <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-[#62564e] sm:text-base">
                        We couldn’t find the page you were looking for. The link may be old, or the page may have moved. There are still plenty of stories waiting on the blog.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full border-2 border-[#29221f] bg-[#29221f] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_4px_0_#29221f] transition hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#29221f]"
                    >
                        Back to the blog
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}
