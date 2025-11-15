import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Join thousands of satisfied customers hosting with Lynx
        </p>
        <Link
          href="/contact"
          className="inline-block bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
}
