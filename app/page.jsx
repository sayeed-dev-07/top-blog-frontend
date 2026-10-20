import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div>
        <p>Hello from home page </p>
        <div>
          <div>
            <Link href={'/register'}>Register</Link>
          </div>
          <div>
            <Link href={'/login'}>login</Link>
          </div>
          <div>
            <Link href={'/posts'}>posts</Link>
          </div>
        </div>
    </div>
  );
};

export default page;