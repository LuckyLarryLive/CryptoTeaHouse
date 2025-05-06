import { Link } from "wouter";
import { useEffect } from "react";

export default function Legal() {
  const scrollToSection = (hash: string) => {
    const id = hash.substring(1);
    const element = document.getElementById(id);
    
    if (element) {
      // Add a small delay to ensure the page has rendered
      setTimeout(() => {
        // Calculate the position to scroll to, accounting for the header height
        const headerOffset = 80; // Adjust this value based on your header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }, 100);
    }
  };

  useEffect(() => {
    // Handle initial load with hash
    if (window.location.hash) {
      scrollToSection(window.location.hash);
    }

    // Handle hash changes while on the page
    const handleHashChange = () => {
      if (window.location.hash) {
        scrollToSection(window.location.hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-4xl">
      <div className="space-y-12">
        {/* Terms and Agreements Section */}
        <section id="terms" className="scroll-mt-20">
          <h1 className="text-4xl font-bold mb-6">Terms and Agreements</h1>
          <div className="text-sm text-light-300 mb-8">
            <p>Effective Date: 5/5/2025</p>
            <p>Last Updated: 5/5/2025</p>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="mb-6">
              Welcome to Crypto Tea House (CryptoTeaHouse.com) (the "Site" or "Service"). By accessing or using this Site, you agree to comply with and be bound by the following Terms and Agreements. If you do not agree with these terms, you may not use the Site.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Eligibility</h2>
            <p>You must be at least 18 years old to use this Site. By accessing or using this Site, you represent and warrant that:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>You are 18 years of age or older;</li>
              <li>You have the legal capacity to enter into these Terms and Agreements;</li>
              <li>You are not located in a jurisdiction where participation in promotional raffles, chance-based digital games, or crypto-based reward systems is prohibited.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of the Service</h2>
            <p>The Site offers users:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Daily, weekly, monthly, and yearly raffles;</li>
              <li>Digital fortunes and entertainment content;</li>
              <li>Optional paid "pulls" for chances at enhanced rewards;</li>
              <li>NFTs and digital collectibles which may or may not hold market value.</li>
            </ul>
            <p>Each user is provided with an opportunity for a "Free Entry" to applicable raffles upon logging into CryptoTeaHouse.com each day and accepting these Terms and Agreements. Optional purchases allow for additional "pulls" that may yield bonus entries or digital prizes.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Paid Features and Rewards</h2>
            <p>When purchasing a pull:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>You may receive bonus raffle entries or a digital asset (e.g., NFT).</li>
              <li>Odds of outcomes are disclosed and transparent.</li>
              <li>There are no guaranteed returns or monetary rewards.</li>
            </ul>
            <p>Paid features are provided as-is for entertainment purposes only and are not considered investments, wagers, or financial instruments.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. NFTs and Blockchain Assets</h2>
            <p>Some rewards may be issued as non-fungible tokens (NFTs). These:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Are stored on a supported blockchain network;</li>
              <li>May have no monetary value and are not redeemable for guaranteed cash or crypto;</li>
              <li>Are transferable at your own discretion, with associated gas/network fees.</li>
            </ul>
            <p>NFT utility, value, or future functionality is not guaranteed.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. No Purchase Necessary</h2>
            <p>A free entry method is available for participation in applicable raffles. Users will be prompted with an opportunity for a "Free Entry" upon logging into CryptoTeaHouse.com each day and accepting these Terms and Agreements. No separate instructions are required for this daily free entry.</p>
            <p>Purchasing a "pull" or digital item does not improve your odds of winning a raffle prize, but may increase the number of entries you receive.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Jurisdictional Restrictions</h2>
            <p>The Service is not available to residents of jurisdictions where such digital promotions, raffles, or games are restricted or prohibited. This includes, but is not limited to, residents of:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Afghanistan</li>
              <li>Belarus</li>
              <li>China (People's Republic of)</li>
              <li>Cuba</li>
              <li>Iran</li>
              <li>Iraq</li>
              <li>North Korea (Democratic People's Republic of Korea)</li>
              <li>Russia</li>
              <li>Sudan</li>
              <li>Syria</li>
              <li>Venezuela</li>
              <li>Yemen</li>
              <li>The regions of Crimea, Donetsk, and Luhansk in Ukraine</li>
              <li>U.S. States such as Washington, Hawaii, and any other state or territory where such activities are prohibited</li>
            </ul>
            <p>This list is not exhaustive. By using the Site, you affirm that your jurisdiction permits participation in such services, and you are solely responsible for ensuring compliance with all applicable local laws. Crypto Tea House reserves the right to restrict access from any jurisdiction at its sole discretion.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Use the Site for unlawful purposes;</li>
              <li>Use bots, scripts, or automation to interact with the Site in a manner not expressly permitted;</li>
              <li>Attempt to interfere with or manipulate raffle outcomes;</li>
              <li>Misrepresent your age, location, or identity.</li>
            </ul>
            <p>Violations may result in account suspension or bans.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimers</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>This Site is for entertainment purposes only.</li>
              <li>The platform makes no guarantees of value, returns, or future availability of any rewards or features.</li>
              <li>We do not offer financial advice, investment services, or gambling products as defined by applicable law.</li>
              <li>All use is at your own risk.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Crypto Tea House shall not be liable for any direct, indirect, incidental, or consequential damages resulting from:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Use of or inability to use the Site;</li>
              <li>Loss of data, NFTs, or digital assets;</li>
              <li>Unauthorized access to your wallet or account.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Privacy and Data Use</h2>
            <p>We collect minimal data necessary to operate the Site, including your wallet address, username (if applicable), and interaction data. We do not collect personal names, emails (unless voluntarily provided for support), or payment information beyond what is needed to process crypto-based transactions visible on the public blockchain.</p>
            <p>By using the Site, you consent to this limited data use as further detailed in our Privacy Policy.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Modifications to Terms and Agreements</h2>
            <p>We may update these Terms and Agreements from time to time. Continued use of the Site after changes constitutes your acceptance of the new Terms and Agreements. The "Last Updated" date will be posted at the top of this page.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact</h2>
            <p>For questions or concerns about these Terms and Agreements, contact us at:</p>
            <p>LuckyLarry7128@gmail.com</p>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section id="privacy" className="scroll-mt-20">
          <h1 id="privacy" className="text-4xl font-bold mt-16 mb-6">Privacy Policy</h1>
          <div className="text-sm text-light-300 mb-8">
            <p>Effective Date: 5/5/2025</p>
            <p>Last Updated: 5/5/2025</p>
          </div>

          <p className="mb-6">
            Welcome to Crypto Tea House (CryptoTeaHouse.com) (the "Site," "Service," "we," "us," or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website CryptoTeaHouse.com and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-4">Blockchain and Wallet Information:</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Wallet Address: We collect your public cryptocurrency wallet address when you connect it to our Site to participate in raffles, make optional purchases, or receive NFT rewards. This is necessary to identify you on the blockchain and deliver any digital assets.</li>
            <li>Transaction Data: Details of transactions you conduct through the Site, such as NFT transfers or "pull" purchases, are recorded on the public blockchain. This information is inherently public and not controlled by us once on the blockchain.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-4">Usage and Interaction Data:</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Log and Device Information: Like most websites, we may automatically collect information when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site. This helps us understand how users interact with our Service, maintain security, and improve our offerings.</li>
            <li>Interaction Data: We may collect data about your interactions with the Service, such as your participation in raffles, use of free entries, "pull" purchases, and engagement with digital fortunes.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-4">Voluntarily Provided Information:</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Username (Optional): If you choose to set a username on our platform, we will collect and store that information.</li>
            <li>Communications: If you contact us directly, for example, via email for support, we will collect the information you provide in your communications (e.g., your email address and the content of your message).</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-4">Cookies and Tracking Technologies:</h3>
          <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. For example, cookies may be used to remember your login status for daily free entries or your preferences. You can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of the Site.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Operate and maintain the Crypto Tea House service.</li>
            <li>Facilitate your participation in raffles and distribution of prizes, including NFTs.</li>
            <li>Process your optional "pull" purchases and deliver associated digital assets or entries.</li>
            <li>Manage your account and provide you with customer support.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Ensure the security and integrity of our Site, including preventing fraudulent activity and enforcing our Terms and Agreements.</li>
            <li>Comply with applicable legal or regulatory obligations, including enforcing jurisdictional restrictions.</li>
            <li>Respond to your comments, questions, and requests.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclosure of Your Information</h2>
          <p>We do not sell your personal information. We may share information we have collected about you in certain situations:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Public Blockchain: Information such as your wallet address and transaction history (e.g., NFT transfers, "pull" purchases) is publicly visible and verifiable on the relevant blockchain. This is an inherent feature of blockchain technology.</li>
            <li>With Your Consent: We may share your information with third parties when we have your consent to do so.</li>
            <li>Service Providers: We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., hosting services, analytics providers). We will endeavor to ensure these parties protect your information.</li>
            <li>Legal Requirements: We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to (i) comply with a legal obligation, (ii) protect and defend the rights or property of Crypto Tea House, (iii) act in urgent circumstances to protect the personal safety of users of the Site or the public, or (iv) protect against legal liability.</li>
            <li>Business Transfers: In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company, your information may be transferred as part of that transaction.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p>We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information. You are also responsible for the security of your own crypto wallet.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
          <p>We will retain your information only for as long as is necessary for the purposes set out in this Privacy Policy, for as long as your account is active, or as needed to provide you services. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies. Information on public blockchains is permanent and cannot be deleted by us.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Children's Privacy</h2>
          <p>Our Service is not intended for individuals under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Data Protection Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions (this may not apply to data on public blockchains).</li>
            <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p>If you wish to exercise any of these rights, please contact us at LuckyLarry7128@gmail.com. We will respond to your request in accordance with applicable law.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Third-Party Websites</h2>
          <p>The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. International Transfers</h2>
          <p>Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to the United States (or other jurisdictions where our servers may be located) and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. Your continued use of the Site after any modification to this Privacy Policy will constitute your acceptance of such modification.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
          <p>Crypto Tea House</p>
          <p>📧 LuckyLarry7128@gmail.com</p>
        </section>

        {/* Cookies Section */}
        <section id="cookies" className="scroll-mt-20">
          <h1 id="cookies" className="text-4xl font-bold mt-16 mb-6">Cookies</h1>
          <div className="text-sm text-light-300 mb-8">
            <p>Effective Date: 5/5/2025</p>
            <p>Last Updated: 5/5/2025</p>
          </div>

          <h2 className="text-2xl font-semibold mb-4">What are Cookies?</h2>
          <p className="mb-6">
            Cookies are small text files stored on your device (computer, tablet, mobile phone) by your web browser when you visit certain websites. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
          <p>Crypto Tea House (CryptoTeaHouse.com) uses cookies and similar tracking technologies to enhance your user experience, operate our Site, and analyze its performance. Specifically, we may use cookies to:</p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Essential Site Functionality:</h3>
          <p>Some cookies are necessary for the Site to function properly. For example, we may use cookies to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Remember your login status and session information, so you don't have to re-enter details or re-authenticate for your daily free entry.</li>
            <li>Process transactions and interactions on the Site.</li>
            <li>Ensure the security of the Site.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-4">Preferences:</h3>
          <p>We may use cookies to remember your settings and preferences, such as your preferred language or display settings, to provide a more personalized experience.</p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Performance and Analytics:</h3>
          <p>We use cookies to collect information about how visitors use our Site, such as which pages are visited most often, how users navigate the site, and if they encounter error messages. This information is typically aggregated and anonymous and helps us improve the Site's functionality and performance.</p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Security:</h3>
          <p>We may use cookies to help detect and prevent security risks.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Cookies We May Use:</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Session Cookies: These are temporary cookies that expire when you close your browser. They are used for essential site functions during your visit.</li>
            <li>Persistent Cookies: These cookies remain on your device for a set period or until you delete them. They can be used to remember your preferences for future visits.</li>
            <li>First-party Cookies: These are set directly by CryptoTeaHouse.com.</li>
            <li>Third-party Cookies: These may be set by third-party services we use for analytics or other functionalities integrated into our Site.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Choices Regarding Cookies</h2>
          <p>Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. You can typically find these settings in the "options" or "preferences" menu of your browser. Consult your browser's help documentation for more information.</p>
          <p>Please be aware that if you choose to disable cookies, some parts of our Site may not function correctly or may be unavailable. For example, you might not be able to stay logged in for your daily free entry without re-authenticating.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Consent to Use Cookies</h2>
          <p>By continuing to use CryptoTeaHouse.com after being presented with information about our use of cookies (e.g., through a cookie banner or by accessing this Privacy Policy), you consent to our use of cookies as described in this policy.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Our Cookie Use</h2>
          <p>We may update our use of cookies from time to time. Any changes will be posted in this section of our Privacy Policy.</p>
        </section>

        {/* Disclaimers Section */}
        <section id="disclaimers" className="scroll-mt-20">
          <h1 id="disclaimers" className="text-4xl font-bold mt-16 mb-6">Disclaimers</h1>
          <div className="text-sm text-light-300 mb-8">
            <p>Effective Date: 5/5/2025</p>
            <p>Last Updated: 5/5/2025</p>
          </div>

          <p className="mb-6">
            Please read these Disclaimers carefully before using CryptoTeaHouse.com (the "Site" or "Service"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Disclaimers, alongside our Terms and Agreements and Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">For Entertainment Purposes Only</h2>
          <p>Crypto Tea House and all its features, including raffles, digital fortunes, NFTs, and "pulls," are provided strictly for entertainment purposes. The Service does not offer real-money gambling, investment opportunities, or financial advice.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">No Guarantee of Value or Return</h2>
          <p>Any digital assets, including Non-Fungible Tokens (NFTs) or other rewards obtained through the Site, may have no monetary value. Crypto Tea House makes no representations, warranties, or guarantees regarding the present or future value, utility, or marketability of any such assets. Participation does not guarantee any financial return or profit.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Volatility and Risk of Crypto Assets</h2>
          <p>You understand and acknowledge that cryptocurrencies and blockchain-based assets (including NFTs) are inherently volatile and subject to significant price fluctuations. Their value can go down as well as up, and you could lose all of your contributed funds. Crypto Tea House is not responsible for any losses incurred due to the volatility of digital assets.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Blockchain Risks</h2>
          <p>Transactions on blockchain networks are irreversible. You are solely responsible for any transaction fees (e.g., "gas fees") associated with your use of the Site and interaction with blockchain networks. Crypto Tea House has no control over blockchain networks or their fees.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">No Financial or Legal Advice</h2>
          <p>The content and services provided on CryptoTeaHouse.com are not intended to be, and should not be construed as, financial, investment, legal, or tax advice. You should consult with qualified professionals before making any financial or legal decisions.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibility & Wallet Security</h2>
          <p>You are solely responsible for the security of your cryptocurrency wallet(s) and any private keys associated with them. Crypto Tea House will never ask for your private keys or seed phrases. You are also responsible for ensuring that your participation in our services is compliant with all laws and regulations in your jurisdiction.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">"AS IS" and "AS AVAILABLE"</h2>
          <p>The Site and Service are provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. Crypto Tea House does not warrant that the Site will be uninterrupted, secure, or error-free.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Accuracy of Information</h2>
          <p>While we strive to provide accurate and up-to-date information, we make no warranties or representations as to the accuracy, completeness, or timeliness of any content on the Site.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Links & Services</h2>
          <p>The Site may contain links to third-party websites or services that are not owned or controlled by Crypto Tea House. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>

          <p className="mt-8 mb-16">
            By using CryptoTeaHouse.com, you acknowledge that you have read, understood, and agree to all Terms and Agreements, Privacy Policies, Cookie Usage, and Disclosures.
          </p>
        </section>
      </div>
    </div>
  );
} 