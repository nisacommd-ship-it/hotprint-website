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

// GET — все заявки
export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error('Admin contacts GET error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

// PATCH — обновить статус заявки
export async function PATCH(request: Request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const { id, status } = await request.json();
    if (!id) return NextResponse.json({ error: 'Укажите ID' }, { status: 400 });

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { status: status || 'processed' },
    });
    return NextResponse.json({ submission });
  } catch (error: any) {
    console.error('Admin contacts PATCH error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
