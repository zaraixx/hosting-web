'use client';

import { useState, FormEvent, ChangeEvent, FocusEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validateSubject = (subject: string): string | undefined => {
    if (subject.trim().length < 3) {
      return 'Subject must be at least 3 characters';
    }
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (message.trim().length < 10) {
      return 'Message must be at least 10 characters';
    }
    return undefined;
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'subject':
        return validateSubject(value);
      case 'message':
        return validateMessage(value);
      default:
        return undefined;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      subject: validateSubject(formData.subject),
      message: validateMessage(formData.message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    // Check if form is valid
    const hasErrors = Object.values(newErrors).some((error) => error !== undefined);

    if (!hasErrors) {
      // TODO: Wire up to email service or API endpoint
      console.log('Form submitted:', formData);

      // Show success message
      setShowSuccess(true);

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setTouched({});
      setErrors({});

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.subject.trim().length >= 3 &&
      formData.message.trim().length >= 10
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success rounded-lg">
          <p className="text-success font-semibold text-center">
            Thank you! We&apos;ll get back to you soon.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-neutral-dark mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your name"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.name && errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary'
            }`}
            required
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-neutral-dark mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.email && errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary'
            }`}
            required
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-bold text-neutral-dark mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="How can we help?"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.subject && errors.subject
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary'
            }`}
            required
          />
          {touched.subject && errors.subject && (
            <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-bold text-neutral-dark mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell us more..."
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
              touched.message && errors.message
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary'
            }`}
            required
          />
          {touched.message && errors.message && (
            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full py-4 rounded-lg font-bold text-base transition-colors ${
            isFormValid()
              ? 'bg-primary text-white hover:bg-primary-light cursor-pointer'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
