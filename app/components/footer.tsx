import { Mail, Linkedin, Github, Users } from 'lucide-react';

type FooterProps = {
  happyUsers: number;
};

const Footer = ({ happyUsers }: FooterProps) => {
  return (
    <footer className="w-full mt-auto border-t border-white/20 bg-white/10 backdrop-blur-md">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6 text-center">
        
        {/* Metric Badge-style */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 shadow-sm">
          <Users size={14} className="text-amber-200" />
          <p className="text-xs font-bold text-white tracking-wide">
            {happyUsers > 0
              ? `${happyUsers.toLocaleString()} learners improved today`
              : 'Helping you master real-life English'}
          </p>
        </div>

        {/* Contact icons */}
        <div className="flex items-center justify-center gap-6">
          <a
            href="mailto:stano.malgorzata@gmail.com"
            aria-label="Email"
            className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200"
          >
            <Mail size={20} />
          </a>

          <a
            href="https://www.linkedin.com/in/malgorzata-stano/"
            target="_blank"
            aria-label="LinkedIn"
            className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200"
          >
            <Linkedin size={20} />
          </a>

          <a
            href="https://github.com/gosiast/ai-english-coach"
            target="_blank"
            aria-label="GitHub"
            className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200"
          >
            <Github size={20} />
          </a>
        </div>

        {/* Attribution */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black tracking-[0.15em] text-white/60">
            Open Source Project
          </p>
          <p className="text-xs font-medium text-white/90">
            Built with ✨ by <span className="underline decoration-amber-400 underline-offset-4">Małgorzata Stano</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;