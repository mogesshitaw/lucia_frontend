'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActiveOrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/orders?status=processing');
  }, [router]);

  return null;
}