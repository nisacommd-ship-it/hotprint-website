import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { PageLayout } from '@/components/layout/page-layout';
import { AdminClient } from './admin-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Админ-панель | Hot Print',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== 'ADMIN') redirect('/dashboard');

  return (
    <PageLayout>
      <AdminClient />
    </PageLayout>
  );
}
