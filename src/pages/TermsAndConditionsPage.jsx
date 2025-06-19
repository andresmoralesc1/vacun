import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-sky-600" />
            <span className="text-2xl font-bold text-sky-700">Vacun.org</span>
          </Link>
          <Link to="/" className="text-sky-600 hover:text-sky-800 transition-colors duration-200 flex items-center">
            <ArrowLeft className="w-5 h-5 mr-1" /> Volver al Inicio
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-4xl mx-auto"
        >
          <div className="flex items-center mb-8">
            <FileText className="w-12 h-12 text-sky-600 mr-4" />
            <div>
              <h1 className="text-4xl font-extrabold text-sky-700">Términos y Condiciones</h1>
              <p className="text-slate-500">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-sky-600 mb-3">1. Aceptación de los Términos</h2>
            <p className="text-slate-700 leading-relaxed">
              Al acceder y utilizar el sitio web Vacun.org (en adelante, el "Servicio"), usted acepta estar sujeto a estos Términos y Condiciones ("Términos"). Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio. Nos reservamos el derecho de modificar estos Términos en cualquier momento.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-sky-600 mb-3">2. Uso del Servicio</h2>
            <p className="text-slate-700 leading-relaxed">
              Usted se compromete a utilizar el Servicio únicamente para fines lícitos y de acuerdo con estos Términos. Es responsable de garantizar que toda la información que proporcione sea precisa, actual y completa. El uso indebido del Servicio, incluyendo la falsificación de información o el intento de acceso no autorizado, está estrictamente prohibido.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-sky-600 mb-3">3. Cuentas de Usuario</h2>
            <p className="text-slate-700 leading-relaxed">
              Para acceder a ciertas funciones del Servicio, deberá crear una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta. Notifíquenos inmediatamente sobre cualquier uso no autorizado de su cuenta.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-sky-600 mb-3">4. Privacidad y Protección de Datos</h2>
            <p className="text-slate-700 leading-relaxed">
              Su privacidad es de suma importancia para nosotros. Nuestra <Link to="/privacy-policy" className="text-sky-600 hover:underline">Política de Privacidad</Link> describe cómo recopilamos, usamos y protegemos su información personal. <strong>Vacun.org se compromete a no compartir sus datos personales con terceros, incluyendo entidades gubernamentales, sin su consentimiento explícito, salvo obligación legal imperativa.</strong>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-sky-600 mb-3">5. Propiedad Intelectual</h2>
            <p className="text-slate-700 leading-relaxed">
              El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Vacun.org y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-sky-600 mb-3">6. Limitación de Responsabilidad</h2>
            <p className="text-slate-700 leading-relaxed">
              En la máxima medida permitida por la ley aplicable, Vacun.org no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, entre otros, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de su acceso o uso o incapacidad para acceder o usar el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-sky-600 mb-3">7. Contacto</h2>
            <p className="text-slate-700 leading-relaxed">
              Si tiene alguna pregunta sobre estos Términos, por favor <Link to="/contact" className="text-sky-600 hover:underline">contáctenos</Link>.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsAndConditionsPage;