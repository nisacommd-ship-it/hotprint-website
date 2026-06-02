export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== 'ADMIN') return null;
  return session;
}

// GET — список всех пользователей
export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, role: true, phone: true,
        company: true, cashback: true, createdAt: true,
        _count: { select: { orders: true, reviews: true } },
      },
    });
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

// PATCH — изменить роль пользователя
export async function PATCH(request: Request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const { id, role } = await request.json();
    if (!id || !role) return NextResponse.json({ error: 'Укажите ID и роль' }, { status: 400 });
    if (!['CLIENT', 'AGENCY', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Недопустимая роль' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Admin users PATCH error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
