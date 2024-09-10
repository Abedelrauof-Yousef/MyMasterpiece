import React from 'react';
import './Pricing.css';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic budget tracking',
        'Up to 2 accounts',
        'Monthly financial report',
        'Email support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Basic',
      price: '$9.99',
      period: 'per month',
      features: [
        'Advanced budget tracking',
        'Up to 5 accounts',
        'Weekly financial reports',
        'Custom categories',
        'Priority email support'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      features: [
        'Full-feature budget tracking',
        'Unlimited accounts',
        'Real-time financial insights',
        'Investment tracking',
        'Dedicated account manager',
        'Phone and email support'
      ],
      cta: 'Start Free Trial',
      highlighted: false
    }
  ];

  return (
    <div className="pricing-pro">
      <header className="pricing-hero">
        <h1>Choose Your Financial Freedom</h1>
        <p>Select the plan that fits your needs and start your journey to financial success today.</p>
      </header>

      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`plan ${plan.highlighted ? 'highlighted' : ''}`}>
                <h2>{plan.name}</h2>
                <div className="price">
                  <span className="amount">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                <ul className="features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                <button className="cta-button">{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I upgrade or downgrade my plan?</h3>
              <p>Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a long-term contract?</h3>
              <p>No, all paid plans are billed monthly and you can cancel at any time.</p>
            </div>
            <div className="faq-item">
              <h3>Is my financial data secure?</h3>
              <p>Yes, we use bank-level encryption to ensure your data is always protected.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;