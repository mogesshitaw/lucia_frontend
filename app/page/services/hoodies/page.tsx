// app/page/services/hoodies/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Shirt, Sparkles } from 'lucide-react';

const service = {
  id: 'hoodies',
  title: 'Hoodies & Sweatshirts',
  shortDescription: 'Comfortable custom hoodies for any season.',
  fullDescription: 'Stay warm and stylish with our custom hoodies and sweatshirts. Perfect for teams, events, and corporate wear. Various styles and colors available with multiple print methods including DTF, screen printing, and embroidery.',
  icon: <Shirt size={32} />,
  gradient: 'from-blue-500 to-purple-500',
  badge: 'Comfort',
  features: [
    'Premium blank hoodies',
    'All sizes XS-5XL',
    'Embroidery option',
    'Bulk pricing available',
    'Fast turnaround',
    'Quality materials',
    'Pockets available',
    'Zipper or pullover',
  ],
  applications: [
    'Team Warm-ups',
    'Company Events',
    'Brand Merchandise',
    'Gifts',
    'School Spirit',
    'Music Bands',
    'Sports Teams',
    'Family Reunions',
  ],
  process: [
    { step: 1, title: 'Choose Style', description: 'Select hoodie type and color' },
    { step: 2, title: 'Design', description: 'Submit your artwork' },
    { step: 3, title: 'Method', description: 'Choose print or embroidery' },
    { step: 4, title: 'Proof', description: 'Approve digital mockup' },
    { step: 5, title: 'Production', description: 'Print or embroider' },
    { step: 6, title: 'Ship', description: 'Deliver to you' },
  ],
  specs: [
    { label: 'Styles', value: 'Pullover, Zip-up, Hoodless' },
    { label: 'Fabrics', value: 'Cotton, Fleece, Blends' },
    { label: 'Weights', value: '7.5oz - 12oz' },
    { label: 'Print Area', value: 'Full front, back, sleeve' },
  ],
  priceRange: 'ETB 250 - 600',
  minOrder: '6 pieces',
  turnaround: '3-5 days',
  materials: [
    '80/20 Cotton/Poly',
    '50/50 Cotton/Poly',
    '100% Cotton',
    'French Terry',
    'Fleece',
    'Performance Fabric',
  ],
  formats: ['AI', 'PNG', 'PDF', 'PSD', 'EPS'],
  colors: [
    'Black',
    'Navy',
    'Gray',
    'Red',
    'Royal Blue',
    'Forest Green',
    'Maroon',
    'White',
    'Charcoal',
    'Heather Gray',
  ],
  gallery: [
    { src: '/images/services/hoodies-1.jpg', alt: 'Hoodie Sample 1' },
    { src: '/images/services/hoodies-2.jpg', alt: 'Hoodie Sample 2' },
  ],
  faqs: [
    {
      question: 'What print methods work best on hoodies?',
      answer: 'DTF printing works great for full-color designs on any color hoodie. Screen printing is best for bulk orders with spot colors. Embroidery gives a premium, textured look.',
    },
    {
      question: 'Do you offer youth sizes?',
      answer: 'Yes! We carry youth sizes in most hoodie styles. Please specify when ordering.',
    },
  ],
  relatedServices: [
    { title: 'T-Shirts', href: '/page/services/tshirt', icon: <Shirt size={20} /> },
    { title: 'Hats', href: '/page/services/hats', icon: <Shirt size={20} /> },
    { title: 'Embroidery', href: '/page/services/embroidery', icon: <Sparkles size={20} /> },
  ],
};

export default function HoodiesPage() {
  return <ServiceTemplate service={service} />;
}