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
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ posts });
  } catch (e: any) {
    console.error('Admin blog GET:', e);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await request.json();
    if (!data.title || !data.slug) return NextResponse.json({ error: 'Title and slug required' }, { status: 400 });
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content || '',
        imageUrl: data.imageUrl || null,
        author: data.author || 'Hot Print',
        tags: data.tags || [],
        published: data.published !== false,
        seoTitle: data.seoTitle || null,
        seoDesc: data.seoDesc || null,
      },
    });
    return NextResponse.json({ post });
  } catch (e: any) {
    console.error('Admin blog POST:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { id, ...rest } = data;
    if (rest.published !== undefined) rest.published = !!rest.published;
    const post = await prisma.blogPost.update({ where: { id }, data: rest });
    return NextResponse.json({ post });
  } catch (e: any) {
    console.error('Admin blog PATCH:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin blog DELETE:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
