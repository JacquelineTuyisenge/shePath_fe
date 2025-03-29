import React from 'react';

const PrivacyPolicy: React.FC = () => {

  return (
    <div className="container h-screen mt-10 mx-auto px-6 py-8">
      <h1 className="text-3xl py-5 font-semibold text-center text-light-primary dark:text-dark-primary mb-6">
        Privacy Policy
      </h1>
      <div className="bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text p-6 rounded-lg shadow-lg">
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            1. Information We Collect
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We collect personal information such as your name, email, and any other information you provide us directly, such as when you contact us.
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Additionally, we collect non-personal data like your IP address, browser type, and device details through cookies for website performance analysis.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            2. How We Use Your Information
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We use the information to provide educational resources, improve our services, communicate with you about updates, and respond to your inquiries.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            3. Sharing Your Information
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We will never sell your personal information. However, we may share data with trusted partners to help us operate our website and services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            4. Data Security
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We take the protection of your personal information seriously and employ security measures to prevent unauthorized access or data breaches.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            5. Your Rights
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You have the right to access, update, and delete your personal information. You can also opt out of receiving communications from us at any time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            6. Changes to This Privacy Policy
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We may update this Privacy Policy. Any changes will be posted on this page with the revised effective date.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            7. Contact Us
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            If you have any questions or concerns, please reach out to us at <a href="mailto:support@shepath.org" className="text-light-accent dark:text-dark-accent">support@shepath.org</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
