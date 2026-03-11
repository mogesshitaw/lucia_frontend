import { notFound } from 'next/navigation';
import DynamicServicePage from './DynamicServicePage';

// Fetch service data on the server
async function getService(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/public/services/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch service: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

// Generate static params for all services (optional, for static generation)
export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/public/services`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.data.map((service: any) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // ✅ Await the params Promise

  const { slug } = await params;
  const service = await getService(slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }
  
  return {
    title: service.seo_title || `${service.title} | Lucia Printing`,
    description: service.seo_description || service.short_description,
    keywords: service.seo_keywords,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  // ✅ Await the params Promise
  const { slug } = await params;
  const service = await getService(slug);
  
  if (!service) {
    notFound();
  }
  
  return <DynamicServicePage service={service} />;
}