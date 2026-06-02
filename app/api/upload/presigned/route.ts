export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUploadUrl } from '@/lib/s3';

// POST /api/upload/presigned — получить presigned URL для загрузки файла
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, contentType, isPublic } = body ?? {};

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Укажите имя файла и тип' }, { status: 400 });
    }

    // Ограничение типов файлов
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
      'application/pdf',
      'application/zip', 'application/x-rar-compressed',
      'application/postscript', 'application/illustrator',
      'image/vnd.adobe.photoshop',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const isAllowed = allowedTypes.some(t => contentType.startsWith(t.split('/')[0]) || contentType === t);
    if (!isAllowed && !contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Недопустимый тип файла' }, { status: 400 });
    }

    const result = await generatePresignedUploadUrl(fileName, contentType, isPublic || false);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('POST /api/upload/presigned error:', error);
    return NextResponse.json({ error: 'Ошибка создания ссылки для загрузки' }, { status: 500 });
  }
}
