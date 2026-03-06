// app/page/services/totes/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Layers, Printer, Shirt, ShoppingBag } from 'lucide-react';

const service = {
  id: 'totes',
  title: 'Tote Bags',
  shortDescription: 'Eco-friendly custom tote bags for retail and promotions.',
  fullDescription: 'Eco-friendly custom tote bags perfect for retail, events, and promotional giveaways. Various materials and printing options available. Our bags are reusable, durable, and help reduce plastic waste while promoting your brand.',
  icon: <ShoppingBag size={32} />,
  gradient: 'from-green-500 to-emerald-500',
  badge: 'Eco-Friendly',
  features: [
    'Eco-friendly materials',
    'Reusable and durable',
    'Custom printing',
    'Bulk pricing',
    'Fast turnaround',
    'Multiple sizes',
    'Reinforced handles',
    'Foldable options',
  ],
  applications: [
    'Grocery Shopping',
    'Retail Stores',
    'Trade Shows',
    'Conference Swag',
    'Brand Giveaways',
    'Farmers Markets',
    'Bookstores',
    'Gift Shops',
  ],
  process: [
    { step: 1, title: 'Select Bag', description: 'Choose style and material' },
    { step: 2, title: 'Design', description: 'Submit your artwork' },
    { step: 3, title: 'Print Method', description: 'Screen print or DTF' },
    { step: 4, title: 'Proof', description: 'Approve design' },
    { step: 5, title: 'Production', description: 'Print and assemble' },
    { step: 6, title: 'Ship', description: 'Deliver to you' },
  ],
  specs: [
    { label: 'Materials', value: 'Cotton, Canvas, Non-woven' },
    { label: 'Sizes', value: '15"x15", 16"x18", Custom' },
    { label: 'Handle Types', value: 'Short, Long, Shoulder' },
    { label: 'Print Area', value: 'One or two sides' },
  ],
  priceRange: 'ETB 100 - 300',
  minOrder: '25 pieces',
  turnaround: '3-5 days',
  materials: [
    '100% Cotton',
    'Canvas',
    'Non-woven Polypropylene',
    'Jute',
    'Recycled PET',
    'Muslin',
  ],
  formats: ['AI', 'PNG', 'PDF', 'EPS', 'PSD'],
  colors: [
    'Natural',
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Custom colors available',
  ],
  gallery: [
    { src: '/images/services/totes-1.jpg', alt: 'Tote Bag Sample 1' },
    { src: '/images/services/totes-2.jpg', alt: 'Tote Bag Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the most eco-friendly option?',
      answer: 'Our 100% cotton and jute bags are biodegradable and most eco-friendly. Recycled PET bags are made from recycled plastic bottles.',
    },
    {
      question: 'Can I get a sample before bulk order?',
      answer: 'Yes! We offer sample service. Order 1-3 pieces to approve quality before placing your full order.',
    },
  ],
  relatedServices: [
    { title: 'T-Shirts', href: '/page/services/tshirt', icon: <Shirt size={20} /> },
    { title: 'Screen Printing', href: '/page/services/screen-printing', icon: <Layers size={20} /> },
    { title: 'DTF Printing', href: '/page/services/dtf', icon: <Printer size={20} /> },
  ],
};

export default function TotesPage() {
  return <ServiceTemplate service={service} />;
}