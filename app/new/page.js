'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPost(){
  const [form, setForm] = useState({ title:'', content:'', image:'' });
  const [me, setMe] = useState(null);
  const [err, setErr] = useState('');
  const router = useRouter();
  useEffect(()=>{ fetch('/api/auth/me').then(r=>r.json()).then(d=>setMe(d.id?d:null)); },[]);
  if (!me) return <p>Please <a href="/login" className="underline">login</a> to create a post.</p>;

  const submit = async (e)=>{
    e.preventDefault();
    const res = await fetch('/api/posts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    const d = await res.json();
    if(res.ok){ router.push(`/posts/${d.id}`); } else { setErr(d.error||'Failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">New Post</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <textarea className="input" placeholder="Write your post..." value={form.content} onChange={e=>setForm({...form, content:e.target.value})}></textarea>
        <input className="input" placeholder="Image URL (optional)" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary">Publish</button>
      </form>
    </div>
  );
}
