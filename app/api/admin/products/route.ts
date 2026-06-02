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
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ products });
  } catch (e: any) {
    console.error('Admin products GET:', e);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await request.json();
    if (!data.name || !data.slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameRo: data.nameRo || null,
        nameEn: data.nameEn || null,
        slug: data.slug,
        description: data.description || '',
        descriptionRo: data.descriptionRo || null,
        descriptionEn: data.descriptionEn || null,
        category: data.category || '',
        categoryRo: data.categoryRo || null,
        categoryEn: data.categoryEn || null,
        imageUrl: data.imageUrl || null,
        minPrice: data.minPrice ? parseFloat(data.minPrice) : null,
        maxPrice: data.maxPrice ? parseFloat(data.maxPrice) : null,
        printTech: data.printTech || null,
        featured: !!data.featured,
        active: data.active !== false,
      },
    });
    return NextResponse.json({ product });
  } catch (e: any) {
    console.error('Admin products POST:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { id, ...rest } = data;
    if (rest.minPrice !== undefined) rest.minPrice = rest.minPrice ? parseFloat(rest.minPrice) : null;
    if (rest.maxPrice !== undefined) rest.maxPrice = rest.maxPrice ? parseFloat(rest.maxPrice) : null;
    if (rest.featured !== undefined) rest.featured = !!rest.featured;
    if (rest.active !== undefined) rest.active = !!rest.active;
    const product = await prisma.product.update({ where: { id }, data: rest });
    return NextResponse.json({ product });
  } catch (e: any) {
    console.error('Admin products PATCH:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin products DELETE:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
