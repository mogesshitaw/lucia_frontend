// app/page/services/banners/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Car, Lightbulb, Megaphone, Image as LucideImage } from 'lucide-react';

const service = {
  id: 'banner-printing',
  title: 'Banner Printing',
  shortDescription: 'Large format banners for indoor and outdoor advertising.',
  fullDescription: 'High-quality banner printing for events, retail displays, trade shows, and outdoor advertising. We offer various materials including vinyl, mesh, and fabric, with finishes to suit any environment. Our banners are weather-resistant and built to last.',
  icon: <Megaphone size={32} />,
  gradient: 'from-red-500 to-orange-500',
  badge: 'Popular',
  features: [
    'Indoor/outdoor options',
    'Multiple sizes up to 5m',
    'Grommets included',
    'Weather resistant',
    'UV protection',
    'Fast production',
    'Hemmed edges',
    'Pole pockets available',
  ],
  applications: [
    'Trade Show Displays',
    'Store Fronts',
    'Event Backdrops',
    'Construction Sites',
    'Retail Promotions',
    'Festivals & Fairs',
    'Political Campaigns',
    'Real Estate Signs',
  ],
  process: [
    { step: 1, title: 'Upload Design', description: 'Submit your artwork' },
    { step: 2, title: 'Size Selection', description: 'Choose dimensions and material' },
    { step: 3, title: 'Proof Approval', description: 'Review digital proof' },
    { step: 4, title: 'Printing', description: 'Large format printing' },
    { step: 5, title: 'Finishing', description: 'Add grommets, hems, or pockets' },
    { step: 6, title: 'Delivery', description: 'Shipped or ready for pickup' },
  ],
  specs: [
    { label: 'Max Width', value: '5 meters' },
    { label: 'Resolution', value: '720 DPI' },
    { label: 'Material Options', value: 'Vinyl, Mesh, Fabric' },
    { label: 'Finishing', value: 'Grommets, Hems, Pockets' },
  ],
  priceRange: 'ETB 250 - 2000',
  minOrder: '1 piece',
  turnaround: '1-2 days',
  materials: [
    'Vinyl Banner',
    'Mesh Banner',
    'Fabric Banner',
    'Backlit Film',
    'Scrim Vinyl',
    'Blockout Vinyl',
  ],
  formats: ['AI', 'PDF', 'TIFF', 'JPG', 'PSD', 'EPS'],
  colors: [
    'CMYK Full Color',
    'Spot Colors',
    'White Ink',
  ],
  gallery: [
    { src: '/images/services/banner-1.jpg', alt: 'Banner Sample 1' },
    { src: '/images/services/banner-2.jpg', alt: 'Banner Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the difference between vinyl and mesh?',
      answer: 'Vinyl is solid and waterproof, ideal for general use. Mesh has small holes that allow wind to pass through, making it perfect for large outdoor banners in windy areas.',
    },
    {
      question: 'How do I install my banner?',
      answer: 'Banners come with grommets (metal rings) every 2-3 feet for easy hanging with zip ties or rope. We can also add pole pockets for display on stands.',
    },
  ],
  relatedServices: [
    { title: 'Posters', href: '/page/services/posters', icon: <LucideImage size={20} /> },
    { title: 'Light Box', href: '/page/services/light-box', icon: <Lightbulb size={20} /> },
    { title: 'Vehicle Wraps', href: '/page/services/wraps', icon: <Car size={20} /> },
  ],
};

export default function BannersPage() {
  return <ServiceTemplate service={service} />;
}