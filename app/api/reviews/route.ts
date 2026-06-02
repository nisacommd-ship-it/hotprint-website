export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/reviews — публичный список отзывов
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, author: true, company: true, rating: true, text: true, createdAt: true },
      }),
      prisma.review.count({ where: { approved: true } }),
    ]);

    return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки отзывов' }, { status: 500 });
  }
}

// POST /api/reviews — создание отзыва (авторизованный пользователь)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, text, company } = body ?? {};

    if (!text || text.length < 10) {
      return NextResponse.json({ error: 'Отзыв должен содержать минимум 10 символов' }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Оценка от 1 до 5' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        author: user?.name || 'Клиент',
        company: company || user?.company || null,
        rating,
        text,
        approved: false, // Требуется модерация
      },
    });

    return NextResponse.json({ review, message: 'Отзыв отправлен на модерацию' }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Ошибка создания отзыва' }, { status: 500 });
  }
}
