import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Helper function to convert our color names to actual hex colors
const getColorForPieChart = (color: string): string => {
  switch (color) {
    case "primary":
      return "#D6001C"; // Primary red for Tea House
    case "secondary":
      return "#8B4513"; // Brown
    case "accent":
      return "#AA8133"; // Golden brown
    case "blue-500":
      return "#3B82F6"; // Blue
    case "amber-500":
      return "#F8D56F"; // Amber/gold
    default:
      return "#D6001C";
  }
};

// Pie Chart Component
interface PieChartDistributionProps {
  data: Array<{
    name: string;
    percentage: number;
    color: string;
    tooltip?: string;
  }>;
}

// Custom label renderer for the pie chart
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, value, name } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      fontWeight="bold"
      textAnchor="middle" 
      dominantBaseline="central"
    >
      {`${value}%`}
    </text>
  );
};

const PieChartDistribution = ({ data }: PieChartDistributionProps) => {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.percentage,
    color: item.color
  }));

  return (
    <ResponsiveContainer width={300} height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getColorForPieChart(entry.color)}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `${value}%`}
          contentStyle={{ 
            backgroundColor: '#444444', 
            borderColor: '#D6001C',
            color: '#ffffff',
            fontWeight: 'bold',
            padding: '8px',
            borderRadius: '6px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default function Tokenomics() {
  const tokenDistribution = [
    { name: "Player Prize Pool", percentage: 50, color: "primary", tooltip: "Funds all direct winnings and jackpot payouts" },
    { name: "Giveaway & Rewards", percentage: 15, color: "secondary", tooltip: "Weekly/monthly drawings, bonus NFTs, reroll rewards" },
    { name: "Development Treasury", percentage: 15, color: "accent", tooltip: "Salaries, backend infrastructure, future feature building" },
    { name: "Virtuals Agent Wallet", percentage: 10, color: "blue-500", tooltip: "Funds other agents, on-chain actions, community tooling" },
    { name: "Marketing & Ops", percentage: 10, color: "amber-500", tooltip: "Paid promotions, Twitter spaces, influencers, Discord mods" }
  ];

  const tokenUtility = [
    {
      title: "Prize Draws",
      description: "Tokens are used to fund the daily, weekly, monthly, and yearly prize draws.",
      color: "primary",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Governance",
      description: "Token holders can vote on protocol upgrades and prize pool allocations.",
      color: "secondary",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Premium Features",
      description: "Access exclusive tea house perks and higher tiers of fortune tickets.",
      color: "accent",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Staking Rewards",
      description: "Earn passive income by staking tokens to support the tea house ecosystem.",
      color: "blue-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const tokenomicsDetails = [
    {
      title: "Initial Supply",
      value: "100,000,000 CTH",
      description: "The fixed total supply of CTH tokens"
    },
    {
      title: "Vesting Schedule",
      value: "4 Years",
      description: "For team and advisor token allocations"
    },
    {
      title: "Token Standard",
      value: "SPL Token",
      description: "Native Solana blockchain token standard"
    },
    {
      title: "Burn Mechanism",
      value: "Deflationary",
      description: "5% of prize pool fees are burned quarterly"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tokenomics</h1>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              Understanding the economic model behind the Crypto Tea House ecosystem.
              Our CTH token powers all aspects of the platform, from prize pools to governance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            {/* Token Distribution Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              variants={fadeIn}
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Distribution Breakdown
              </h3>
              
              <div className="bg-dark-700 rounded-xl p-6">
                <div className="flex justify-center mb-8">
                  <PieChartDistribution data={tokenDistribution} />
                </div>
                
                <div className="space-y-4">
                  {tokenDistribution.map((item, index) => (
                    <div key={index} className="flex items-center group relative cursor-pointer">
                      <div className={`w-4 h-4 mr-3 rounded-sm`} style={{ 
                        backgroundColor: getColorForPieChart(item.color) 
                      }}></div>
                      <div className="flex justify-between w-full">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-bold">{item.percentage}%</span>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark-600/95 text-white text-sm p-3 rounded-md shadow-lg top-0 left-full ml-2 z-10 w-64 border border-primary/20">
                        {item.tooltip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Token Utility Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={fadeIn}
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Token Utility <span className="text-sm font-normal text-amber-400/80">(coming soon!)</span>
              </h3>
              
              <div className="space-y-6">
                {tokenUtility.map((item, index) => (
                  <div key={index} className="bg-dark-700 rounded-xl p-6 flex items-start">
                    <div className={`bg-${item.color}/20 p-3 rounded-full mr-4`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-2">{item.title}</h4>
                      <p className="text-light-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Token Details Section */}
          <motion.div 
            className="mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Token Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tokenomicsDetails.map((detail, index) => (
                <motion.div 
                  key={index}
                  className="bg-dark-700 p-6 rounded-xl text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  variants={fadeIn}
                >
                  <h3 className="text-lg font-medium text-light-300 mb-2">{detail.title}</h3>
                  <p className="text-2xl font-bold mb-2">{detail.value}</p>
                  <p className="text-sm text-light-300">{detail.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTH Token Ecosystem */}
          <motion.div 
            className="bg-dark-800/50 rounded-2xl p-8 md:p-12 mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">CTH Token Ecosystem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Token Flow Diagram (Left Side) */}
              <div className="bg-dark-700 rounded-xl p-6 md:p-8 flex items-center justify-center">
                <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Central CTH Token */}
                  <circle cx="150" cy="150" r="50" fill="#D6001C" fillOpacity="0.2" />
                  <text x="150" y="155" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">CTH TOKEN</text>
                  
                  {/* Prize Pool Node */}
                  <circle cx="75" cy="75" r="30" fill="#D6001C" fillOpacity="0.2" />
                  <text x="75" y="75" fontSize="10" fill="white" textAnchor="middle">Prize Pool</text>
                  
                  {/* Governance Node */}
                  <circle cx="225" cy="75" r="30" fill="#8B4513" fillOpacity="0.2" />
                  <text x="225" y="75" fontSize="10" fill="white" textAnchor="middle">Governance</text>
                  
                  {/* Staking Node */}
                  <circle cx="75" cy="225" r="30" fill="#AA8133" fillOpacity="0.2" />
                  <text x="75" y="225" fontSize="10" fill="white" textAnchor="middle">Staking</text>
                  
                  {/* Features Node */}
                  <circle cx="225" cy="225" r="30" fill="#F8D56F" fillOpacity="0.2" />
                  <text x="225" y="225" fontSize="10" fill="white" textAnchor="middle">Premium Features</text>
                  
                  {/* Connecting Lines */}
                  <line x1="110" y1="110" x2="85" y2="85" stroke="#D6001C" strokeWidth="2" />
                  <line x1="190" y1="110" x2="215" y2="85" stroke="#8B4513" strokeWidth="2" />
                  <line x1="110" y1="190" x2="85" y2="215" stroke="#AA8133" strokeWidth="2" />
                  <line x1="190" y1="190" x2="215" y2="215" stroke="#F8D56F" strokeWidth="2" />
                </svg>
              </div>
              
              {/* Ecosystem Flow Details (Right Side) */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Token Circulation
                </h3>
                
                <div>
                  <h4 className="font-medium mb-2">Prize Funding</h4>
                  <p className="text-light-300 text-sm mb-4">
                    40% of the token supply is dedicated to the prize pool, ensuring sustainable rewards over time. As the ecosystem grows, the prize pool increases in value.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Community Governance</h4>
                  <p className="text-light-300 text-sm mb-4">
                    CTH token holders can participate in governance decisions including prize pool allocations, feature development priority, and protocol upgrades through a DAO structure.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Staking Mechanism</h4>
                  <p className="text-light-300 text-sm mb-4">
                    By staking CTH tokens, users earn passive yield and receive boosted odds in drawings. The staking APY adjusts based on total tokens staked, ensuring fair returns.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Deflationary Model</h4>
                  <p className="text-light-300 text-sm">
                    A portion of all prize pool fees is regularly burned, creating a deflationary pressure on the token supply and potentially increasing value over time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vesting Schedule */}
          <motion.div 
            className="mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Vesting Schedule</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-dark-700 rounded-xl">
                <thead>
                  <tr>
                    <th className="text-left p-4 border-b border-dark-600">Allocation</th>
                    <th className="text-left p-4 border-b border-dark-600">Amount</th>
                    <th className="text-left p-4 border-b border-dark-600">Vesting</th>
                    <th className="text-left p-4 border-b border-dark-600">Cliff</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-dark-600">Prize Pool</td>
                    <td className="p-4 border-b border-dark-600">40,000,000 CTH</td>
                    <td className="p-4 border-b border-dark-600">Linear, 4 years</td>
                    <td className="p-4 border-b border-dark-600">None</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-dark-600">Community Treasury</td>
                    <td className="p-4 border-b border-dark-600">25,000,000 CTH</td>
                    <td className="p-4 border-b border-dark-600">Linear, 5 years</td>
                    <td className="p-4 border-b border-dark-600">6 months</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-dark-600">Team & Development</td>
                    <td className="p-4 border-b border-dark-600">20,000,000 CTH</td>
                    <td className="p-4 border-b border-dark-600">Linear, 4 years</td>
                    <td className="p-4 border-b border-dark-600">1 year</td>
                  </tr>
                  <tr>
                    <td className="p-4">Marketing & Partnerships</td>
                    <td className="p-4">15,000,000 CTH</td>
                    <td className="p-4">Linear, 3 years</td>
                    <td className="p-4">3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Token Sale */}
          <motion.div 
            className="bg-dark-800/50 rounded-2xl p-8 md:p-12 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Token Sale Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Public Sale Details</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Token Price</span>
                    <span className="font-medium">$0.05 USD</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Sale Allocation</span>
                    <span className="font-medium">20,000,000 CTH (20%)</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Minimum Purchase</span>
                    <span className="font-medium">100 CTH</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Maximum Purchase</span>
                    <span className="font-medium">50,000 CTH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-300">Payment Accepted</span>
                    <span className="font-medium">SOL, USDC</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Schedule & Distribution</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Private Sale</span>
                    <span className="font-medium">June 15, 2023</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Public Sale</span>
                    <span className="font-medium">July 1, 2023</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Token Distribution</span>
                    <span className="font-medium">July 15, 2023</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-600 pb-2">
                    <span className="text-light-300">Exchange Listing</span>
                    <span className="font-medium">August 1, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-300">Initial Circulating Supply</span>
                    <span className="font-medium">30,000,000 CTH</span>
                  </div>
                </div>
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
            <h2 className="text-3xl font-bold mb-4">Join the CTH Token Economy</h2>
            <p className="text-xl text-light-300 max-w-2xl mx-auto mb-8">
              Be part of the Crypto Tea House ecosystem and participate in our unique fortune-based rewards platform.
            </p>
            <a 
              href="/" 
              className="inline-block bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-8 py-4 rounded-xl shadow-lg text-lg wallet-button"
            >
              Connect Wallet
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
