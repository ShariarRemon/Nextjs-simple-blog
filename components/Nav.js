'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Nav(){
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(setUser).catch(()=>{});
  }, []);
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <nav className="container py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold text-lg">SimpleBlog</Link>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="btn btn-secondary">Home</Link>
          {user && <Link href="/new" className="btn btn-secondary">New Post</Link>}
          {user && <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>}
          {user?.role === 'admin' && <Link href="/admin" className="btn btn-secondary">Admin</Link>}
          {!user ? (
            <>
              <Link href="/login" className="btn btn-primary">Login</Link>
              <Link href="/register" className="btn btn-secondary">Register</Link>
            </>
          ) : (
            <form action="/api/auth/logout" method="post">
              <button className="btn btn-primary">Logout</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}
