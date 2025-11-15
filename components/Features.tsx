import { FaServer, FaLock, FaCloud, FaHeadset, FaBolt, FaThLarge } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: FaServer,
      title: '99.9% Uptime Guarantee',
      description: 'Your website stays online with our guaranteed uptime and reliable infrastructure',
    },
    {
      icon: FaLock,
      title: 'Free SSL Certificates',
      description: 'Secure your site with free SSL certificates included with every plan',
    },
    {
      icon: FaCloud,
      title: 'Daily Automated Backups',
      description: 'Never lose your data with daily automated backups and easy restoration',
    },
    {
      icon: FaHeadset,
      title: '24/7 Expert Support',
      description: 'Get help anytime with our round-the-clock technical support team',
    },
    {
      icon: FaBolt,
      title: 'Lightning-Fast SSD Storage',
      description: 'Experience blazing speed with premium SSD storage on all servers',
    },
    {
      icon: FaThLarge,
      title: 'Easy Control Panel',
      description: 'Manage your hosting effortlessly with our intuitive control panel',
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
                <feature.icon className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
