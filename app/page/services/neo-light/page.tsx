// app/page/services/neo-light/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Flame, Lightbulb, Scissors, Sparkle } from 'lucide-react';

const service = {
  id: 'neo-light',
  title: 'Neo Light (LED Neon)',
  shortDescription: 'Flexible LED neon signs with modern appeal.',
  fullDescription: 'Modern LED neon signs that mimic the look of traditional glass neon but are flexible, durable, and energy-efficient. Perfect for business signs, home decor, and events. Create custom shapes, logos, and text with our flexible LED tubing in various colors.',
  icon: <Sparkle size={32} />,
  gradient: 'from-pink-500 to-purple-500',
  badge: 'Trending',
  features: [
    'Flexible design',
    'Energy efficient',
    'Custom shapes',
    'Durable',
    'Indoor/outdoor',
    'Remote control',
    'Dimmable options',
    'RGB color changing',
  ],
  applications: [
    'Business Logos',
    'Wedding Backdrops',
    'Home Decor',
    'Bar Signs',
    'Store Windows',
    'Photo Booths',
    'Kids Room Decor',
    'Event Branding',
  ],
  process: [
    { step: 1, title: 'Sketch Idea', description: 'Share your concept' },
    { step: 2, title: 'Digital Design', description: 'Create vector artwork' },
    { step: 3, title: 'Size Selection', description: 'Choose dimensions' },
    { step: 4, title: 'LED Fabrication', description: 'Bend and assemble' },
    { step: 5, title: 'Backer Board', description: 'Mount on acrylic' },
    { step: 6, title: 'Test & Ship', description: 'Quality check and delivery' },
  ],
  specs: [
    { label: 'LED Type', value: 'Flexible Neon' },
    { label: 'Colors', value: 'Single, Multi, RGB' },
    { label: 'Power', value: '12V DC' },
    { label: 'Lifespan', value: '50,000 hours' },
  ],
  priceRange: 'ETB 2000 - 8000',
  minOrder: '1 piece',
  turnaround: '7-10 days',
  materials: [
    'Flexible LED Tubing',
    'Acrylic Backer',
    'Power Supply',
    'Mounting Hardware',
    'Remote Control',
    'Dimming Module',
  ],
  formats: ['AI', 'PDF', 'SVG', 'DXF', 'CDR'],
  colors: [
    'Warm White',
    'Cool White',
    'Red',
    'Blue',
    'Green',
    'RGB Color-Changing',
    'Pink',
    'Purple',
  ],
  gallery: [
    { src: '/images/services/neon-1.jpg', alt: 'Neon Light Sample 1' },
    { src: '/images/services/neon-2.jpg', alt: 'Neon Light Sample 2' },
  ],
  faqs: [
    {
      question: 'How does LED neon compare to glass neon?',
      answer: 'LED neon is safer (no glass, low voltage), more durable, energy-efficient, and flexible. It can be shaped into custom designs that would be impossible with glass.',
    },
    {
      question: 'Can I hang it outdoors?',
      answer: 'Yes! Our LED neon signs are weather-resistant and suitable for both indoor and outdoor use. We can add weatherproofing for exposed installations.',
    },
  ],
  relatedServices: [
    { title: 'Light Box', href: '/page/services/light-box', icon: <Lightbulb size={20} /> },
    { title: 'Cutout', href: '/page/services/cutout', icon: <Scissors size={20} /> },
    { title: 'Engraving', href: '/page/services/engraving', icon: <Flame size={20} /> },
  ],
};

export default function NeoLightPage() {
  return <ServiceTemplate service={service} />;
}