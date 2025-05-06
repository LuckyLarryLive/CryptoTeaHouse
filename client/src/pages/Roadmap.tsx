import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Roadmap() {
  const roadmapItems = [
    {
      phase: "Q2 2023",
      title: "Tea House Launch",
      completed: true,
      color: "primary",
      number: 1,
      items: [
        { text: "Platform architecture development", completed: true },
        { text: "Solana wallet integration", completed: true },
        { text: "Lucky Cat fortune mechanics", completed: true },
        { text: "Daily and weekly prize pools", completed: true }
      ]
    },
    {
      phase: "Q3 2023",
      title: "Token & Features",
      completed: true,
      color: "secondary",
      number: 2,
      items: [
        { text: "Token launch on Solana", completed: true },
        { text: "Community DAO formation", completed: true },
        { text: "Monthly prize pools", completed: true },
        { text: "Enhanced fortune mechanics", completed: true }
      ]
    },
    {
      phase: "Q4 2023",
      title: "Expansion",
      completed: false,
      color: "accent",
      number: 3,
      items: [
        { text: "Yearly grand prize pool launch", completed: false },
        { text: "Multi-chain support exploration", completed: false },
        { text: "Tea House NFT collections", completed: false },
        { text: "Strategic partnerships", completed: false }
      ]
    },
    {
      phase: "Q1 2024",
      title: "Ecosystem Growth",
      completed: false,
      color: "blue-500",
      number: 4,
      items: [
        { text: "Mobile app release", completed: false },
        { text: "Advanced staking mechanics", completed: false },
        { text: "Community-governed prize pools", completed: false },
        { text: "Global Tea House expansion", completed: false }
      ]
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Roadmap</h1>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              The journey ahead for the Crypto Tea House and our community.
              Follow our progress as we build the future of fortune-based rewards on Solana.
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 roadmap-line transform md:translate-x-[-50%]"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12 relative">
              {roadmapItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col md:flex-row items-start relative"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  variants={fadeIn}
                >
                  <div className={`md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right order-2 md:order-${index % 2 === 0 ? 1 : 2}`}>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {item.phase} - {item.title}
                    </h3>
                    <div className="bg-dark-800 rounded-xl p-6 shadow-lg">
                      <ul className="space-y-2 text-light-300">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex} className={`flex items-center md:justify-${index % 2 === 0 ? 'end' : 'start'}`}>
                            {index % 2 !== 0 && (
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${item.color} mr-2`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span>{subItem.text}</span>
                            {index % 2 === 0 && (
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${item.color} ml-2`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className={`absolute left-0 md:left-1/2 w-8 h-8 bg-${item.color} rounded-full transform -translate-y-1/2 md:translate-x-[-50%] z-10 flex items-center justify-center`}>
                    <span className="text-dark-900 font-bold">{item.number}</span>
                  </div>
                  
                  <div className={`md:w-1/2 md:pl-12 order-1 md:order-${index % 2 === 0 ? 2 : 1}`}></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Future Vision Section */}
          <motion.div 
            className="mt-24 bg-dark-800/50 rounded-2xl p-8 md:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Future Vision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  2024 - Cross-Chain Expansion
                </h3>
                <p className="text-light-300 mb-4">
                  By Q4 2024, we aim to extend our Tea House experience beyond Solana to include Ethereum, Binance Smart Chain, and emerging Layer 2 solutions. This multi-chain approach will allow us to tap into larger liquidity pools and provide a seamless experience for users regardless of their preferred blockchain.
                </p>
                <ul className="list-disc list-inside text-light-300 space-y-2">
                  <li>Ethereum bridge implementation</li>
                  <li>BSC integration for reduced fees</li>
                  <li>Layer 2 solutions for improved scalability</li>
                  <li>Cross-chain prize pools with enhanced rewards</li>
                </ul>
              </div>
              
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  2025 - Metaverse Tea Houses
                </h3>
                <p className="text-light-300 mb-4">
                  Our 2025 roadmap focuses on creating immersive virtual Tea House environments in popular metaverse platforms. Users will be able to visit virtual locations, interact with other crypto enthusiasts, and participate in exclusive fortune-telling ceremonies with enhanced visual experiences.
                </p>
                <ul className="list-disc list-inside text-light-300 space-y-2">
                  <li>Virtual Tea House locations</li>
                  <li>Social interaction between users</li>
                  <li>Metaverse-exclusive fortune mechanics</li>
                  <li>Virtual Tea House NFT land ownership</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Key Milestones */}
          <motion.div 
            className="mt-16 mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Key Milestones</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-dark-700 rounded-xl">
                <thead>
                  <tr>
                    <th className="text-left p-4 border-b border-dark-600">Date</th>
                    <th className="text-left p-4 border-b border-dark-600">Milestone</th>
                    <th className="text-left p-4 border-b border-dark-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-dark-600">May 2023</td>
                    <td className="p-4 border-b border-dark-600">Initial platform architecture complete</td>
                    <td className="p-4 border-b border-dark-600 text-primary">Completed</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-dark-600">June 2023</td>
                    <td className="p-4 border-b border-dark-600">Solana wallet integration & authentication</td>
                    <td className="p-4 border-b border-dark-600 text-primary">Completed</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-dark-600">July 2023</td>
                    <td className="p-4 border-b border-dark-600">TEA Token launch</td>
                    <td className="p-4 border-b border-dark-600 text-primary">Completed</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-dark-600">September 2023</td>
                    <td className="p-4 border-b border-dark-600">10,000 active users milestone</td>
                    <td className="p-4 border-b border-dark-600 text-primary">Completed</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-dark-600">November 2023</td>
                    <td className="p-4 border-b border-dark-600">First major exchange listing</td>
                    <td className="p-4 border-b border-dark-600 text-secondary">In Progress</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-dark-600">December 2023</td>
                    <td className="p-4 border-b border-dark-600">Yearly prize pool launch (100 SOL grand prize)</td>
                    <td className="p-4 border-b border-dark-600 text-accent">Upcoming</td>
                  </tr>
                  <tr>
                    <td className="p-4">February 2024</td>
                    <td className="p-4">Mobile app beta release</td>
                    <td className="p-4 text-accent">Upcoming</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Roadmap FAQ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">When will the mobile app be available?</h3>
                <p className="text-light-300">
                  We plan to launch the mobile app beta in Q1 2024, with the full release scheduled for Q2 2024. The app will be available for both iOS and Android devices.
                </p>
              </div>
              
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">How will the yearly prize pool work?</h3>
                <p className="text-light-300">
                  The yearly prize pool will launch in December 2023 with a 100 SOL grand prize. Users collect yearly tickets through monthly draws and special events. The first annual draw will take place on January 1, 2024.
                </p>
              </div>
              
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">What are the NFT collections mentioned in the roadmap?</h3>
                <p className="text-light-300">
                  Our NFT collections will feature unique Lucky Cat designs with different rarity tiers. Holding these NFTs will provide benefits like increased pull limits, exclusive rewards, and governance weight.
                </p>
              </div>
              
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Will there be a way to earn passive income?</h3>
                <p className="text-light-300">
                  Yes, our advanced staking mechanics will allow TEA token holders to earn passive income while also gaining benefits within the platform. This feature is planned for Q1 2024.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Community Involvement */}
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
            <p className="text-xl text-light-300 max-w-2xl mx-auto mb-8">
              Join our community and help shape the future of Crypto Tea House.
              Your input directly influences our roadmap and development priorities.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#" 
                className="bg-dark-700 hover:bg-dark-600 px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.032 10.032 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                </svg>
                <span>Twitter</span>
              </a>
              
              <a 
                href="#" 
                className="bg-dark-700 hover:bg-dark-600 px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192.96.384 1.512.516.756.204 1.656.36 2.676.36 1.2-.024 2.352-.204 3.48-.6.6-.204 1.26-.42 1.968-.816 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z"/>
                </svg>
                <span>Discord</span>
              </a>
              
              <a 
                href="#" 
                className="bg-dark-700 hover:bg-dark-600 px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.61 3.87 10.32 9.08 11.6.66.12.91-.29.91-.64v-2.34c-3.7.81-4.48-1.79-4.48-1.79-.6-1.52-1.48-1.93-1.48-1.93-1.21-.83.09-.81.09-.81 1.34.09 2.04 1.38 2.04 1.38 1.19 2.03 3.13 1.45 3.89 1.11.12-.86.47-1.45.85-1.79-2.95-.33-6.06-1.48-6.06-6.56 0-1.45.52-2.64 1.38-3.57-.14-.34-.6-1.69.13-3.52 0 0 1.12-.36 3.68 1.37 1.07-.3 2.21-.45 3.34-.45 1.13 0 2.27.15 3.34.45 2.56-1.73 3.68-1.37 3.68-1.37.73 1.83.27 3.18.13 3.52.86.93 1.38 2.12 1.38 3.57 0 5.1-3.11 6.23-6.08 6.55.48.41.91 1.23.91 2.47v3.67c0 .35.25.76.92.63C20.13 22.32 24 17.61 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
              
              <a 
                href="#" 
                className="bg-dark-700 hover:bg-dark-600 px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.218 19l-1.782-1.75 5.25-5.25-5.25-5.25 1.782-1.75 7 7-7 7z"/>
                </svg>
                <span>Telegram</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
