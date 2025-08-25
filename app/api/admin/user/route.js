import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../lib/auth';
import { updateUser } from '../../../../lib/db';

export async function POST(req){
  const me = getUserFromCookie();
  if(!me || me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const form = await req.formData();
  const id = form.get('id');
  const action = form.get('action');
  if(action === 'suspend') updateUser(id, { suspended: true });
  if(action === 'activate') updateUser(id, { suspended: false });
  return NextResponse.redirect(new URL('/admin', req.url));
}
