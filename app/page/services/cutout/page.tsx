// app/page/services/cutout/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Flame, Scissors, Snowflake, Tag } from 'lucide-react';

const service = {
  id: 'cutout',
  title: 'Custom Cutout',
  shortDescription: 'Precision die-cut shapes and letters.',
  fullDescription: 'Custom die-cut shapes, letters, and designs in various materials. Perfect for signage, displays, stickers, and craft projects. Our precision cutting machines can create any shape you can imagine from vinyl, paper, cardboard, acrylic, and foam.',
  icon: <Scissors size={32} />,
  gradient: 'from-green-500 to-teal-500',
  badge: 'Versatile',
  features: [
    'Custom shapes',
    'Multiple materials',
    'Precision cutting',
    'Small to bulk',
    'Fast turnaround',
    'Ready to use',
    'Weeding included',
    'Transfer tape',
  ],
  applications: [
    'Wall Decals',
    'Window Graphics',
    'Lettering',
    'Craft Projects',
    'Signage',
    'Model Making',
    'Packaging',
    'Scrapbooking',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create vector artwork' },
    { step: 2, title: 'Material', description: 'Select your material' },
    { step: 3, title: 'Cut', description: 'Precision cutting' },
    { step: 4, title: 'Weed', description: 'Remove excess' },
    { step: 5, title: 'Apply Transfer', description: 'Add application tape' },
    { step: 6, title: 'Package', description: 'Ready for use' },
  ],
  specs: [
    { label: 'Max Width', value: '24"' },
    { label: 'Materials', value: 'Vinyl, Paper, Cardboard, Acrylic, Foam' },
    { label: 'Thickness', value: 'Up to 10mm' },
    { label: 'Tolerance', value: '±0.1mm' },
  ],
  priceRange: 'ETB 100 - 1500',
  minOrder: '1 piece',
  turnaround: '2-3 days',
  materials: [
    'Adhesive Vinyl',
    'Heat Transfer Vinyl',
    'Cardboard',
    'Paper',
    'Acrylic',
    'Foam Board',
    'Magnetic Sheet',
    'Felt',
  ],
  formats: ['AI', 'PDF', 'SVG', 'DXF', 'CDR', 'EPS'],
  colors: [
    'All Vinyl Colors',
    'Printed Vinyl',
    'Natural Materials',
    'Painted Options',
  ],
  gallery: [
    { src: '/images/services/cutout-1.jpg', alt: 'Cutout Sample 1' },
    { src: '/images/services/cutout-2.jpg', alt: 'Cutout Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the smallest detail you can cut?',
      answer: 'We can cut details as small as 1mm in vinyl, 3mm in thicker materials. Contact us to discuss your specific needs.',
    },
    {
      question: 'Do you include application tape?',
      answer: 'Yes! All adhesive vinyl cutouts include transfer tape for easy application. We also provide application instructions.',
    },
  ],
  relatedServices: [
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
    { title: 'Frosted Glass', href: '/page/services/frosted', icon: <Snowflake size={20} /> },
    { title: 'Engraving', href: '/page/services/engraving', icon: <Flame size={20} /> },
  ],
};

export default function CutoutPage() {
  return <ServiceTemplate service={service} />;
}