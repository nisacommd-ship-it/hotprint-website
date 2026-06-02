export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/portfolio — список работ
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const technology = searchParams.get('technology');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const where: any = {};
    if (category) where.category = category;
    if (technology) where.technology = technology;
    if (featured === 'true') where.featured = true;

    const [items, total] = await Promise.all([
      prisma.portfolioItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.portfolioItem.count({ where }),
    ]);

    const categories = await prisma.portfolioItem.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      items, total, page,
      totalPages: Math.ceil(total / limit),
      categories: categories.map((c: any) => c.category),
    });
  } catch (error: any) {
    console.error('GET /api/portfolio error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки портфолио' }, { status: 500 });
  }
}
