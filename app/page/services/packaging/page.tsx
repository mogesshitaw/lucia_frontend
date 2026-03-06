// app/page/services/packaging/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Bookmark, FileText, Package, Tag } from 'lucide-react';

const service = {
  id: 'packaging',
  title: 'Custom Packaging',
  shortDescription: 'Custom boxes and packaging for your products.',
  fullDescription: 'Elevate your brand with custom packaging solutions. From product boxes to shipping mailers, we create packaging that protects and promotes. Our packaging is designed to enhance unboxing experience and build brand loyalty.',
  icon: <Package size={32} />,
  gradient: 'from-blue-500 to-indigo-500',
  badge: 'Premium',
  features: [
    'Custom sizes and shapes',
    'Full color printing',
    'Various materials',
    'Structural design',
    'Bulk pricing',
    'Eco-friendly options',
    'Window cutouts',
    'Foil stamping available',
  ],
  applications: [
    'Product Boxes',
    'Gift Boxes',
    'Shipping Boxes',
    'Retail Packaging',
    'Cosmetics Boxes',
    'Food Packaging',
    'Subscription Boxes',
    'Display Boxes',
  ],
  process: [
    { step: 1, title: 'Consultation', description: 'Discuss product needs' },
    { step: 2, title: 'Structural Design', description: 'Create box prototype' },
    { step: 3, title: 'Graphic Design', description: 'Design box artwork' },
    { step: 4, title: 'Sample', description: 'Produce physical sample' },
    { step: 5, title: 'Production', description: 'Mass production' },
    { step: 6, title: 'Assembly', description: 'Fold and ship flat' },
  ],
  specs: [
    { label: 'Materials', value: 'Cardboard, Kraft, Rigid' },
    { label: 'Printing', value: 'Offset, Digital, Flexo' },
    { label: 'Finishes', value: 'Matte, Gloss, Soft-touch' },
    { label: 'Minimum', value: '100-500 pieces' },
  ],
  priceRange: 'ETB 1000 - 10000 per 100',
  minOrder: '100 pieces',
  turnaround: '7-10 days',
  materials: [
    'Cardboard',
    'Kraft Paper',
    'Rigid Box Board',
    'Corrugated',
    'Magnetic Closure',
    'Eco-friendly Materials',
  ],
  formats: ['AI', 'PDF', 'CDR', 'INDD', 'CAD'],
  colors: [
    'CMYK Full Color',
    'Spot Colors',
    'Gold/Silver Foil',
    'UV Coating',
  ],
  gallery: [
    { src: '/images/services/packaging-1.jpg', alt: 'Packaging Sample 1' },
    { src: '/images/services/packaging-2.jpg', alt: 'Packaging Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the minimum order for custom boxes?',
      answer: 'Minimum orders vary by box type and complexity, typically starting at 100-500 pieces. Contact us for a quote.',
    },
    {
      question: 'Can you create a prototype?',
      answer: 'Yes! We offer prototyping services to ensure your packaging looks and functions perfectly before mass production.',
    },
  ],
  relatedServices: [
    { title: 'Labels', href: '/page/services/labels', icon: <Bookmark size={20} /> },
    { title: 'Business Cards', href: '/page/services/business-cards', icon: <FileText size={20} /> },
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
  ],
};

export default function PackagingPage() {
  return <ServiceTemplate service={service} />;
}