// app/page/services/design/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { FileText, Palette, Tag } from 'lucide-react';

const service = {
  id: 'design',
  title: 'Graphic Design',
  shortDescription: 'Professional design services for all your needs.',
  fullDescription: 'Our professional designers help bring your vision to life. From logos to complete branding packages, we provide creative solutions that stand out. Whether you need a new logo, print-ready files, or complete brand identity, we\'ve got you covered.',
  icon: <Palette size={32} />,
  gradient: 'from-orange-500 to-red-500',
  badge: 'Creative',
  features: [
    'Logo design',
    'Brand identity packages',
    'Print-ready file preparation',
    'Revisions included',
    'Fast turnaround',
    'Commercial use rights',
    'Vector formats',
    'Social media graphics',
  ],
  applications: [
    'New Business Branding',
    'Logo Creation',
    'Marketing Materials',
    'Social Media Graphics',
    'Product Packaging',
    'Website Graphics',
    'Brochure Design',
    'Business Cards',
  ],
  process: [
    { step: 1, title: 'Brief', description: 'Discuss your needs and ideas' },
    { step: 2, title: 'Concepts', description: 'Receive initial design concepts' },
    { step: 3, title: 'Feedback', description: 'Share your feedback' },
    { step: 4, title: 'Revisions', description: 'Refine chosen concept' },
    { step: 5, title: 'Finalize', description: 'Prepare final files' },
    { step: 6, title: 'Delivery', description: 'Receive all file formats' },
  ],
  specs: [
    { label: 'File Types', value: 'AI, EPS, PDF, PNG, JPG' },
    { label: 'Revisions', value: '3 rounds included' },
    { label: 'Turnaround', value: '2-5 days' },
    { label: 'Formats', value: 'Vector & Raster' },
  ],
  priceRange: 'ETB 500 - 5000',
  minOrder: '1 project',
  turnaround: '2-5 days',
  materials: [
    'Logo Design',
    'Brand Guide',
    'Stationery Suite',
    'Social Media Kit',
    'Packaging Design',
    'Marketing Collateral',
  ],
  formats: ['AI', 'PSD', 'PDF', 'EPS', 'SVG', 'PNG', 'JPG'],
  colors: [
    'CMYK for Print',
    'RGB for Digital',
    'Pantone Colors',
    'Custom Color Palette',
  ],
  gallery: [
    { src: '/images/services/design-1.jpg', alt: 'Design Sample 1' },
    { src: '/images/services/design-2.jpg', alt: 'Design Sample 2' },
  ],
  faqs: [
    {
      question: 'What files will I receive?',
      answer: 'You\'ll receive all final files including vector (AI, EPS, PDF) for printing and raster (PNG, JPG) for web use, plus source files.',
    },
    {
      question: 'Do I own the rights to the design?',
      answer: 'Yes! Upon final payment, you receive full commercial rights to use the designs for your business.',
    },
  ],
  relatedServices: [
    { title: 'Business Cards', href: '/page/services/business-cards', icon: <FileText size={20} /> },
    { title: 'Flyers', href: '/page/services/flyers', icon: <FileText size={20} /> },
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
  ],
};

export default function DesignPage() {
  return <ServiceTemplate service={service} />;
}