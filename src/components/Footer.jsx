import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Users, Mail, Info } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { to: "/terms-and-conditions", text: "Términos y Condiciones", icon: FileText },
    { to: "/privacy-policy", text: "Política de Privacidad", icon: ShieldCheck },
    { to: "/habeas-data", text: "Habeas Data", icon: Users },
    { to: "/about-us", text: "Sobre Nosotros", icon: Info },
    { to: "/contact", text: "Contacto", icon: Mail },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 print:hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-bold text-white">Vacun.org</span>
            </Link>
            <p className="text-sm">
              Certificación de vacunación segura y confiable a nivel internacional.
              Su privacidad es nuestra prioridad.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.slice(0, 3).map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-sky-400 transition-colors duration-200 flex items-center text-sm">
                    <link.icon className="w-4 h-4 mr-2.5 opacity-80" />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-4 uppercase tracking-wider">Compañía</h3>
            <ul className="space-y-3">
              {footerLinks.slice(3).map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-sky-400 transition-colors duration-200 flex items-center text-sm">
                    <link.icon className="w-4 h-4 mr-2.5 opacity-80" />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-4 uppercase tracking-wider">Soporte</h3>
            <p className="text-sm mb-3">
              Para consultas o soporte, no dude en contactarnos.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 px-5 rounded-md text-sm transition-colors duration-200"
            >
              <Mail className="w-4 h-4 mr-2"/> Escríbenos
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Vacun.org. Todos los derechos reservados.
          </p>
          <p className="text-xs mt-1.5 text-slate-500">
            Comprometidos con la seguridad y privacidad de su información de salud.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;