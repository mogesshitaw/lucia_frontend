'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelledOrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/orders?status=cancelled');
  }, [router]);

  return null;
}