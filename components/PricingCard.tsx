import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  features: string[];
  featured?: boolean;
  compact?: boolean;
}

export default function PricingCard({
  name,
  description,
  price,
  features,
  featured = false,
  compact = false,
}: PricingCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border-2 p-8 ${
        compact ? 'py-6' : 'py-10'
      } flex flex-col ${
        featured
          ? 'border-primary shadow-lg transform md:scale-105 relative'
          : 'border-gray-300'
      }`}
    >
      {/* Featured Badge */}
      {featured && !compact && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Details */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-dark mb-2">{name}</h3>
        <p className="text-sm text-neutral mb-4">{description}</p>
        <div className="mb-2">
          <span className="text-5xl font-bold text-primary">{price}</span>
        </div>
        <p className="text-neutral text-base">per month</p>
      </div>

      {/* CTA Button */}
      <Link
        href="/contact"
        className={`w-full py-3 rounded-lg font-semibold text-center transition-colors mb-6 ${
          featured
            ? 'bg-primary text-white hover:bg-primary-light'
            : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
        }`}
      >
        Get Started
      </Link>

      {/* Features List */}
      <ul className="space-y-3 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <FaCheck className="text-success flex-shrink-0 mt-1" />
            <span className="text-neutral-dark">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
