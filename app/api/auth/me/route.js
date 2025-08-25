import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../lib/auth';

export async function GET(){
  const me = getUserFromCookie();
  if(!me) return NextResponse.json({ error: 'not-authenticated' }, { status: 200 });
  return NextResponse.json(me);
}
