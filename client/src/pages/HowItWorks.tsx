import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Link your Solana wallet to authenticate and begin your journey at the Crypto Tea House.",
      color: "primary",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dark-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M21 13V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4" />
          <path d="M3 9h18" />
          <path d="M15 17v-2a2 2 0 0 1 2-2h.5a.5.5 0 0 1 .5.5v3.5a2 2 0 0 1-2 2h-.5a.5.5 0 0 1-.5-.5V17Z" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Pull on Lucky Cat",
      description: "Interact with our Lucky Cat by pulling its arm to receive fortune tickets and potential crypto rewards.",
      color: "secondary",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dark-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9" />
          <path d="M16 9C16 6.8 14.2 5 12 5C9.8 5 8 6.8 8 9" />
          <path d="M4 22H20" />
          <path d="M4 22L6 12L7 8H8M20 22L18 12L17 8H16M9 12H15" />
          <circle cx="12" cy="5" r="2" />
          <path d="M14 12V17" />
          <path d="M10 12V17" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Collect & Win",
      description: "Accumulate tickets for daily, weekly, monthly, and yearly drawings to win exclusive rewards and SOL prizes.",
      color: "accent",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dark-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    },
  ];

  const benefits = [
    {
      title: "Transparent Rewards",
      description: "All prizes and draws are stored on-chain with verifiable transactions."
    },
    {
      title: "No Hidden Fees",
      description: "Connect your wallet and start pulling the cat's arm with zero costs."
    },
    {
      title: "Progressive Jackpots",
      description: "The longer you participate, the better your chances of winning large prizes."
    },
    {
      title: "Exclusive Fortune Insights",
      description: "Receive unique crypto predictions and market insights with each pull."
    }
  ];

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              Discover fortune and prosperity in the world of crypto with our unique luck-based experience.
              Here's your guide to participating in the Crypto Tea House.
            </p>
          </motion.div>

          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                className={`bg-dark-700 p-8 rounded-xl shadow-lg`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                variants={fadeIn}
              >
                <div className={`w-16 h-16 mb-6 bg-gradient-to-br from-${step.color} to-${step.color}/50 rounded-full flex items-center justify-center text-dark-900 font-bold text-2xl`}>
                  {step.icon || step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-light-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Explanation */}
          <motion.div 
            className="bg-dark-800/50 rounded-2xl p-8 md:p-12 mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Detailed Process</h2>
            
            <div className="space-y-12">
              {/* Connecting Wallet Section */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 bg-dark-700 rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M21 13V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4" />
                      <path d="M3 9h18" />
                      <path d="M15 17v-2a2 2 0 0 1 2-2h.5a.5.5 0 0 1 .5.5v3.5a2 2 0 0 1-2 2h-.5a.5.5 0 0 1-.5-.5V17Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Wallet Connection</h3>
                </div>
                <div className="w-full md:w-2/3">
                  <h4 className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">1. Secure Authentication</h4>
                  <p className="text-light-300 mb-4">
                    Crypto Tea House integrates with popular Solana wallets like Phantom and Solflare. Click the "Connect Wallet" button in the top-right corner to begin the connection process. Your public key is used for authentication, while your private keys remain secure in your wallet.
                  </p>
                  <p className="text-light-300">
                    Once connected, your wallet address is linked to your Tea House profile, tracking your tickets, activities, and any prizes you win. All transactions use Solana's high-performance blockchain for speed and minimal fees.
                  </p>
                </div>
              </div>
              
              {/* Lucky Cat Pull Section */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 bg-dark-700 rounded-xl p-6 text-center md:order-last">
                  <div className="w-20 h-20 bg-secondary/20 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9" />
                      <path d="M16 9C16 6.8 14.2 5 12 5C9.8 5 8 6.8 8 9" />
                      <path d="M4 22H20" />
                      <path d="M4 22L6 12L7 8H8M20 22L18 12L17 8H16M9 12H15" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M14 12V17" />
                      <path d="M10 12V17" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lucky Cat Interaction</h3>
                </div>
                <div className="w-full md:w-2/3">
                  <h4 className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">2. Fortune Mechanism</h4>
                  <p className="text-light-300 mb-4">
                    The Maneki-neko (Lucky Cat) is the centerpiece of Crypto Tea House. Visit your dashboard and choose from three pull options: Daily, Weekly, or Monthly. Each pull has a chance to reward you with either a small SOL prize or tickets for upcoming draws.
                  </p>
                  <p className="text-light-300">
                    Daily pulls have higher odds of winning but smaller prizes, while Monthly pulls have lower odds but larger potential rewards. The cat's arm animation triggers a provably fair random outcome, with all results transparently recorded on the blockchain.
                  </p>
                </div>
              </div>
              
              {/* Collect & Win Section */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 bg-dark-700 rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-accent/20 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Drawing System</h3>
                </div>
                <div className="w-full md:w-2/3">
                  <h4 className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">3. Reward Distribution</h4>
                  <p className="text-light-300 mb-4">
                    Accumulate tickets to increase your chances in the regular prize drawings. The system includes four draw tiers: Daily (every 24 hours), Weekly (every 7 days), Monthly (every 30 days), and the grand Yearly draw with the largest prizes.
                  </p>
                  <p className="text-light-300">
                    When you win, SOL prizes are automatically sent to your connected wallet address. All transactions include a verifiable signature that you can view in the Winners section or directly on Solana's blockchain explorer.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div 
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="bg-dark-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:border border-primary/30"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {benefit.title}
                  </h3>
                  <p className="text-light-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div 
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">How are winners selected?</h3>
                <p className="text-light-300">Winners are selected through a verifiable random function that ensures fair and transparent draws. Each ticket has an equal chance of winning.</p>
              </div>
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Are there any fees to participate?</h3>
                <p className="text-light-300">There are no entry fees to participate. You only need a Solana wallet with a minimal balance to cover transaction fees if you win prizes.</p>
              </div>
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">How many tickets can I earn daily?</h3>
                <p className="text-light-300">You can earn multiple tickets daily through regular pulls. Daily pulls have cooldown periods to ensure fair distribution among all participants.</p>
              </div>
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">When are the draws held?</h3>
                <p className="text-light-300">Draws occur at regular intervals - daily draws at 00:00 UTC, weekly draws every Sunday, monthly draws on the 1st of each month, and yearly draws on January 1st.</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Try Your Fortune?</h2>
            <p className="text-xl text-light-300 max-w-2xl mx-auto mb-8">
              Connect your wallet and start your journey at the Crypto Tea House today. Fortune awaits!
            </p>
            <a 
              href="/" 
              className="inline-block bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-8 py-4 rounded-xl shadow-lg text-lg wallet-button"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
