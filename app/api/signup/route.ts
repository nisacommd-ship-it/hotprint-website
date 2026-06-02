export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body ?? {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Укажите email и пароль' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name: name || email?.split?.('@')?.[0] || 'User', role: 'CLIENT' },
    });
    return NextResponse.json({ success: true, user: { id: user?.id, email: user?.email, name: user?.name } });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Ошибка регистрации' }, { status: 500 });
  }
}
