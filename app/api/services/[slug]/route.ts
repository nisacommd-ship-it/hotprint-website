export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/services/[slug] — услуга по slug
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug, active: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Услуга не найдена' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error: any) {
    console.error('GET /api/services/[slug] error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки услуги' }, { status: 500 });
  }
}
