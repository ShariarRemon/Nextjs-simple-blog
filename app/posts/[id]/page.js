'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function PostPage(){
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [me, setMe] = useState(null);
  const [commentText, setCommentText] = useState('');

  const load = async () => {
    const p = await fetch(`/api/posts/${id}`).then(r=>r.json());
    setPost(p);
    if (p?.author){ setAuthor(p.author); }
    const c = await fetch(`/api/comments?postId=${id}`).then(r=>r.json());
    setComments(c);
    const m = await fetch('/api/auth/me').then(r=>r.json());
    setMe(m?.id ? m : null);
  };

  useEffect(()=>{ load(); }, [id]);

  if(!post) return <p>Loading...</p>;
  if(post.error) return <p className="text-red-600">{post.error}</p>;

  const react = async (type) => {
    await fetch(`/api/posts/${id}/react`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type }) });
    load();
  };
  const addComment = async (e) => {
    e.preventDefault();
    if(!commentText.trim()) return;
    await fetch('/api/comments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ postId: id, text: commentText }) });
    setCommentText(''); load();
  };
  const del = async () => {
    if(confirm('Delete this post?')){
      const res = await fetch(`/api/posts/${id}`, { method:'DELETE' });
      if(res.ok) router.push('/');
    }
  };

  const isOwner = me && me.id === post.authorId;
  const isAdmin = me && me.role === 'admin';

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="text-gray-600">by {author?.name || 'Unknown'}</p>
      {post.image && <img src={post.image} alt="" className="rounded border max-h-96 object-cover" />}
      <p className="whitespace-pre-wrap">{post.content}</p>

      <div className="flex gap-2">
        <button className="btn btn-secondary" onClick={()=>react('like')}>👍 Like ({post.likes.length})</button>
        <button className="btn btn-secondary" onClick={()=>react('dislike')}>👎 Dislike ({post.dislikes.length})</button>
        {(isOwner || isAdmin) && <Link href={`/edit/${post.id}`} className="btn btn-secondary">Edit</Link>}
        {(isOwner || isAdmin) && <button className="btn btn-primary" onClick={del}>Delete</button>}
      </div>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {me ? (
          <form onSubmit={addComment} className="flex gap-2">
            <input className="input" placeholder="Write a comment..." value={commentText} onChange={e=>setCommentText(e.target.value)} />
            <button className="btn btn-primary">Send</button>
          </form>
        ) : <p><Link href="/login">Login</Link> to comment.</p>}
        <ul className="mt-4 space-y-3">
          {comments.map(c => (
            <li key={c.id} className="border-b pb-2">
              <p className="text-sm text-gray-600">{c.author?.name || 'User'} • {new Date(c.createdAt).toLocaleString()}</p>
              <p>{c.text}</p>
              { (isAdmin || me?.id === c.authorId) && (
                <form action={`/api/comments/${c.id}`} method="post">
                  <input type="hidden" name="_method" value="DELETE"/>
                </form>
              )}
            </li>
          ))}
          {comments.length === 0 && <p>No comments yet.</p>}
        </ul>
      </section>
    </div>
  );
}
