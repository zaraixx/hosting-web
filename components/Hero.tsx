import Link from 'next/link';

export default function Hero() {
  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '<100ms', label: 'Response' },
    { value: '24/7', label: 'Support' },
    { value: '5000+', label: 'Clients' },
  ];

  return (
    <section className="bg-white">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-[700px]">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-neutral-dark leading-tight mb-6">
            Professional hosting that scales with you
          </h1>
          <p className="text-lg md:text-xl text-neutral mb-8 leading-relaxed">
            From startups to enterprises, our hosting infrastructure delivers the performance and reliability your business deserves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-lg hover:bg-primary-light transition-colors text-center"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="inline-block text-primary font-semibold px-8 py-4 hover:text-primary-light transition-colors text-center"
            >
              Compare Plans →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-neutral-light border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
