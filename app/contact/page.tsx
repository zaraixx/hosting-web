import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Lynx Hosting',
  description: "Get in touch with our hosting experts. We're here to help with any questions about our services.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-neutral">
            Have questions? We&apos;re here to help.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
