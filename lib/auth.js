import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { findUserById } from './db';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signToken(user){
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
}

export function setAuthCookie(token){
  cookies().set('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60*60*24*7 });
}

export function clearAuthCookie(){
  cookies().set('token', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export function getUserFromCookie(){
  const token = cookies().get('token')?.value;
  if (!token) return null;
  try{
    const payload = jwt.verify(token, SECRET);
    const user = findUserById(payload.sub);
    if (!user || user.suspended) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }catch{ return null; }
}
