import { NextResponse } from 'next/server';
import { getPost, updatePost, deletePost } from '../../../../lib/db';
import { getUserFromCookie } from '../../../../lib/auth';

export async function GET(_, { params }){
  const p = getPost(params.id);
  if(!p || p.suspended) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  return NextResponse.json({ ...p, author: null });
}

export async function PUT(req, { params }){
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const p = getPost(params.id);
  if(!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if(me.role !== 'admin' && p.authorId !== me.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const updated = updatePost(params.id, { title: body.title, content: body.content, image: body.image });
  return NextResponse.json(updated);
}

export async function POST(req, { params }){
  // HTML form override for DELETE via _method
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const method = form.get('_method');
  if(method === 'DELETE'){
    const p = getPost(params.id);
    if(!p) return NextResponse.redirect(new URL('/dashboard', req.url));
    if(me.role !== 'admin' && p.authorId !== me.id) return NextResponse.redirect(new URL('/dashboard', req.url));
    deletePost(params.id);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_, { params }){
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const p = getPost(params.id);
  if(!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if(me.role !== 'admin' && p.authorId !== me.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  deletePost(params.id);
  return NextResponse.json({ ok: true });
}
