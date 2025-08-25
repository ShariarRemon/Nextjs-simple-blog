import { getUserFromCookie } from '../../lib/auth';

export default function Profile(){
  const me = getUserFromCookie();
  if(!me) return <p>Please <a href="/login" className="underline">login</a> to manage your profile.</p>;
  return (
    <div className="max-w-md card mx-auto">
      <h1 className="text-2xl font-semibold mb-2">My Profile</h1>
      <form action="/api/user/profile" method="post" className="space-y-3">
        <div>
          <label className="label">Name</label>
          <input className="input" name="name" defaultValue={me.name} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" name="phone" placeholder="Optional" />
        </div>
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
