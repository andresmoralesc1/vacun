import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Users, Globe, Target, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-slate-600" />
            <span className="text-2xl font-bold text-slate-700">Vacun.org</span>
          </Link>
          <Link to="/" className="text-slate-600 hover:text-slate-800 transition-colors duration-200 flex items-center">
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
          <div className="text-center mb-12">
            <Users className="w-20 h-20 text-slate-600 mx-auto mb-4" />
            <h1 className="text-5xl font-extrabold text-slate-700 mb-3">Sobre Vacun.org</h1>
            <p className="text-xl text-slate-500">Facilitando la certificación de vacunación global, segura y confiable.</p>
          </div>

          <section className="mb-10">
            <div className="flex items-start mb-4">
              <Target className="w-10 h-10 text-sky-600 mr-4 shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-semibold text-sky-700 mb-2">Nuestra Misión</h2>
                <p className="text-slate-700 leading-relaxed text-lg">
                  En Vacun.org, nuestra misión es proporcionar una plataforma digital segura, accesible y confiable para la generación y verificación de certificados de vacunación internacionales. Buscamos empoderar a individuos y facilitar a las entidades la validación de estados de vacunación, promoviendo la salud pública y la movilidad global de manera responsable.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-start mb-4">
              <Eye className="w-10 h-10 text-emerald-600 mr-4 shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-semibold text-emerald-700 mb-2">Nuestra Visión</h2>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Aspiramos a ser la solución líder a nivel mundial para la certificación digital de vacunación, reconocida por su inquebrantable compromiso con la privacidad del usuario, la seguridad de los datos y la facilidad de uso. Visualizamos un mundo donde la información de salud esencial sea manejada con la máxima integridad, apoyando un futuro más saludable y conectado.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start mb-4">
              <Globe className="w-10 h-10 text-indigo-600 mr-4 shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-semibold text-indigo-700 mb-2">Nuestro Compromiso con la Privacidad</h2>
                <p className="text-slate-700 leading-relaxed text-lg">
                  La piedra angular de Vacun.org es la protección de su información personal. Entendemos la sensibilidad de los datos de salud y hemos construido nuestra plataforma con la privacidad como diseño fundamental. 
                  <strong className="block mt-2">Vacun.org NUNCA compartirá sus datos personales con terceros, incluyendo entidades gubernamentales, sin su consentimiento explícito.</strong> 
                  Nos adherimos a los más altos estándares de seguridad y transparencia, garantizando que usted tenga el control total sobre su información. Para más detalles, consulte nuestra <Link to="/privacy-policy" className="text-indigo-600 hover:underline">Política de Privacidad</Link>.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">¿Preguntas?</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Estamos aquí para ayudar. Si tiene alguna pregunta sobre nuestros servicios o nuestras políticas, no dude en ponerse en contacto.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 transition-colors"
            >
              Contáctanos
            </Link>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default AboutUsPage;