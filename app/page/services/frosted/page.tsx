// app/page/services/frosted/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Flame, Scissors, Snowflake, Tag } from 'lucide-react';

const service = {
  id: 'frosted-glass',
  title: 'Frosted Glass',
  shortDescription: 'Elegant frosted glass effects for privacy and style.',
  fullDescription: 'Professional frosted glass application for windows, doors, partitions, and glassware. Creates elegant privacy while allowing light transmission. Choose from etched-look vinyl or true acid etching for permanent results. Perfect for offices, homes, and commercial spaces.',
  icon: <Snowflake size={32} />,
  gradient: 'from-cyan-500 to-blue-500',
  badge: 'Elegant',
  features: [
    'Privacy solution',
    'UV protection',
    'Custom patterns',
    'Easy application',
    'Removable options',
    'Durable finish',
    'Logo integration',
    'Various opacities',
  ],
  applications: [
    'Office Partitions',
    'Conference Rooms',
    'Shower Doors',
    'Store Fronts',
    'Windows',
    'Glass Doors',
    'Display Cases',
    'Drinkware',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create pattern or logo' },
    { step: 2, title: 'Measure', description: 'Precise measurements' },
    { step: 3, title: 'Cut', description: 'Precision cutting' },
    { step: 4, title: 'Apply', description: 'Professional installation' },
    { step: 5, title: 'Squeegee', description: 'Remove bubbles' },
    { step: 6, title: 'Finish', description: 'Perfect final look' },
  ],
  specs: [
    { label: 'Materials', value: 'Vinyl Film, Etching Cream' },
    { label: 'Opacity', value: '10-90%' },
    { label: 'Application', value: 'Interior/Exterior' },
    { label: 'Durability', value: '5-10 years' },
  ],
  priceRange: 'ETB 300 - 2000',
  minOrder: '1 sq meter',
  turnaround: '2-3 days',
  materials: [
    'Frosted Vinyl',
    'Clear Vinyl',
    'Etching Cream',
    'Sandblast Resist',
    'Patterned Film',
  ],
  formats: ['AI', 'PDF', 'SVG', 'DXF', 'CDR'],
  colors: [
    'Frosted White',
    'Satin Finish',
    'Matte Clear',
    'Patterned',
  ],
  gallery: [
    { src: '/images/services/frosted-1.jpg', alt: 'Frosted Glass Sample 1' },
    { src: '/images/services/frosted-2.jpg', alt: 'Frosted Glass Sample 2' },
  ],
  faqs: [
    {
      question: 'Is it permanent or removable?',
      answer: 'We offer both! Vinyl film is removable and great for rentals. Acid etching is permanent for a lifetime solution.',
    },
    {
      question: 'Can you create custom patterns?',
      answer: 'Absolutely! Any design, logo, or pattern can be created. From simple stripes to complex company logos.',
    },
  ],
  relatedServices: [
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
    { title: 'Cutout', href: '/page/services/cutout', icon: <Scissors size={20} /> },
    { title: 'Engraving', href: '/page/services/engraving', icon: <Flame size={20} /> },
  ],
};

export default function FrostedPage() {
  return <ServiceTemplate service={service} />;
}