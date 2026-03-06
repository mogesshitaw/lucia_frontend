// app/page/services/business-cards/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Camera, FileText, Tag } from 'lucide-react';

const service = {
  id: 'business-cards',
  title: 'Business Cards',
  shortDescription: 'Premium business cards with various finishes.',
  fullDescription: 'Make a lasting impression with our premium business cards. Choose from various paper stocks, finishes, and special effects like foil stamping and embossing. Your business card is often the first physical representation of your brand - make it count.',
  icon: <FileText size={32} />,
  gradient: 'from-gray-500 to-gray-700',
  badge: 'Essential',
  features: [
    'Premium paper stocks',
    'Foil stamping options',
    'Spot UV coating',
    'Embossing and debossing',
    'Rounded corners',
    'Matching sets',
    'Thick card stock',
    'Matte or gloss finish',
  ],
  applications: [
    'Corporate Professionals',
    'Small Business Owners',
    'Freelancers',
    'Real Estate Agents',
    'Artists & Creatives',
    'Networkers',
    'Event Planners',
    'Consultants',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create or upload design' },
    { step: 2, title: 'Paper Select', description: 'Choose paper stock' },
    { step: 3, title: 'Finishes', description: 'Select special effects' },
    { step: 4, title: 'Proof', description: 'Approve digital proof' },
    { step: 5, title: 'Print', description: 'Professional printing' },
    { step: 6, title: 'Cut', description: 'Precision cutting' },
  ],
  specs: [
    { label: 'Standard Size', value: '85mm x 55mm' },
    { label: 'Paper Weight', value: '300-400gsm' },
    { label: 'Finishes', value: 'Matte, Gloss, Silk' },
    { label: 'Special Effects', value: 'Foil, UV, Emboss' },
  ],
  priceRange: 'ETB 250 - 800 per 100',
  minOrder: '100 pieces',
  turnaround: '2-3 days',
  materials: [
    'Matte Cardstock',
    'Gloss Cardstock',
    'Recycled Paper',
    'Kraft Paper',
    'Plastic Cards',
    'Soft-touch Laminate',
  ],
  formats: ['AI', 'PDF', 'PSD', 'INDD', 'EPS'],
  colors: [
    'CMYK Full Color',
    'Spot Colors',
    'Gold Foil',
    'Silver Foil',
    'Rose Gold Foil',
    'Holographic',
  ],
  gallery: [
    { src: '/images/services/cards-1.jpg', alt: 'Business Card Sample 1' },
    { src: '/images/services/cards-2.jpg', alt: 'Business Card Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the best paper weight for business cards?',
      answer: 'We recommend 350-400gsm for a premium, sturdy feel. 300gsm is also popular and slightly more flexible.',
    },
    {
      question: 'How long does foil stamping take?',
      answer: 'Foil stamping adds 1-2 days to production time but creates an impressive, luxurious finish.',
    },
  ],
  relatedServices: [
    { title: 'Flyers', href: '/page/services/flyers', icon: <FileText size={20} /> },
    { title: 'Posters', href: '/page/services/posters', icon: <Camera size={20} /> },
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
  ],
};

export default function BusinessCardsPage() {
  return <ServiceTemplate service={service} />;
}