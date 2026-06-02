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

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const [totalUsers, totalOrders, pendingOrders, totalReviews, pendingReviews, totalContacts, newContacts] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.review.count(),
      prisma.review.count({ where: { approved: false } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: 'new' } }),
    ]);

    return NextResponse.json({
      totalUsers, totalOrders, pendingOrders,
      totalReviews, pendingReviews,
      totalContacts, newContacts,
    });
  } catch (error: any) {
    console.error('Admin stats GET error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
