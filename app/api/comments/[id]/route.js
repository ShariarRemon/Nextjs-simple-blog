import { NextResponse } from 'next/server';
import { deleteComment } from '../../../../lib/db';
import { getUserFromCookie } from '../../../../lib/auth';

export async function POST(req, { params }){
  const form = await req.formData();
  const method = form.get('_method');
  if(method !== 'DELETE') return NextResponse.json({ ok: true });
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Only admin can delete comments in this demo (simple rule)
  if(me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  deleteComment(params.id);
  return NextResponse.redirect(new URL('/admin', req.url));
}

export async function DELETE(_, { params }){
  const me = getUserFromCookie();
  if(!me || me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  deleteComment(params.id);
  return NextResponse.json({ ok: true });
}
