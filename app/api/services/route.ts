export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/services — список услуг
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const where: any = { active: true };
    if (featured === 'true') where.featured = true;

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true, name: true, slug: true, shortDesc: true,
        imageUrl: true, icon: true, features: true, minPrice: true, featured: true,
      },
    });

    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки услуг' }, { status: 500 });
  }
}
