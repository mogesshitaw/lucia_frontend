// app/page/services/stickers/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Bookmark, Key, Snowflake, Tag } from 'lucide-react';

const service = {
  id: 'custom-stickers',
  title: 'Custom Stickers',
  shortDescription: 'Die-cut and kiss-cut stickers in various finishes.',
  fullDescription: 'High-quality custom stickers perfect for branding, products, and promotions. Choose from various shapes, sizes, and finishes including matte, glossy, and transparent. Our stickers are weather-resistant and durable, suitable for indoor and outdoor use.',
  icon: <Tag size={32} />,
  gradient: 'from-yellow-500 to-orange-500',
  badge: 'Popular',
  features: [
    'Custom die-cut shapes',
    'Kiss-cut on sheets or rolls',
    'Matte/glossy finish',
    'Weather resistant',
    'Small to bulk orders',
    'Fast turnaround',
    'Easy application',
    'Removable options',
  ],
  applications: [
    'Product Branding',
    'Laptop Decals',
    'Water Bottles',
    'Car Bumpers',
    'Packaging Seals',
    'Event Giveaways',
    'Business Branding',
    'Scrapbooking',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create or upload your artwork' },
    { step: 2, title: 'Shape Selection', description: 'Choose custom or standard shape' },
    { step: 3, title: 'Material', description: 'Select vinyl type and finish' },
    { step: 4, title: 'Proof', description: 'Approve digital proof' },
    { step: 5, title: 'Production', description: 'Print and cut your stickers' },
    { step: 6, title: 'Packaging', description: 'Shipped on sheets or rolls' },
  ],
  specs: [
    { label: 'Max Size', value: '12" x 24"' },
    { label: 'Materials', value: 'Vinyl, Paper, Clear' },
    { label: 'Finishes', value: 'Matte, Glossy' },
    { label: 'Cut Type', value: 'Die-cut, Kiss-cut' },
  ],
  priceRange: 'ETB 100 - 1000',
  minOrder: '10 pieces',
  turnaround: '2-3 days',
  materials: [
    'White Vinyl',
    'Clear Vinyl',
    'Matte Paper',
    'Glossy Paper',
    'Weatherproof Vinyl',
    'Removable Vinyl',
  ],
  formats: ['AI', 'PNG', 'PDF', 'EPS', 'SVG', 'PSD'],
  colors: [
    'Full Color CMYK',
    'Spot Colors',
    'White Ink on Clear',
  ],
  gallery: [
    { src: '/images/services/stickers-1.jpg', alt: 'Sticker Sample 1' },
    { src: '/images/services/stickers-2.jpg', alt: 'Sticker Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the difference between die-cut and kiss-cut?',
      answer: 'Die-cut stickers are cut through the material to the exact shape. Kiss-cut stickers are cut through the sticker layer but leave the backing intact, making them easy to peel.',
    },
    {
      question: 'Are your stickers waterproof?',
      answer: 'Yes! Our vinyl stickers are waterproof and weather-resistant, perfect for outdoor use on cars, water bottles, and more.',
    },
  ],
  relatedServices: [
    { title: 'Labels', href: '/page/services/labels', icon: <Bookmark size={20} /> },
    { title: 'Frosted Glass', href: '/page/services/frosted', icon: <Snowflake size={20} /> },
    { title: 'Keychains', href: '/page/services/keychains', icon: <Key size={20} /> },
  ],
};

export default function StickersPage() {
  return <ServiceTemplate service={service} />;
}