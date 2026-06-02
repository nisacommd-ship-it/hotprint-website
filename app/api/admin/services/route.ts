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
    const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ services });
  } catch (e: any) {
    console.error('Admin services GET:', e);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await request.json();
    if (!data.name || !data.slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
    const service = await prisma.service.create({
      data: {
        name: data.name,
        nameRo: data.nameRo || null,
        nameEn: data.nameEn || null,
        slug: data.slug,
        shortDesc: data.shortDesc || '',
        shortDescRo: data.shortDescRo || null,
        shortDescEn: data.shortDescEn || null,
        fullDesc: data.fullDesc || '',
        fullDescRo: data.fullDescRo || null,
        fullDescEn: data.fullDescEn || null,
        imageUrl: data.imageUrl || null,
        icon: data.icon || null,
        features: data.features || [],
        featuresRo: data.featuresRo || [],
        featuresEn: data.featuresEn || [],
        minPrice: data.minPrice ? parseFloat(data.minPrice) : null,
        featured: !!data.featured,
        active: data.active !== false,
        seoTitle: data.seoTitle || null,
        seoDesc: data.seoDesc || null,
        seoH1: data.seoH1 || null,
        aeoAnswer: data.aeoAnswer || null,
        aeoAnswerRo: data.aeoAnswerRo || null,
        aeoAnswerEn: data.aeoAnswerEn || null,
        faqJson: data.faqJson || null,
        faqJsonRo: data.faqJsonRo || null,
        faqJsonEn: data.faqJsonEn || null,
      },
    });
    return NextResponse.json({ service });
  } catch (e: any) {
    console.error('Admin services POST:', e);
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
    if (rest.featured !== undefined) rest.featured = !!rest.featured;
    if (rest.active !== undefined) rest.active = !!rest.active;
    const service = await prisma.service.update({ where: { id }, data: rest });
    return NextResponse.json({ service });
  } catch (e: any) {
    console.error('Admin services PATCH:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin services DELETE:', e);
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
