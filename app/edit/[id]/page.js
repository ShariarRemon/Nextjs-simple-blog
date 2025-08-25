'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditPost(){
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title:'', content:'', image:'' });
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => {
    fetch(`/api/posts/${params.id}`).then(r=>r.json()).then(d=>{
      if(d?.id){ setForm({ title: d.title, content: d.content, image: d.image||'' }); setLoaded(true); }
    });
  }, [params.id]);
  const submit = async (e)=>{
    e.preventDefault();
    const res = await fetch(`/api/posts/${params.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if(res.ok){ router.push(`/posts/${params.id}`); } else { const d = await res.json(); setErr(d.error||'Failed'); }
  };
  if(!loaded) return <p>Loading...</p>;
  return (
    <div className="max-w-2xl mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <textarea className="input" placeholder="Write your post..." value={form.content} onChange={e=>setForm({...form, content:e.target.value})}></textarea>
        <input className="input" placeholder="Image URL (optional)" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
