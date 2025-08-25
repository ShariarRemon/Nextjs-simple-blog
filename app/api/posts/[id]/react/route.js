import { NextResponse } from 'next/server';
import { toggleReaction, getPost } from '../../../../../lib/db';
import { getUserFromCookie } from '../../../../../lib/auth';

export async function POST(req, { params }){
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { type } = await req.json();
  if(!['like','dislike'].includes(type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  const p = getPost(params.id);
  if(!p || p.suspended) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated = toggleReaction({ postId: params.id, userId: me.id, type });
  return NextResponse.json(updated);
}
