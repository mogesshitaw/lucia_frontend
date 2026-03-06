// app/page/services/light-box/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Lightbulb, Megaphone, Scissors, Sparkle } from 'lucide-react';

const service = {
  id: 'light-box',
  title: 'Light Box',
  shortDescription: 'LED illuminated signs for eye-catching displays.',
  fullDescription: 'Professional LED light boxes for retail, business signage, and events. Custom sizes and designs with bright, energy-efficient LED lighting. Our light boxes create stunning visual impact day and night, perfect for storefronts, trade shows, and interior displays.',
  icon: <Lightbulb size={32} />,
  gradient: 'from-yellow-500 to-amber-500',
  badge: 'Premium',
  features: [
    'LED illumination',
    'Custom sizes',
    'Energy efficient',
    'Long lifespan',
    'Indoor/outdoor',
    'Easy installation',
    'Even lighting',
    'Slim profile',
  ],
  applications: [
    'Store Fronts',
    'Menu Boards',
    'Trade Show Displays',
    'Wayfinding Signs',
    'Brand Displays',
    'Museum Exhibits',
    'Hotel Lobbies',
    'Restaurant Signs',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create your artwork' },
    { step: 2, title: 'Size Selection', description: 'Choose dimensions' },
    { step: 3, title: 'Frame Build', description: 'Construct aluminum frame' },
    { step: 4, title: 'LED Installation', description: 'Install LED lighting' },
    { step: 5, title: 'Print Face', description: 'Print graphic on acrylic' },
    { step: 6, title: 'Assembly', description: 'Complete and test' },
  ],
  specs: [
    { label: 'Frame Material', value: 'Aluminum' },
    { label: 'Face Material', value: 'Acrylic' },
    { label: 'LED Type', value: 'SMD 2835' },
    { label: 'Lifespan', value: '50,000 hours' },
  ],
  priceRange: 'ETB 1500 - 5000',
  minOrder: '1 piece',
  turnaround: '5-7 days',
  materials: [
    'Aluminum Frame',
    'Acrylic Face',
    'PVC Back',
    'LED Strips',
    'Power Supply',
    'Mounting Hardware',
  ],
  formats: ['AI', 'PDF', 'CDR', 'EPS', 'SVG'],
  colors: [
    'Single Color',
    'Full Color Print',
    'White LED',
    'RGB Color',
  ],
  gallery: [
    { src: '/images/services/lightbox-1.jpg', alt: 'Light Box Sample 1' },
    { src: '/images/services/lightbox-2.jpg', alt: 'Light Box Sample 2' },
  ],
  faqs: [
    {
      question: 'Can I change the graphic later?',
      answer: 'Yes! Many of our light boxes feature removable faces, allowing you to update graphics as needed without replacing the entire unit.',
    },
    {
      question: 'Are they suitable for outdoor use?',
      answer: 'Absolutely! We offer weatherproof options with sealed frames and UV-protected faces specifically designed for outdoor installation.',
    },
  ],
  relatedServices: [
    { title: 'Neo Light', href: '/page/services/neo-light', icon: <Sparkle size={20} /> },
    { title: 'Banners', href: '/page/services/banners', icon: <Megaphone size={20} /> },
    { title: 'Cutout', href: '/page/services/cutout', icon: <Scissors size={20} /> },
  ],
};

export default function LightBoxPage() {
  return <ServiceTemplate service={service} />;
}