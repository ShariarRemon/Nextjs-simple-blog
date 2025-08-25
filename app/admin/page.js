import { getUserFromCookie } from '../../lib/auth';
import { db } from '../../lib/db';

export default function Admin(){
  const me = getUserFromCookie();
  if(!me || me.role !== 'admin') return <p>Admins only.</p>;
  const users = db.users;
  const posts = db.posts;
  const comments = db.comments;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td>{u.name}</td><td>{u.email}</td><td><span className="badge">{u.role}</span></td>
                <td>{u.suspended ? 'Suspended' : 'Active'}</td>
                <td className="space-x-2">
                  <form action="/api/admin/user" method="post" className="inline">
                    <input type="hidden" name="id" value={u.id}/>
                    <input type="hidden" name="action" value={u.suspended ? 'activate':'suspend'}/>
                    <button className="btn btn-secondary">{u.suspended ? 'Activate':'Suspend'}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">Title</th><th>Author</th><th>Likes</th><th>Dislikes</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-t">
                <td>{p.title}</td>
                <td>{db.users.find(u=>u.id===p.authorId)?.name}</td>
                <td>{p.likes.length}</td>
                <td>{p.dislikes.length}</td>
                <td>{p.suspended ? 'Suspended' : 'Active'}</td>
                <td className="space-x-2">
                  <form action={`/api/admin/posts/${p.id}/toggle`} method="post" className="inline">
                    <button className="btn btn-secondary">{p.suspended ? 'Activate':'Suspend'}</button>
                  </form>
                  <form action={`/api/posts/${p.id}`} method="post" className="inline">
                    <input type="hidden" name="_method" value="DELETE"/>
                    <button className="btn btn-primary">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <ul className="text-sm space-y-2">
          {comments.map(c => (
            <li key={c.id} className="border-b pb-2">
              <div className="flex justify-between">
                <span>On post: {db.posts.find(p=>p.id===c.postId)?.title || 'Unknown'}</span>
                <form action={`/api/comments/${c.id}`} method="post">
                  <input type="hidden" name="_method" value="DELETE"/>
                  <button className="btn btn-secondary">Delete</button>
                </form>
              </div>
              <p>{c.text}</p>
            </li>
          ))}
          {comments.length === 0 && <p>No comments.</p>}
        </ul>
      </section>
    </div>
  );
}
