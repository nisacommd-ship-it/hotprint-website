export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/products — список продуктов с фильтрацией
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const printTech = searchParams.get('printTech');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const where: any = { active: true };
    if (category) where.category = category;
    if (printTech) where.printTech = printTech;
    if (featured === 'true') where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Получить уникальные категории для фильтров
    const categories = await prisma.product.findMany({
      where: { active: true },
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      categories: categories.map((c: any) => c.category),
    });
  } catch (error: any) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки продуктов' }, { status: 500 });
  }
}
