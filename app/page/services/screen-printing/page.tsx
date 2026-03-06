// app/page/services/embroidery/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Layers, Shirt, ShoppingBag, Sparkles } from 'lucide-react';

const service = {
  id: 'embroidery',
  title: 'Embroidery',
  shortDescription: 'Professional embroidery for a premium, textured look.',
  fullDescription: 'Add a touch of class with our professional embroidery service. Perfect for corporate wear, caps, jackets, and bags. We offer digitizing services and thread matching for a premium finish that lasts forever. Embroidery adds texture and dimension that stands out.',
  icon: <Sparkles size={32} />,
  gradient: 'from-green-500 to-emerald-500',
  badge: 'Premium',
  features: [
    '3D puff embroidery option',
    'Perfect thread matching',
    'Digitizing included',
    'Multiple placement options',
    'Bulk discounts available',
    'Professional finish',
    'Left chest, full front, sleeve',
    'Back embroidery available',
  ],
  applications: [
    'Corporate Polos',
    'Company Caps',
    'Team Jackets',
    'Uniforms',
    'Golf Shirts',
    'Workwear',
    'Tote Bags',
    'Hoodies',
  ],
  process: [
    { step: 1, title: 'Digitize', description: 'Convert artwork to stitch file' },
    { step: 2, title: 'Thread Select', description: 'Match thread colors' },
    { step: 3, title: 'Hoop', description: 'Mount garment in hoop' },
    { step: 4, title: 'Stitch', description: 'Machine embroidery' },
    { step: 5, title: 'Trim', description: 'Remove excess threads' },
    { step: 6, title: 'Press', description: 'Final pressing' },
  ],
  specs: [
    { label: 'Max Stitches', value: '15,000 per design' },
    { label: 'Max Size', value: '12" x 12"' },
    { label: 'Colors', value: 'Up to 12 thread colors' },
    { label: 'Min Order', value: '6 pieces' },
  ],
  priceRange: 'ETB 180 - 550 per piece',
  minOrder: '6 pieces',
  turnaround: '5-7 days',
  materials: [
    'Polo Shirts',
    'Caps & Hats',
    'Jackets',
    'Hoodies',
    'Tote Bags',
    'Aprons',
    'Towels',
    'Blankets',
  ],
  formats: ['AI', 'PNG', 'JPG', 'DST', 'PES', 'EXP'],
  colors: [
    'Madeira Threads',
    '100+ colors available',
    'Metallic options',
    'Glow thread',
  ],
  gallery: [
    { src: '/images/services/embroidery-1.jpg', alt: 'Embroidery Sample 1' },
    { src: '/images/services/embroidery-2.jpg', alt: 'Embroidery Sample 2' },
  ],
  faqs: [
    {
      question: 'What is digitizing?',
      answer: 'Digitizing is the process of converting your logo into a stitch file that embroidery machines can read. It determines stitch types, directions, and densities for the best result.',
    },
    {
      question: 'How long does embroidery last?',
      answer: 'Embroidery is permanent and will last as long as the garment itself. It won\'t fade, crack, or peel like printed designs.',
    },
  ],
  relatedServices: [
    { title: 'Hats', href: '/page/services/hats', icon: <Shirt size={20} /> },
    { title: 'Screen Printing', href: '/page/services/screen-printing', icon: <Layers size={20} /> },
    { title: 'Tote Bags', href: '/page/services/totes', icon: <ShoppingBag size={20} /> },
  ],
};

export default function EmbroideryPage() {
  return <ServiceTemplate service={service} />;
}