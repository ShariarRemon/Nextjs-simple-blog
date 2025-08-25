import Link from 'next/link';
import { getUserFromCookie } from '../../lib/auth';
import { db, deletePost } from '../../lib/db';

export default function Dashboard(){
  const me = getUserFromCookie();
  if(!me) return <p>Please <a href="/login" className="underline">login</a> to view your dashboard.</p>;
  const myPosts = db.posts.filter(p => p.authorId === me.id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Dashboard</h1>
      <p className="text-gray-600">Welcome, {me.name}. You have {myPosts.length} post(s).</p>
      <div className="space-y-2">
        {myPosts.map(p => (
          <div key={p.id} className="card flex justify-between items-center">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-gray-500">👍 {p.likes.length} • 👎 {p.dislikes.length}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/posts/${p.id}`} className="btn btn-secondary">View</Link>
              <Link href={`/edit/${p.id}`} className="btn btn-secondary">Edit</Link>
              <form action={`/api/posts/${p.id}`} method="post">
                <input type="hidden" name="_method" value="DELETE"/>
                <button className="btn btn-primary">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {myPosts.length === 0 && <p>No posts yet. <a href="/new" className="underline">Create your first post</a>.</p>}
      </div>
    </div>
  );
}
