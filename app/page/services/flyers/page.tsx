// app/page/services/flyers/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Camera, FileText, Tag } from 'lucide-react';

const service = {
  id: 'flyers',
  title: 'Flyers & Brochures',
  shortDescription: 'Marketing materials for your business promotions.',
  fullDescription: 'Professional flyers and brochures for your marketing campaigns. Various sizes, folds, and paper options available. Perfect for product launches, events, and business promotions.',
  icon: <FileText size={32} />,
  gradient: 'from-blue-500 to-cyan-500',
  badge: 'Marketing',
  features: [
    'Multiple sizes available',
    'Folding options',
    'Glossy or matte finish',
    'Bulk pricing',
    'Design service included',
    'Fast turnaround',
    'High-quality printing',
    'Eco-friendly paper options',
  ],
  applications: [
    'Product Catalogs',
    'Event Programs',
    'Restaurant Menus',
    'Real Estate Flyers',
    'Sale Promotions',
    'Information Guides',
    'Travel Brochures',
    'Educational Materials',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create or submit design' },
    { step: 2, title: 'Size/Fold', description: 'Select format' },
    { step: 3, title: 'Paper', description: 'Choose paper type' },
    { step: 4, title: 'Proof', description: 'Approve digital proof' },
    { step: 5, title: 'Print', description: 'Offset or digital printing' },
    { step: 6, title: 'Fold', description: 'Machine folding' },
  ],
  specs: [
    { label: 'Sizes', value: 'A5, A4, A3, DL, Custom' },
    { label: 'Folds', value: 'Half, Tri, Z, Gate, None' },
    { label: 'Paper', value: '100-300gsm' },
    { label: 'Pages', value: '1-32 pages' },
  ],
  priceRange: 'ETB 300 - 2000 per 100',
  minOrder: '50 pieces',
  turnaround: '2-3 days',
  materials: [
    'Gloss Paper',
    'Matte Paper',
    'Recycled Paper',
    'Kraft Paper',
    'Textured Paper',
    'Cardstock',
  ],
  formats: ['AI', 'PDF', 'INDD', 'PSD', 'JPG'],
  colors: [
    'CMYK Full Color',
    'Spot Colors',
    'Black & White',
  ],
  gallery: [
    { src: '/images/services/flyers-1.jpg', alt: 'Flyer Sample 1' },
    { src: '/images/services/flyers-2.jpg', alt: 'Flyer Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the most popular flyer size?',
      answer: 'A5 (148 x 210mm) and A4 (210 x 297mm) are most popular for flyers. DL (99 x 210mm) is common for brochures.',
    },
    {
      question: 'Can you help with the design?',
      answer: 'Yes! Our graphic designers can create professional flyers from your ideas or polish your existing design.',
    },
  ],
  relatedServices: [
    { title: 'Business Cards', href: '/page/services/business-cards', icon: <FileText size={20} /> },
    { title: 'Posters', href: '/page/services/posters', icon: <Camera size={20} /> },
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
  ],
};

export default function FlyersPage() {
  return <ServiceTemplate service={service} />;
}