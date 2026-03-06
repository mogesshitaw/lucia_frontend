// app/page/services/labels/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Bookmark, Package, Tag, Wine } from 'lucide-react';

const service = {
  id: 'labels',
  title: 'Product Labels',
  shortDescription: 'Custom product labels for packaging and branding.',
  fullDescription: 'Professional product labels for your packaging needs. Various materials and adhesives available for different applications, from food products to industrial items. Our labels are durable, waterproof, and designed to enhance your product presentation.',
  icon: <Bookmark size={32} />,
  gradient: 'from-green-500 to-teal-500',
  badge: 'Business',
  features: [
    'Barcode ready',
    'Water resistant options',
    'Custom sizes and shapes',
    'Multiple materials',
    'Bulk rolls available',
    'FDA compliant materials',
    'Permanent or removable',
    'Thermal transfer compatible',
  ],
  applications: [
    'Food & Beverage',
    'Cosmetics',
    'Candle Jars',
    'Bottles',
    'Product Packaging',
    'Shipping Labels',
    'Warning Labels',
    'Brand Stickers',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create label artwork' },
    { step: 2, title: 'Size/Shape', description: 'Choose dimensions' },
    { step: 3, title: 'Material', description: 'Select label material' },
    { step: 4, title: 'Proof', description: 'Approve design' },
    { step: 5, title: 'Print', description: 'Flexo or digital print' },
    { step: 6, title: 'Cut', description: 'Die-cut to shape' },
  ],
  specs: [
    { label: 'Materials', value: 'Paper, Vinyl, Clear, Kraft' },
    { label: 'Adhesive', value: 'Permanent, Removable' },
    { label: 'Finishes', value: 'Matte, Gloss, White' },
    { label: 'Application', value: 'Hand or machine apply' },
  ],
  priceRange: 'ETB 200 - 1500 per roll',
  minOrder: '100 pieces',
  turnaround: '3-4 days',
  materials: [
    'White Paper',
    'Kraft Paper',
    'White Vinyl',
    'Clear Vinyl',
    'Silver Vinyl',
    'Weatherproof Vinyl',
  ],
  formats: ['AI', 'PDF', 'EPS', 'CDR', 'PNG'],
  colors: [
    'CMYK Full Color',
    'Spot Colors',
    'Black & White',
    'White Ink on Clear',
  ],
  gallery: [
    { src: '/images/services/labels-1.jpg', alt: 'Label Sample 1' },
    { src: '/images/services/labels-2.jpg', alt: 'Label Sample 2' },
  ],
  faqs: [
    {
      question: 'Can you print barcodes on labels?',
      answer: 'Yes! We can include barcodes, QR codes, and variable data on your labels. Perfect for retail products.',
    },
    {
      question: 'Are your labels food-safe?',
      answer: 'Yes, we offer FDA-compliant materials suitable for food packaging and direct food contact where required.',
    },
  ],
  relatedServices: [
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
    { title: 'Packaging', href: '/page/services/packaging', icon: <Package size={20} /> },
    { title: 'Bottle Printing', href: '/page/services/bottles', icon: <Wine size={20} /> },
  ],
};

export default function LabelsPage() {
  return <ServiceTemplate service={service} />;
}