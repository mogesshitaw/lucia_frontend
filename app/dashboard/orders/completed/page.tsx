'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompletedOrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/orders?status=completed');
  }, [router]);

  return null;
}