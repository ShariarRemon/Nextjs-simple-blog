import { NextResponse } from 'next/server';
import { createPost, searchPosts } from '../../../lib/db';
import { getUserFromCookie } from '../../../lib/auth';

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  return NextResponse.json(searchPosts(q));
}

export async function POST(req){
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, content, image } = await req.json();
  if(!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
  const post = createPost({ authorId: me.id, title, content, image });
  return NextResponse.json(post);
}
