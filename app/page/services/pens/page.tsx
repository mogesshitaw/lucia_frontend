// app/page/services/pens/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Coffee, FileText, Key, Pen } from 'lucide-react';

const service = {
  id: 'pens',
  title: 'Custom Pens',
  shortDescription: 'Promotional pens with your logo.',
  fullDescription: 'Classic promotional pens with your logo. Perfect for giveaways, trade shows, and everyday use. Various colors and styles available. Pens are one of the most cost-effective promotional items with the highest retention rate.',
  icon: <Pen size={32} />,
  gradient: 'from-yellow-500 to-orange-500',
  badge: 'Budget Friendly',
  features: [
    'Custom logo printing',
    'Multiple colors available',
    'Bulk pricing',
    'Fast delivery',
    'Various styles',
    'Refillable options',
    'Metal or plastic',
    'Stylus tip available',
  ],
  applications: [
    'Trade Shows',
    'Corporate Gifts',
    'Bank Giveaways',
    'Real Estate Agents',
    'Doctor Offices',
    'Schools',
    'Business Conferences',
    'Welcome Bags',
  ],
  process: [
    { step: 1, title: 'Select Pen', description: 'Choose style and color' },
    { step: 2, title: 'Submit Logo', description: 'Upload your artwork' },
    { step: 3, title: 'Proof', description: 'Approve digital mockup' },
    { step: 4, title: 'Print', description: 'Pad print or laser engrave' },
    { step: 5, title: 'Quality', description: 'Check each pen' },
    { step: 6, title: 'Package', description: 'Box or bulk pack' },
  ],
  specs: [
    { label: 'Print Area', value: '1.5" x 0.5"' },
    { label: 'Colors', value: '1-4 spot colors' },
    { label: 'Ink Type', value: 'Ballpoint, Gel' },
    { label: 'Materials', value: 'Plastic, Metal' },
  ],
  priceRange: 'ETB 10 - 50 per piece',
  minOrder: '100 pieces',
  turnaround: '5-7 days',
  materials: [
    'Plastic',
    'Metal',
    'Aluminum',
    'Brass',
    'Eco-friendly Materials',
    'Recycled Plastic',
  ],
  formats: ['AI', 'PNG', 'PDF', 'EPS', 'CDR'],
  colors: [
    'Black',
    'Blue',
    'Red',
    'Silver',
    'Gold',
    'Custom colors',
  ],
  gallery: [
    { src: '/images/services/pens-1.jpg', alt: 'Pen Sample 1' },
    { src: '/images/services/pens-2.jpg', alt: 'Pen Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the best pen for logo printing?',
      answer: 'Metal pens with a larger barrel provide the best printing surface and feel more premium. Plastic pens are most cost-effective for large giveaways.',
    },
    {
      question: 'How long does imprinting take?',
      answer: 'Standard imprinting takes 5-7 business days after proof approval. Rush service available.',
    },
  ],
  relatedServices: [
    { title: 'Keychains', href: '/page/services/keychains', icon: <Key size={20} /> },
    { title: 'Business Cards', href: '/page/services/business-cards', icon: <FileText size={20} /> },
    { title: 'Mugs', href: '/page/services/mugs', icon: <Coffee size={20} /> },
  ],
};

export default function PensPage() {
  return <ServiceTemplate service={service} />;
}