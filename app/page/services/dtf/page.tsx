// app/page/services/dtf/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Printer, Shirt, Sparkles } from 'lucide-react';

const service = {
  id: 'dtf-printing',
  title: 'DTF Printing',
  shortDescription: 'Direct to Film printing for vibrant, durable designs on any fabric.',
  fullDescription: 'DTF (Direct to Film) printing is our most popular service, offering vibrant colors and exceptional durability on any fabric type. Perfect for custom apparel, sportswear, and promotional items. The process involves printing your design onto a special film, applying adhesive powder, and then heat pressing it onto the fabric. This method works on cotton, polyester, blends, nylon, leather, and more.',
  icon: <Printer size={32} />,
  gradient: 'from-purple-500 to-pink-500',
  badge: 'Most Popular',
  features: [
    'Any fabric type - cotton, polyester, blends, nylon, leather',
    'Vibrant colors with high opacity',
    'Wash durable - 50+ washes',
    'No minimum order quantity',
    'Fast turnaround - 2-3 days',
    'High resolution up to 1440 DPI',
    'Soft hand feel - no heavy layer',
    'Stretchable without cracking',
  ],
  applications: [
    'T-Shirts & Apparel',
    'Sportswear & Jerseys',
    'Work Uniforms',
    'Promotional Items',
    'Bags & Totes',
    'Hoodies & Sweatshirts',
    'Baby Clothes',
    'Pet Apparel',
  ],
  process: [
    { step: 1, title: 'Upload Design', description: 'Upload your artwork in PNG, AI, or PSD format' },
    { step: 2, title: 'Color Separation', description: 'We prepare your design for DTF printing' },
    { step: 3, title: 'Print on Film', description: 'Design printed on special DTF film' },
    { step: 4, title: 'Apply Adhesive', description: 'Hot melt adhesive powder applied' },
    { step: 5, title: 'Heat Press', description: 'Design transferred to your garment' },
    { step: 6, title: 'Quality Check', description: 'Final inspection and packaging' },
  ],
  specs: [
    { label: 'Max Print Size', value: '16" x 20"' },
    { label: 'Resolution', value: '1440 DPI' },
    { label: 'Color Mode', value: 'CMYK + White' },
    { label: 'Washability', value: '50+ washes' },
  ],
  priceRange: 'ETB 150 - 500',
  minOrder: '1 piece',
  turnaround: '2-3 days',
  materials: [
    'Cotton',
    'Polyester',
    'Cotton-Polyester Blends',
    'Nylon',
    'Leather',
    'Denim',
    'Canvas',
    'Rayon',
  ],
  formats: ['PNG', 'AI', 'PSD', 'PDF', 'EPS', 'TIFF'],
  colors: [
    'Full Color CMYK',
    'Spot Colors',
    'White Underbase',
    'Neon Colors',
    'Metallic Options',
  ],
  gallery: [
    { src: '/images/services/dtf-1.jpg', alt: 'DTF Print Sample 1' },
    { src: '/images/services/dtf-2.jpg', alt: 'DTF Print Sample 2' },
  ],
  faqs: [
    {
      question: 'What is DTF printing?',
      answer: 'DTF (Direct to Film) is a printing method where your design is printed onto a special film, coated with adhesive, and then heat pressed onto fabric. It works on almost any material and produces vibrant, durable prints.',
    },
    {
      question: 'How durable are DTF prints?',
      answer: 'DTF prints are extremely durable and can withstand 50+ washes without fading or cracking when properly cared for.',
    },
    {
      question: 'Can you print on dark colored garments?',
      answer: 'Yes! DTF printing works perfectly on any color, including black. We use a white underbase to ensure vibrant colors on dark fabrics.',
    },
  ],
  relatedServices: [
    { title: 'T-Shirt Printing', href: '/page/services/tshirt', icon: <Shirt size={20} /> },
    { title: 'Screen Printing', href: '/page/services/screen-printing', icon: <Printer size={20} /> },
    { title: 'Embroidery', href: '/page/services/embroidery', icon: <Sparkles size={20} /> },
  ],
};

export default function DTFPage() {
  return <ServiceTemplate service={service} />;
}