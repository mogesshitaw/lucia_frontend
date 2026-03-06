// app/page/services/keychains/page.tsx
import ServiceTemplate from '../serviceTemplate';
import { Flame, Key, Pen, Tag ,} from 'lucide-react';

const service = {
  id: 'keychains',
  title: 'Custom Keychains',
  shortDescription: 'Custom keychains for lasting impressions.',
  fullDescription: 'Custom keychains that keep your brand in sight every day. Various materials and designs available for promotional use. Perfect for giveaways, souvenirs, and corporate gifts that people will actually keep and use.',
  icon: <Key size={32} />,
  gradient: 'from-purple-500 to-pink-500',
  badge: 'Popular',
  features: [
    'Custom shapes and designs',
    'Multiple materials',
    'Bulk pricing',
    'Fast turnaround',
    'Durable construction',
    'Great giveaways',
    'Photo quality prints',
    'Split ring included',
  ],
  applications: [
    'Corporate Gifts',
    'Event Souvenirs',
    'Trade Show Giveaways',
    'Wedding Favors',
    'Brand Merchandise',
    'Fundraising',
    'Tourist Souvenirs',
    'Welcome Bags',
  ],
  process: [
    { step: 1, title: 'Design', description: 'Create or upload artwork' },
    { step: 2, title: 'Material', description: 'Choose material type' },
    { step: 3, title: 'Size/Shape', description: 'Select dimensions' },
    { step: 4, title: 'Proof', description: 'Approve design' },
    { step: 5, title: 'Production', description: 'Print, cut, assemble' },
    { step: 6, title: 'Package', description: 'Bag or box' },
  ],
  specs: [
    { label: 'Materials', value: 'Acrylic, Metal, Leather' },
    { label: 'Sizes', value: '1-4 inches' },
    { label: 'Print Method', value: 'UV Print, Laser Engrave' },
    { label: 'Attachment', value: 'Split ring, Ball chain' },
  ],
  priceRange: 'ETB 50 - 300 per piece',
  minOrder: '50 pieces',
  turnaround: '4-6 days',
  materials: [
    'Acrylic',
    'Stainless Steel',
    'Brass',
    'Leather',
    'Wood',
    'Silicone',
    'Plastic',
    'Epoxy Resin',
  ],
  formats: ['AI', 'PNG', 'PDF', 'EPS', 'SVG'],
  colors: [
    'Full Color Print',
    'Single Color',
    'Metal Finish',
    'Leather Natural',
    'Glow in Dark',
  ],
  gallery: [
    { src: '/images/services/keychains-1.jpg', alt: 'Keychain Sample 1' },
    { src: '/images/services/keychains-2.jpg', alt: 'Keychain Sample 2' },
  ],
  faqs: [
    {
      question: 'What is the most popular keychain material?',
      answer: 'Acrylic is most popular for full-color printed designs. Metal is preferred for engraved, premium feel. Leather offers a classic, sophisticated look.',
    },
    {
      question: 'Can you make 3D or shaped keychains?',
      answer: 'Yes! We can create custom shapes and even 3D molded keychains for unique promotional items.',
    },
  ],
  relatedServices: [
    { title: 'Pens', href: '/page/services/pens', icon: <Pen size={20} /> },
    { title: 'Stickers', href: '/page/services/stickers', icon: <Tag size={20} /> },
    { title: 'Engraving', href: '/page/services/engraving', icon: <Flame size={20} /> },
  ],
};

export default function KeychainsPage() {
  return <ServiceTemplate service={service} />;
}