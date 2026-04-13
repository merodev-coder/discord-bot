import { Link } from 'react-router-dom';

const footerLinks = {
  Product: [
    { name: 'Features', path: '/features' },
    { name: 'Commands', path: '/commands' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Dashboard', path: '/dashboard' },
  ],
  Resources: [
    { name: 'Documentation', path: '/' },
    { name: 'Status', path: '/' },
    { name: 'Changelog', path: '/' },
  ],
  Legal: [
    { name: 'Privacy', path: '/' },
    { name: 'Terms', path: '/' },
    { name: 'Support', path: '/' },
  ],
};

const Footer = () => {
  return (
    <footer className="relative mt-32">
      {/* Top fade line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="bg-[#0B0B11] pt-16 pb-8">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Main grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4 group">
                <img src="/bot-logo.png" alt="UltimateBot" className="w-9 h-9 rounded-xl group-hover:scale-105 transition-transform duration-300" />
                <span className="font-display font-bold text-lg text-text-main">UltimateBot</span>
              </Link>
              <p className="font-body text-[14px] text-text-main/30 leading-relaxed max-w-[260px] mb-6">
                The all-in-one Discord bot for moderation, engagement, and server management.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-4 h-4 text-text-main/30 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-4 h-4 text-text-main/30 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-4 h-4 text-text-main/30 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-ui text-[11px] tracking-[0.15em] text-text-main/25 uppercase mb-5">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="font-body text-[14px] text-text-main/35 hover:text-text-main/70 transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.03]">
            <div className="font-ui text-[12px] text-text-main/20">
              &copy; {new Date().getFullYear()} UltimateBot. All rights reserved.
            </div>
            <div className="font-ui text-[11px] tracking-wider text-text-main/15 uppercase">
              Crafted with precision
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
