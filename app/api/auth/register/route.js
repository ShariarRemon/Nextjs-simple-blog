import { NextResponse } from 'next/server';
import { createUser } from '../../../../lib/db';

export async function POST(req){
  try{
    const { name, email, password } = await req.json();
    if(!name || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    const user = createUser({ name, email, password });
    return NextResponse.json({ id: user.id, email: user.email });
  }catch(e){
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
