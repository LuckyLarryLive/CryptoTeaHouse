import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-8 md:mb-0">
            <Link href="/">
              <a className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 inline-block">
                Crypto Tea House
              </a>
            </Link>
            <p className="text-light-300 max-w-md mb-6">
              A unique fortune-based crypto experience where luck meets blockchain technology. Connect your wallet and discover what fortune awaits you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-light-300 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.032 10.032 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                </svg>
              </a>
              <a href="#" className="text-light-300 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-light-300 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-light-300 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.988 14.28c-.143 0-.302-.067-.388-.206l-3.24-4.843c-.129-.193-.132-.423-.008-.618.122-.195.343-.309.573-.297l8.58.44c.228.012.43.146.526.348.095.201.081.438-.039.626l-5.517 5.197c-.123.118-.266.178-.424.163-.013-.001-.073-.01-.063-.01zm-1.854-4.234l1.775 2.659 3.182-2.994-4.957-.258z"/>
                  <path d="M5.025 13.875c-2.207 0-4.006-1.798-4.006-4.006V5.835c0-2.207 1.798-4.006 4.006-4.006h4.025c2.207 0 4.006 1.798 4.006 4.006v4.035c0 2.207-1.798 4.006-4.006 4.006l-.026-.001H5.025z"/>
                  <path d="M14.97 22.142c-2.207 0-4.006-1.797-4.006-4.006v-4.035c0-2.208 1.798-4.006 4.006-4.006h4.025c2.207 0 4.006 1.798 4.006 4.006v4.035c0 2.208-1.797 4.006-4.006 4.006h-4.025z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-lg font-bold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-light-300 hover:text-primary transition-colors">Tea House</Link></li>
                <li><Link href="/winners" className="text-light-300 hover:text-primary transition-colors">Winners</Link></li>
                <li><Link href="/how-it-works" className="text-light-300 hover:text-primary transition-colors">How it Works</Link></li>
                <li><Link href="/tokenomics" className="text-light-300 hover:text-primary transition-colors">Tokenomics</Link></li>
                <li><Link href="/roadmap" className="text-light-300 hover:text-primary transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">Whitepaper</a></li>
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">Token</a></li>
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">Cookies</a></li>
                <li><a href="#" className="text-light-300 hover:text-primary transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-dark-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-light-300 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Crypto Tea House. All rights reserved.
          </div>
          <div className="text-light-300">
            Powered by <span className="text-primary">Solana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
