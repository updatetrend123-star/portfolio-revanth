import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail, MapPin, LogOut } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';
import { useAuth } from '@/src/context/AuthContext';

export default function Footer() {
  const { data: portfolioData } = usePortfolio();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  return (
    <footer id="footer" className="bg-primary pt-20 pb-10 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary font-bold">
                YRK
              </div>
              <span className="font-bold text-xl tracking-tighter">
                {portfolioData.personal.name}
              </span>
            </Link>
            <p className="text-beige/60 max-w-sm mb-8 leading-relaxed">
              {portfolioData.personal.tagline} Building digital experiences that matter with precision and passion.
            </p>
            <div className="flex gap-4">
              {portfolioData.social.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-beige/50 hover:bg-accent hover:text-primary hover:border-accent transition-all"
                >
                  {s.name === 'Github' && <Github size={18} />}
                  {s.name === 'Linkedin' && <Linkedin size={18} />}
                  {s.name === 'Instagram' && <Instagram size={18} />}
                  {s.name === 'Email' && <Mail size={18} />}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-accent">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-beige/60 hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/projects" className="text-beige/60 hover:text-accent transition-colors">Portfolio</Link></li>
              <li><Link to="/services" className="text-beige/60 hover:text-accent transition-colors">Services</Link></li>
              {isAuthenticated ? (
                <li>
                  <button 
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer text-left"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li><Link to="/login" className="text-beige/60 hover:text-accent transition-colors">Admin Login</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-accent">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-beige/60">
                <Mail size={16} className="text-accent" />
                {portfolioData.personal.email}
              </li>
              <li className="flex items-center gap-3 text-beige/60">
                <MapPin size={16} className="text-accent" />
                {portfolioData.personal.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-beige/40">
          <p className="font-medium font-sans">© {currentYear} {portfolioData.personal.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {isAuthenticated && (
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer bg-red-400/5 hover:bg-red-400/10 px-4 py-2 rounded-xl border border-red-500/10 text-xs uppercase tracking-wider"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            )}
            <p className="flex items-center gap-2 font-medium">
              Built with precision & passion.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
