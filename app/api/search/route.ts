export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/search?q=запрос — поиск по продуктам и услугам
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], services: [], blogPosts: [] });
    }

    const [products, services, blogPosts] = await Promise.all([
      prisma.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, slug: true, category: true, imageUrl: true, minPrice: true },
        take: 5,
      }),
      prisma.service.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { shortDesc: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, slug: true, shortDesc: true, imageUrl: true },
        take: 5,
      }),
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true },
        take: 3,
      }),
    ]);

    return NextResponse.json({ products, services, blogPosts });
  } catch (error: any) {
    console.error('GET /api/search error:', error);
    return NextResponse.json({ error: 'Ошибка поиска' }, { status: 500 });
  }
}
