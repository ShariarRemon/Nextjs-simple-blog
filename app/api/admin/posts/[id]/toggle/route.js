import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../../../lib/auth';
import { updatePost, getPost } from '../../../../../../lib/db';

export async function POST(req, { params }){
  const me = getUserFromCookie();
  if(!me || me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const p = getPost(params.id);
  if(!p) return NextResponse.redirect(new URL('/admin', req.url));
  updatePost(params.id, { suspended: !p.suspended });
  return NextResponse.redirect(new URL('/admin', req.url));
}
