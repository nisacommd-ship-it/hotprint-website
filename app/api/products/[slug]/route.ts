export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/products/[slug] — детали продукта
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, active: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Продукт не найден' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('GET /api/products/[slug] error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки продукта' }, { status: 500 });
  }
}
