// app/page/services/mugs/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Coffee, Key, Shirt, Wine } from 'lucide-react';

const service = {
  id: 'mug-printing',
  title: 'Mug Printing',
  shortDescription: 'Custom printed mugs for gifts and promotions.',
  fullDescription: 'Personalized ceramic mugs perfect for corporate gifts, events, and personal use. Full-color printing with sublimation technology for durable, dishwasher-safe results. Choose from standard white mugs or colored options with white printing areas.',
  icon: <Coffee size={32} />,
  gradient: 'from-orange-500 to-red-500',
  badge: 'Gift Idea',
  features: [
    'Full color printing',
    'Dishwasher safe',
    'Various sizes',
    'Bulk pricing',
    'Fast turnaround',
    'Gift packaging',
    'Photo quality prints',
    'Magic mug options',
  ],
  applications: [
    'Corporate Gifts',
    'Wedding Favors',
    'Family Photos',
    'Business Promotions',
    'Thank You Gifts',
    'Event Souvenirs',
    'Holiday Gifts',
    'Employee Recognition',
  ],
  process: [
    { step: 1, title: 'Choose Mug', description: 'Select size and color' },
    { step: 2, title: 'Upload Design', description: 'Submit your artwork or photo' },
    { step: 3, title: 'Proof', description: 'Approve digital mockup' },
    { step: 4, title: 'Print', description: 'Sublimation printing' },
    { step: 5, title: 'Heat Press', description: 'Design permanently fused' },
    { step: 6, title: 'Package', description: 'Gift boxed and shipped' },
  ],
  specs: [
    { label: 'Sizes', value: '11oz, 15oz, Espresso' },
    { label: 'Material', value: 'Ceramic' },
    { label: 'Print Area', value: 'Full wrap' },
    { label: 'Care', value: 'Dishwasher safe' },
  ],
  priceRange: 'ETB White(120) , Magic(700)',
  minOrder: '6 pieces',
  turnaround: '3-4 days',
  materials: [
    'White Ceramic',
    'Black Ceramic',
    'Color Ceramic',
    'Enamel',
    'Travel Mugs',
    'Magic Mugs',
  ],
  formats: ['PNG', 'JPG', 'AI', 'PSD', 'PDF'],
  colors: [
    'Full Color',
    'Black & White',
    'Sepia',
  ],
  gallery: [
    { src: '/images/services/mugs-1.jpg', alt: 'Mug Sample 1' },
    { src: '/images/services/mugs-2.jpg', alt: 'Mug Sample 2' },
  ],
  faqs: [
    {
      question: 'Can I print photos on mugs?',
      answer: 'Yes! Photo quality printing is our specialty. Send us your favorite photos and we\'ll create beautiful, lasting memories on mugs.',
    },
    {
      question: 'Are the prints dishwasher safe?',
      answer: 'Absolutely! Our sublimation prints become part of the mug coating and are completely dishwasher safe for years of use.',
    },
  ],
  relatedServices: [
    { title: 'Bottle Printing', href: '/page/services/bottles', icon: <Wine size={20} /> },
    { title: 'Keychains', href: '/page/services/keychains', icon: <Key size={20} /> },
    { title: 'T-Shirts', href: '/page/services/tshirt', icon: <Shirt size={20} /> },
  ],
};

export default function MugsPage() {
  return <ServiceTemplate service={service} />;
}