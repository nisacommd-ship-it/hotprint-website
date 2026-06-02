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

// GET — все отзывы (вкл. немодерированные)
export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } },
    });
    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Admin reviews GET error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

// PATCH — одобрить/отклонить отзыв
export async function PATCH(request: Request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const { id, approved } = await request.json();
    if (!id) return NextResponse.json({ error: 'Укажите ID' }, { status: 400 });

    const review = await prisma.review.update({
      where: { id },
      data: { approved: !!approved },
    });
    return NextResponse.json({ review });
  } catch (error: any) {
    console.error('Admin reviews PATCH error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

// DELETE — удалить отзыв
export async function DELETE(request: Request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Укажите ID' }, { status: 400 });

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin reviews DELETE error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
