import Link from 'next/link';

export default function PostCard({ post, author }){
  return (
    <article className="card">
      <h3 className="text-xl font-semibold">
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <p className="text-sm text-gray-600 mt-1">by {author?.name || 'Unknown'}</p>
      <p className="mt-2 line-clamp-3">{post.content}</p>
      <div className="mt-3 text-sm text-gray-500 flex gap-4">
        <span>👍 {post.likes.length}</span>
        <span>👎 {post.dislikes.length}</span>
      </div>
    </article>
  );
}
