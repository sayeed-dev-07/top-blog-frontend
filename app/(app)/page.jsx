'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <div>
        <div>
          <Link href="/register">Register</Link>
        </div>
        <div>
          <Link href="/login">Login</Link>
        </div>
        <div>
          <Link href="/posts">Posts</Link>
        </div>
      </div>
    </div>
  );
}
