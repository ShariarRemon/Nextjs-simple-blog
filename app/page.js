import dynamic from 'next/dynamic';
import { db, searchPosts } from '../lib/db';
const PostCard = dynamic(() => import('../components/PostCard'), { ssr: false });

export default function Home({ searchParams }){
  const q = (searchParams?.q || '');
  const posts = searchPosts(q);
  return (
    <div className="space-y-6">
      <form className="flex gap-2">
        <input name="q" placeholder="Search posts..." className="input" defaultValue={q} />
        <button className="btn btn-secondary" type="submit">Search</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map(p => (
          <PostCard key={p.id} post={p} author={db.users.find(u=>u.id===p.authorId)} />
        ))}
        {posts.length === 0 && <p>No posts found.</p>}
      </div>
    </div>
  );
}
