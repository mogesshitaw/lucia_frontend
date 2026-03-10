// app/page/services/engraving/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Award, Flame, Key, Scissors } from 'lucide-react';

const service = {
  id: 'engraving',
  title: 'Laser Engraving',
  shortDescription: 'Precision laser engraving on various materials.',
  fullDescription: 'High-precision laser engraving on wood, acrylic, metal, glass, and leather. Perfect for trophies, awards, gifts, and personalized items. Our laser systems can create detailed designs, photos, and text with permanent results that will never fade or wear off.',
  icon: <Flame size={32} />,
  gradient: 'from-gray-500 to-gray-700',
  badge: 'Precision',
  features: [
    'Multiple materials',
    'High precision',
    'Permanent marking',
    'Photos possible',
    'Fast turnaround',
    'Custom designs',
    'No minimum',
    'Vector and raster',
  ],
  applications: [
    'Trophies & Awards',
    'Personalized Gifts',
    'Nameplates',
    'Jewelry',
    'Corporate Gifts',
    'Wedding Signs',
    'Keychains',
    'Leather Goods',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create or upload artwork' },
    { step: 2, title: 'Material Select', description: 'Choose your material' },
    { step: 3, title: 'Test', description: 'Sample on similar material' },
    { step: 4, title: 'Engrave', description: 'Laser precision' },
    { step: 5, title: 'Clean', description: 'Remove residue' },
    { step: 6, title: 'Package', description: 'Ready for pickup/ship' },
  ],
  specs: [
    { label: 'Max Size', value: '24" x 36"' },
    { label: 'Resolution', value: '1200 DPI' },
    { label: 'Materials', value: 'Wood, Acrylic, Metal, Glass, Leather' },
    { label: 'Laser Type', value: 'CO2 & Fiber' },
  ],
  priceRange: 'ETB 10,000 - 11,000',
  minOrder: '1 piece',
  turnaround: '2-3 days',
  materials: [
    'Wood',
    'Acrylic',
    'Stainless Steel',
    'Brass',
    'Aluminum',
    'Glass',
    'Leather',
    'Paper',
    'Cork',
    'Marble',
  ],
  formats: ['AI', 'PDF', 'SVG', 'DXF', 'JPG', 'PNG', 'BMP'],
  colors: [
    'Natural Wood',
    'Black Fill',
    'White Fill',
    'Metal Etch',
    'Glass Frost',
  ],
  gallery: [
    { src: '/images/services/engraving-1.jpg', alt: 'Engraving Sample 1' },
    { src: '/images/services/engraving-2.jpg', alt: 'Engraving Sample 2' },
  ],
  faqs: [
    {
      question: 'Can you engrave photographs?',
      answer: 'Yes! We can convert photos to detailed engravings on various materials. Best results on wood, acrylic, and coated metals.',
    },
    {
      question: 'How deep is the engraving?',
      answer: 'Depth varies by material but typically 0.1-0.5mm for detailed work. Deeper engraving available for specific applications.',
    },
  ],
  relatedServices: [
    { title: 'Cutout', href: '/page/services/cutout', icon: <Scissors size={20} /> },
    { title: 'Keychains', href: '/page/services/keychains', icon: <Key size={20} /> },
    { title: 'Trophies', href: '/page/services/trophies', icon: <Award size={20} /> },
  ],
};

export default function EngravingPage() {
  return <ServiceTemplate service={service} />;
}