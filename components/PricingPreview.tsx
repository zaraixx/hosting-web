import Link from 'next/link';
import PricingCard from './PricingCard';

export default function PricingPreview() {
  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for personal sites',
      price: '$9.99',
      features: [
        '10 GB SSD Storage',
        '1 Website',
        'Free SSL Certificate',
        '24/7 Support',
      ],
    },
    {
      name: 'Pro',
      description: 'Great for growing businesses',
      price: '$19.99',
      features: [
        '50 GB SSD Storage',
        '5 Websites',
        'Free SSL Certificate',
        'Priority Support',
      ],
    },
    {
      name: 'Business',
      description: 'For high-traffic sites',
      price: '$39.99',
      features: [
        '200 GB SSD Storage',
        'Unlimited Websites',
        'Free SSL Certificate',
        'Advanced Security',
      ],
    },
  ];

  return (
    <section className="bg-neutral-light py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-4xl font-bold text-neutral-dark text-center mb-12">
          Choose Your Plan
        </h2>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              compact={true}
            />
          ))}
        </div>

        {/* View All Plans CTA */}
        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-colors"
          >
            View All Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
