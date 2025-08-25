import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '../../../../lib/db';
import { signToken, setAuthCookie } from '../../../../lib/auth';

export async function POST(req){
  const { email, password } = await req.json();
  const user = findUserByEmail(email);
  if(!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  if(user.suspended) return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if(!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const token = signToken(user);
  setAuthCookie(token);
  return NextResponse.json({ ok: true });
}
