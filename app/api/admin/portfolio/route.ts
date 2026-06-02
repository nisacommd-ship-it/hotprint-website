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
    const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ items });
  } catch (e: any) {
    console.error('Admin portfolio GET:', e);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await request.json();
    if (!data.title || !data.slug) return NextResponse.json({ error: 'Title and slug required' }, { status: 400 });
    const item = await prisma.portfolioItem.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category || '',
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        client: data.client || null,
        technology: data.technology || null,
        featured: !!data.featured,
      },
    });
    return NextResponse.json({ item });
  } catch (e: any) {
    console.error('Admin portfolio POST:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { id, ...rest } = data;
    if (rest.featured !== undefined) rest.featured = !!rest.featured;
    const item = await prisma.portfolioItem.update({ where: { id }, data: rest });
    return NextResponse.json({ item });
  } catch (e: any) {
    console.error('Admin portfolio PATCH:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await prisma.portfolioItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin portfolio DELETE:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
