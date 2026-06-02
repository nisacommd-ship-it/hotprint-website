export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET /api/user/profile — получить профиль
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, name: true, email: true, phone: true, company: true,
        role: true, cashback: true, image: true, createdAt: true,
        _count: { select: { orders: true, reviews: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки профиля' }, { status: 500 });
  }
}

// PATCH /api/user/profile — обновить профиль
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, company, currentPassword, newPassword } = body ?? {};

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;

    // Смена пароля
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Укажите текущий пароль' }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user?.password) {
        return NextResponse.json({ error: 'Смена пароля недоступна для Google-аккаунтов' }, { status: 400 });
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Неверный текущий пароль' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Пароль должен быть минимум 6 символов' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, company: true, role: true, cashback: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    console.error('PATCH /api/user/profile error:', error);
    return NextResponse.json({ error: 'Ошибка обновления профиля' }, { status: 500 });
  }
}
