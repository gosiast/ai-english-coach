import { Mail, Linkedin, Github } from 'lucide-react';

type FooterProps = {
  happyUsers: number;
};

const Footer = ({ happyUsers }: FooterProps) => {
  return (
    <footer className="mt-16 border-t border-border/40">
      <div className="max-w-md mx-auto px-4 py-8 space-y-4 text-center">

        {/* Metric */}
        <p className="text-xs text-muted-foreground">
          ✨ {happyUsers > 0
            ? `${happyUsers} people have tried improving their English here`
            : 'Helping people practice simple, real-life English'}
        </p>

        {/* Contact icons */}
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <a
            href="mailto:gosia@example.com"
            aria-label="Email"
            className="hover:text-foreground transition-colors"
          >
            <Mail size={18} />
          </a>

          <a
            href="https://www.linkedin.com/in/your-link/"
            target="_blank"
            aria-label="LinkedIn"
            className="hover:text-foreground transition-colors"
          >
            <Linkedin size={18} />
          </a>

          <a
            href="https://github.com/gosiast/ai-english-coach"
            target="_blank"
            aria-label="GitHub"
            className="hover:text-foreground transition-colors"
          >
            <Github size={18} />
          </a>
        </div>

        {/* Attribution */}
        <p className="text-xs text-muted-foreground">
          Open sourced on GitHub · Built by Małgorzata Stano
        </p>
      </div>
    </footer>
  );
};

export default Footer;
