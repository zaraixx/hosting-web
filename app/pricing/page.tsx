import type { Metadata } from 'next';
import Link from 'next/link';
import PricingCard from '@/components/PricingCard';

export const metadata: Metadata = {
  title: 'Hosting Plans & Pricing - Lynx Hosting',
  description: 'Choose the perfect hosting plan for your needs. Affordable pricing with premium features starting at $9.99/month.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for personal sites',
      price: '$9.99',
      features: [
        '10 GB SSD Storage',
        '1 Website',
        'Free SSL Certificate',
        'Daily Backups',
        '24/7 Support',
      ],
      featured: false,
    },
    {
      name: 'Pro',
      description: 'Great for growing businesses',
      price: '$19.99',
      features: [
        '50 GB SSD Storage',
        '5 Websites',
        'Free SSL Certificate',
        'Daily Backups',
        'Priority Support',
        'Free Domain (1 year)',
      ],
      featured: true,
    },
    {
      name: 'Business',
      description: 'For high-traffic sites',
      price: '$39.99',
      features: [
        '200 GB SSD Storage',
        'Unlimited Websites',
        'Free SSL Certificate',
        'Daily Backups',
        'Priority Support',
        'Free Domain (1 year)',
        'Advanced Security',
      ],
      featured: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at your next billing cycle.",
    },
    {
      question: 'What is your refund policy?',
      answer: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied, contact us within 30 days for a full refund.",
    },
    {
      question: 'Do you provide technical support?',
      answer: 'Absolutely! Our expert support team is available 24/7 via email and live chat to assist with any questions or issues.',
    },
    {
      question: 'Is SSL included with all plans?',
      answer: 'Yes, all plans include free SSL certificates to keep your website secure.',
    },
    {
      question: 'Can I host multiple websites?',
      answer: 'It depends on your plan. Basic allows 1 website, Pro allows 5 websites, and Business allows unlimited websites.',
    },
    {
      question: 'What happens if I exceed my storage limit?',
      answer: "We'll notify you when you're approaching your limit. You can either upgrade to a larger plan or remove unnecessary files.",
    },
  ];

  return (
    <div className="bg-neutral-light min-h-screen">
      {/* Page Header */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-neutral">
            Select the perfect hosting solution for your needs
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                featured={plan.featured}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-neutral-dark text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-bold text-neutral-dark mb-2">
                  {faq.question}
                </h3>
                <p className="text-base text-neutral leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <p className="text-base text-neutral">
              Need help choosing?{' '}
              <Link href="/contact" className="text-primary hover:text-primary-light font-semibold underline">
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
