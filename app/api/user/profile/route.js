import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../lib/auth';
import { updateUser } from '../../../../lib/db';

export async function POST(req){
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const name = form.get('name');
  const phone = form.get('phone') || '';
  updateUser(me.id, { name, phone });
  return NextResponse.redirect(new URL('/profile', req.url));
}
