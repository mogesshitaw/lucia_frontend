// app/page/services/tshirt/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Printer, Shirt } from 'lucide-react';

const service = {
  id: 'tshirt-printing',
  title: 'T-Shirt Printing',
  shortDescription: 'Custom t-shirts using DTF, screen printing, and DTG methods.',
  fullDescription: 'Premium custom t-shirt printing for any occasion. We offer multiple printing methods including DTF for full color, screen printing for bulk orders, and DTG for detailed designs. Whether you need one shirt or thousands, we have the perfect solution for your project.',
  icon: <Shirt size={32} />,
  gradient: 'from-red-500 to-pink-500',
  badge: 'Best Seller',
  features: [
    'Multiple printing methods',
    'All colors available',
    'Bulk discounts up to 40%',
    'Design assistance included',
    'Fast delivery',
    'Quality guarantee',
    'Eco-friendly options',
    'Size range XS-5XL',
  ],
  applications: [
    'Event T-Shirts',
    'Team Uniforms',
    'Corporate Branding',
    'Family Reunions',
    'School Spirit Wear',
    'Bachelorette Parties',
    'Fundraising Events',
    'Sports Teams',
  ],
  process: [
    { step: 1, title: 'Choose Style', description: 'Select t-shirt style, color, and quantity' },
    { step: 2, title: 'Upload Design', description: 'Submit your artwork or describe your idea' },
    { step: 3, title: 'Get Proof', description: 'Receive digital proof for approval' },
    { step: 4, title: 'Production', description: 'Your shirts are printed with care' },
    { step: 5, title: 'Quality Check', description: 'Each shirt is inspected' },
    { step: 6, title: 'Delivery', description: 'Shipped to your door' },
  ],
  specs: [
    { label: 'Print Methods', value: 'DTF, Screen Print, DTG' },
    { label: 'Max Colors', value: 'Full CMYK' },
    { label: 'Fabric Types', value: 'Cotton, Polyester, Blends' },
    { label: 'Size Range', value: 'XS to 5XL' },
  ],
  priceRange: 'ETB 200 - 600',
  minOrder: '1 piece',
  turnaround: '2-4 days',
  materials: [
    '100% Cotton',
    '100% Polyester',
    'Tri-Blend',
    'Ring-spun Cotton',
    'Organic Cotton',
    'Performance Fabric',
  ],
  formats: ['AI', 'PNG', 'PDF', 'PSD', 'JPG', 'EPS'],
  colors: [
    'White',
    'Black',
    'Navy',
    'Red',
    'Royal Blue',
    'Forest Green',
    'Maroon',
    'Gray',
  ],
  gallery: [
    { src: '/images/services/tshirt-1.jpg', alt: 'T-Shirt Sample 1' },
    { src: '/images/services/tshirt-2.jpg', alt: 'T-Shirt Sample 2' },
  ],
  faqs: [
    {
      question: 'What t-shirt brands do you use?',
      answer: 'We use premium brands including Gildan, Bella+Canvas, Hanes, and Anvil. We can also print on customer-supplied shirts.',
    },
    {
      question: 'What is the best printing method for my design?',
      answer: 'For full-color photos and complex designs, DTF is best. For simple designs in bulk, screen printing is most economical. For small quantities, DTG works well.',
    },
  ],
  relatedServices: [
    { title: 'DTF Printing', href: '/page/services/dtf', icon: <Printer size={20} /> },
    { title: 'Hoodies', href: '/page/services/hoodies', icon: <Shirt size={20} /> },
    { title: 'Hats', href: '/page/services/hats', icon: <Shirt size={20} /> },
  ],
};

export default function TShirtPage() {
  return <ServiceTemplate service={service} />;
}