// app/page/services/bottles/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Coffee, Flame, ShoppingBag, Wine } from 'lucide-react';

const service = {
  id: 'bottle-printing',
  title: 'Bottle Printing',
  shortDescription: 'Custom printed water bottles, tumblers, and drinkware.',
  fullDescription: 'Personalized stainless steel bottles, tumblers, and glassware. Perfect for corporate gifts, events, and eco-friendly promotions. Our durable printing lasts through daily use and washing. Choose from various styles including insulated bottles, wine glasses, and shot glasses.',
  icon: <Wine size={32} />,
  gradient: 'from-blue-500 to-indigo-500',
  badge: 'Eco-Friendly',
  features: [
    'Stainless steel options',
    'Glass available',
    'Insulated styles',
    'Dishwasher safe',
    'Bulk discounts',
    'Custom colors',
    'Engraving available',
    'Gift packaging',
  ],
  applications: [
    'Corporate Gifts',
    'Eco-Friendly Promos',
    'Wedding Favors',
    'Sports Teams',
    'Gym Promotions',
    'Outdoor Events',
    'Brand Merchandise',
    'Thank You Gifts',
  ],
  process: [
    { step: 1, title: 'Select Bottle', description: 'Choose style and color' },
    { step: 2, title: 'Design', description: 'Upload your logo or artwork' },
    { step: 3, title: 'Proof', description: 'Approve digital mockup' },
    { step: 4, title: 'Print/Engrave', description: 'Apply your design' },
    { step: 5, title: 'Quality Check', description: 'Inspect each bottle' },
    { step: 6, title: 'Package', description: 'Gift box and ship' },
  ],
  specs: [
    { label: 'Materials', value: 'Stainless Steel, Glass' },
    { label: 'Sizes', value: '12oz, 16oz, 20oz, 32oz' },
    { label: 'Print Method', value: 'Sublimation, Engraving' },
    { label: 'Insulation', value: 'Double-wall available' },
  ],
  priceRange: 'ETB 250 - 800',
  minOrder: '10 pieces',
  turnaround: '4-5 days',
  materials: [
    'Stainless Steel',
    'Glass',
    'Tritan Plastic',
    'Aluminum',
    'Copper-lined',
    'Ceramic',
  ],
  formats: ['AI', 'PNG', 'PDF', 'EPS', 'SVG'],
  colors: [
    'Full Color',
    'Single Color',
    'Engraved',
  ],
  gallery: [
    { src: '/images/services/bottles-1.jpg', alt: 'Bottle Sample 1' },
    { src: '/images/services/bottles-2.jpg', alt: 'Bottle Sample 2' },
  ],
  faqs: [
    {
      question: 'Can you print on both stainless steel and glass?',
      answer: 'Yes! We offer sublimation printing on stainless steel and ceramic coating on glass for durable, beautiful results on both materials.',
    },
    {
      question: 'How durable is the print?',
      answer: 'Our prints are extremely durable and designed to last through daily use and dishwasher cycles without fading or peeling.',
    },
  ],
  relatedServices: [
    { title: 'Mug Printing', href: '/page/services/mugs', icon: <Coffee size={20} /> },
    { title: 'Engraving', href: '/page/services/engraving', icon: <Flame size={20} /> },
    { title: 'Tote Bags', href: '/page/services/totes', icon: <ShoppingBag size={20} /> },
  ],
};

export default function BottlesPage() {
  return <ServiceTemplate service={service} />;
}