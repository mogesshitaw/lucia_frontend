import { notFound } from 'next/navigation';
import DynamicServicePage from './DynamicServicePage';

async function getService(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/public/services/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  
  if (!service) {
    notFound();
  }
  
  return <DynamicServicePage service={service} />;
}