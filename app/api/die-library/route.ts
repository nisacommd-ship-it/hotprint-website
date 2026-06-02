export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/die-library — список штанцформ
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const where: any = { available: true };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { dimensions: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [forms, total] = await Promise.all([
      prisma.dieCutForm.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dieCutForm.count({ where }),
    ]);

    const categories = await prisma.dieCutForm.findMany({
      where: { available: true },
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      forms, total, page,
      totalPages: Math.ceil(total / limit),
      categories: categories.map((c: any) => c.category),
    });
  } catch (error: any) {
    console.error('GET /api/die-library error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки штанцформ' }, { status: 500 });
  }
}
