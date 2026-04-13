import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  const premiumPrice = annual ? '$3.99' : '$4.99';
  const enterprisePrice = annual ? '$9.99' : '$12.99';

  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />

      <div className="pt-32 px-6">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2.5 bg-primary/[0.08] border border-primary/[0.1] text-primary text-[11px] font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-pill mb-7 backdrop-blur-sm">
              <div className="glow-pip-active" />
              Pricing
            </div>
            <h1 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold tracking-tight leading-[1.1] mb-5">
              Choose Your <span className="text-gradient">Tier</span>
            </h1>
            <p className="font-body text-[17px] text-text-main/40 mb-10 leading-[1.7]">
              Scale your community with precision power.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`font-ui text-[13px] transition-colors duration-300 ${!annual ? 'text-text-main' : 'text-text-main/35'}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-14 h-7 rounded-full transition-all duration-400 cursor-pointer ${
                  annual ? 'bg-primary-dim shadow-glow-sm' : 'bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white transition-shadow ${
                    annual ? 'left-[29px] shadow-[0_0_10px_rgba(159,167,255,0.4)]' : 'left-[3px]'
                  }`}
                />
              </button>
              <span className={`font-ui text-[13px] transition-colors duration-300 ${annual ? 'text-text-main' : 'text-text-main/35'}`}>
                Annual
              </span>
              <AnimatePresence>
                {annual && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -8 }}
                    className="font-ui text-[11px] bg-primary/[0.12] text-primary px-3 py-1 rounded-pill border border-primary/[0.1]"
                  >
                    Save 20%
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-9"
            >
              <div className="font-ui text-[11px] tracking-[0.15em] text-text-main/30 uppercase mb-3">
                Foundation
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1.5 mb-9">
                <span className="font-display text-[2.5rem] font-bold">$0</span>
                <span className="font-body text-[14px] text-text-main/30">/forever</span>
              </div>
              <div className="space-y-4 mb-10">
                {['Basic Moderation', '5 Custom Commands', 'XP & Leveling', 'Welcome Messages', '1 Ticket Panel'].map(
                  (f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-text-main/20 flex-shrink-0" />
                      <span className="font-body text-[14px] text-text-main/50">{f}</span>
                    </div>
                  )
                )}
              </div>
              <Link
                to="/login"
                className="secondary-btn block text-center font-ui text-[13px] font-semibold text-text-main/60 px-6 py-3.5 rounded-pill hover:text-text-main transition-all duration-300"
              >
                Start for Free
              </Link>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl p-9 bg-[#1A1A24] overflow-hidden gradient-border"
            >
              {/* Catch light */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              {/* Ambient glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/[0.06] rounded-full blur-[60px]" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-dim/[0.04] rounded-full blur-[50px]" />

              <div className="absolute top-4 right-4 bg-primary/[0.12] text-primary font-ui text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-pill border border-primary/[0.1]">
                Popular
              </div>
              <div className="font-ui text-[11px] tracking-[0.15em] text-primary/50 uppercase mb-3">
                Catalyst
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Premium</h3>
              <div className="flex items-baseline gap-1.5 mb-9">
                <motion.span
                  key={premiumPrice}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-[2.5rem] font-bold text-gradient-static"
                >
                  {premiumPrice}
                </motion.span>
                <span className="font-body text-[14px] text-text-main/30">/mo</span>
              </div>
              <div className="space-y-4 mb-10">
                {[
                  'Everything in Free',
                  'Cinematic Welcome Cards',
                  'Unlimited Custom Commands',
                  'AI-Powered Auto-Mod',
                  'Priority Bot Speed',
                  'Custom Branding',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary/50 flex-shrink-0" />
                    <span className="font-body text-[14px] text-text-main/55">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full gradient-btn text-white font-ui text-[13px] font-semibold px-6 py-3.5 rounded-pill cursor-pointer">
                Upgrade Now
              </button>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-9"
            >
              <div className="font-ui text-[11px] tracking-[0.15em] text-text-main/30 uppercase mb-3">
                Enterprise
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1.5 mb-9">
                <motion.span
                  key={enterprisePrice}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-[2.5rem] font-bold"
                >
                  {enterprisePrice}
                </motion.span>
                <span className="font-body text-[14px] text-text-main/30">/mo</span>
              </div>
              <div className="space-y-4 mb-10">
                {[
                  'Everything in Premium',
                  'Dedicated Bot Instance',
                  'API Access',
                  'White-label Options',
                  'SLA & Priority Support',
                  'Custom Integrations',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-text-main/20 flex-shrink-0" />
                    <span className="font-body text-[14px] text-text-main/50">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/login"
                className="secondary-btn block text-center font-ui text-[13px] font-semibold text-text-main/60 px-6 py-3.5 rounded-pill hover:text-text-main transition-all duration-300"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
