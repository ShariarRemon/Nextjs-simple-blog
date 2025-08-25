import { NextResponse } from 'next/server';
import { addComment, listComments, getPost } from '../../../lib/db';
import { getUserFromCookie } from '../../../lib/auth';
import { db } from '../../../lib/db';

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  const items = listComments(postId).map(c => ({ ...c, author: db.users.find(u=>u.id===c.authorId) }));
  return NextResponse.json(items);
}

export async function POST(req){
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { postId, text } = await req.json();
  const post = getPost(postId);
  if(!post || post.suspended) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  if(!text?.trim()) return NextResponse.json({ error: 'Empty comment' }, { status: 400 });
  const c = addComment({ postId, authorId: me.id, text: text.trim() });
  return NextResponse.json(c);
}
