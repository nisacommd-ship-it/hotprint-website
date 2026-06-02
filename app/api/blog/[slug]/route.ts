export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/blog/[slug] — пост по slug
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('GET /api/blog/[slug] error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки статьи' }, { status: 500 });
  }
}
