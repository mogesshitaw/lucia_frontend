// app/page/services/posters/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Camera, FileText, Megaphone } from 'lucide-react';

const service = {
  id: 'posters',
  title: 'Posters',
  shortDescription: 'High-quality posters for events and advertising.',
  fullDescription: 'Vibrant posters for events, promotions, and advertising. Various sizes and paper options available for indoor and outdoor use. Perfect for concerts, movies, exhibitions, and retail displays.',
  icon: <Camera size={32} />,
  gradient: 'from-purple-500 to-pink-500',
  badge: 'Popular',
  features: [
    'Multiple sizes available',
    'High resolution up to 2400 DPI',
    'UV resistant options',
    'Fast printing',
    'Bulk orders welcome',
    'Lamination available',
    'Matte or gloss finish',
    'Mounting options',
  ],
  applications: [
    'Movie Posters',
    'Concert Announcements',
    'Exhibition Displays',
    'Retail Advertising',
    'Educational Charts',
    'Art Prints',
    'Event Promotion',
    'Wall Decor',
  ],
  process: [
    { step: 1, title: 'Upload Design', description: 'Submit high-resolution file' },
    { step: 2, title: 'Size Select', description: 'Choose dimensions' },
    { step: 3, title: 'Paper Choice', description: 'Select paper type' },
    { step: 4, title: 'Proof', description: 'Review digital proof' },
    { step: 5, title: 'Print', description: 'Large format printing' },
    { step: 6, title: 'Finish', description: 'Trim and package' },
  ],
  specs: [
    { label: 'Sizes', value: 'A3, A2, A1, A0, Custom' },
    { label: 'Paper Weight', value: '150-300gsm' },
    { label: 'Resolution', value: '300 DPI minimum' },
    { label: 'Finishes', value: 'Matte, Gloss, Satin' },
  ],
  priceRange: 'ETB 150 - 1500',
  minOrder: '1 piece',
  turnaround: '1-2 days',
  materials: [
    'Gloss Paper',
    'Matte Paper',
    'Photo Paper',
    'Canvas',
    'Vinyl',
    'Cardstock',
  ],
  formats: ['PDF', 'TIFF', 'JPG', 'PNG', 'PSD', 'AI'],
  colors: [
    'CMYK Full Color',
    'Black & White',
    'Sepia',
  ],
  gallery: [
    { src: '/images/services/posters-1.jpg', alt: 'Poster Sample 1' },
    { src: '/images/services/posters-2.jpg', alt: 'Poster Sample 2' },
  ],
  faqs: [
    {
      question: 'What resolution do I need for a poster?',
      answer: 'For best results, provide files at 300 DPI at final size. Large format posters can sometimes use 150 DPI if viewed from a distance.',
    },
    {
      question: 'Can you print one poster or do I need bulk?',
      answer: 'We print single posters as well as bulk orders. No minimum quantity!',
    },
  ],
  relatedServices: [
    { title: 'Banners', href: '/page/services/banners', icon: <Megaphone size={20} /> },
    { title: 'Flyers', href: '/page/services/flyers', icon: <FileText size={20} /> },
    { title: 'Business Cards', href: '/page/services/business-cards', icon: <FileText size={20} /> },
  ],
};

export default function PostersPage() {
  return <ServiceTemplate service={service} />;
}