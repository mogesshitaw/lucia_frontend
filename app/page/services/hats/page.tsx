// app/page/services/hats/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Shirt, ShoppingBag, Sparkles } from 'lucide-react';

const service = {
  id: 'custom-hats',
  title: 'Custom Hats & Caps',
  shortDescription: 'Personalized hats and caps with embroidery or printed designs.',
  fullDescription: 'Make a statement with custom headwear for your team, brand, or event. We offer a wide range of hat styles including baseball caps, snapbacks, beanies, visors, and trucker hats. Choose from embroidery for a premium look or printed designs for full-color artwork.',
  icon: <Shirt size={32} />,
  gradient: 'from-blue-500 to-cyan-500',
  badge: 'Trending',
  features: [
    'Embroidery included',
    'Printed options available',
    'Adjustable fit styles',
    'Various crown styles',
    'Bulk discounts',
    'Fast delivery',
    'Custom patches',
    '3D puff embroidery',
  ],
  applications: [
    'Corporate Events',
    'Sports Teams',
    'Trade Shows',
    'Golf Tournaments',
    'Brand Promotion',
    'Wedding Parties',
    'Music Festivals',
    'Streetwear Brands',
  ],
  process: [
    { step: 1, title: 'Choose Style', description: 'Select hat style and color' },
    { step: 2, title: 'Submit Logo', description: 'Upload your artwork' },
    { step: 3, title: 'Digitize', description: 'We prepare your design for embroidery' },
    { step: 4, title: 'Production', description: 'Your hats are embroidered' },
    { step: 5, title: 'Quality Check', description: 'Each hat inspected' },
    { step: 6, title: 'Ship', description: 'Delivered to your location' },
  ],
  specs: [
    { label: 'Embroidery', value: 'Up to 12 colors' },
    { label: 'Max Stitches', value: '15,000' },
    { label: 'Hat Styles', value: 'Baseball, Snapback, Beanie, Visor' },
    { label: 'Closure', value: 'Adjustable, Strapback, Flexfit' },
  ],
  priceRange: 'ETB 180 - 450',
  minOrder: '10 pieces',
  turnaround: '4-6 days',
  materials: [
    'Cotton Twill',
    'Polyester',
    'Wool Blend',
    'Acrylic',
    'Mesh Back',
    'Denim',
  ],
  formats: ['AI', 'PNG', 'PDF', 'EPS', 'DST', 'PES'],
  colors: [
    'Black',
    'White',
    'Navy',
    'Red',
    'Khaki',
    'Gray',
    'Royal Blue',
    'Forest Green',
  ],
  gallery: [
    { src: '/images/services/hats-1.jpg', alt: 'Hat Sample 1' },
    { src: '/images/services/hats-2.jpg', alt: 'Hat Sample 2' },
  ],
  faqs: [
    {
      question: 'Can I get a sample before bulk order?',
      answer: 'Yes! We offer sample service for bulk orders. Order 1-2 pieces to approve quality before placing your full order.',
    },
    {
      question: 'What is the difference between embroidery and print?',
      answer: 'Embroidery is stitched thread for a premium, textured look that lasts forever. Printing allows full-color, photo-realistic designs but may fade over time.',
    },
  ],
  relatedServices: [
    { title: 'T-Shirts', href: '/page/services/tshirt', icon: <Shirt size={20} /> },
    { title: 'Embroidery', href: '/page/services/embroidery', icon: <Sparkles size={20} /> },
    { title: 'Tote Bags', href: '/page/services/totes', icon: <ShoppingBag size={20} /> },
  ],
};

export default function HatsPage() {
  return <ServiceTemplate service={service} />;
}