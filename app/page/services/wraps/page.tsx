// app/page/services/wraps/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Car, Megaphone, Scissors, Tag } from 'lucide-react';

const service = {
  id: 'vehicle-wraps',
  title: 'Vehicle Wraps',
  shortDescription: 'Full and partial vehicle wraps for mobile advertising.',
  fullDescription: 'Turn your fleet into moving billboards with our professional vehicle wrap service. Full wraps, partial wraps, and decals available with professional installation. Our wraps are made from high-quality cast vinyl that conforms to every curve of your vehicle.',
  icon: <Car size={32} />,
  gradient: 'from-blue-500 to-indigo-500',
  badge: 'Professional',
  features: [
    'Full and partial wraps',
    'Commercial and personal vehicles',
    'Premium cast vinyl',
    'Design service included',
    'Professional installation',
    'Removable without damage',
    'UV protection',
    '5-7 year durability',
  ],
  applications: [
    'Company Fleet Vehicles',
    'Food Trucks',
    'Racing Cars',
    'Delivery Vans',
    'Ride-share Cars',
    'Buses',
    'Trailers',
    'Boats',
  ],
  process: [
    { step: 1, title: 'Consultation', description: 'Discuss design and goals' },
    { step: 2, title: 'Design', description: 'Create custom wrap design' },
    { step: 3, title: 'Proof', description: 'Approve design' },
    { step: 4, title: 'Print', description: 'Large format printing' },
    { step: 5, title: 'Laminate', description: 'Add protective layer' },
    { step: 6, title: 'Install', description: 'Professional application' },
  ],
  specs: [
    { label: 'Vinyl Type', value: 'Cast (premium) or Calendared' },
    { label: 'Laminate', value: 'Gloss, Matte, Satin' },
    { label: 'Durability', value: '5-7 years' },
    { label: 'Coverage', value: 'Full, Partial, Spot graphics' },
  ],
  priceRange: 'ETB 5000 - 30000',
  minOrder: '1 vehicle',
  turnaround: '3-5 days',
  materials: [
    'Cast Vinyl',
    'Calendared Vinyl',
    'Overlaminate',
    'Air-release Technology',
    'Reflective Vinyl',
  ],
  formats: ['AI', 'PDF', 'EPS', 'CDR', 'PSD'],
  colors: [
    'Full Color CMYK',
    'Spot Colors',
    'Metallic',
    'Matte Finish',
    'Gloss Finish',
    'Carbon Fiber Look',
  ],
  gallery: [
    { src: '/images/services/wraps-1.jpg', alt: 'Vehicle Wrap Sample 1' },
    { src: '/images/services/wraps-2.jpg', alt: 'Vehicle Wrap Sample 2' },
  ],
  faqs: [
    {
      question: 'How long do vehicle wraps last?',
      answer: 'Premium cast vinyl wraps last 5-7 years with proper care. They protect your original paint and can be removed without damage.',
    },
    {
      question: 'Can I wash my wrapped vehicle?',
      answer: 'Yes! Hand washing is recommended. Avoid automatic car washes with brushes. We provide complete care instructions.',
    },
  ],
  relatedServices: [
    { title: 'Banners', href: '/page/services/banners', icon: <Megaphone size={20} /> },
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
    { title: 'Cutout', href: '/page/services/cutout', icon: <Scissors size={20} /> },
  ],
};

export default function WrapsPage() {
  return <ServiceTemplate service={service} />;
}