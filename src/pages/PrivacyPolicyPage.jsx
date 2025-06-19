import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-700">Vacun.org</span>
          </Link>
          <Link to="/" className="text-emerald-600 hover:text-emerald-800 transition-colors duration-200 flex items-center">
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
            <Lock className="w-12 h-12 text-emerald-600 mr-4" />
            <div>
              <h1 className="text-4xl font-extrabold text-emerald-700">Política de Privacidad</h1>
              <p className="text-slate-500">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">1. Compromiso con la Privacidad</h2>
            <p className="text-slate-700 leading-relaxed">
              En Vacun.org, su privacidad es nuestra máxima prioridad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información personal cuando utiliza nuestros servicios de certificación de vacunación. Estamos comprometidos a proteger sus datos y a ser transparentes sobre nuestras prácticas.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">2. Información que Recopilamos</h2>
            <p className="text-slate-700 leading-relaxed">
              Recopilamos información necesaria para proporcionar y mejorar nuestro Servicio. Esto incluye:
            </p>
            <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-1 mt-2 pl-4">
              <li><strong>Información de Identificación Personal:</strong> Nombre completo, número de documento, fecha de nacimiento, país de residencia, correo electrónico.</li>
              <li><strong>Información de Vacunación:</strong> Nombre de la vacuna, dosis, lote, fecha de vacunación, lugar de vacunación, profesional de salud.</li>
              <li><strong>Información de Familiares (si aplica):</strong> Datos similares a los anteriores para los dependientes que registre.</li>
              <li><strong>Datos de Uso:</strong> Información sobre cómo interactúa con nuestro Servicio (ej. logs de acceso, tipo de navegador), recopilada de forma anónima o agregada.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">3. Cómo Usamos su Información</h2>
            <p className="text-slate-700 leading-relaxed">
              Utilizamos su información para:
            </p>
            <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-1 mt-2 pl-4">
              <li>Proveer, operar y mantener nuestro Servicio (generar certificados).</li>
              <li>Mejorar, personalizar y expandir nuestro Servicio.</li>
              <li>Entender y analizar cómo utiliza nuestro Servicio.</li>
              <li>Comunicarnos con usted, ya sea directamente o a través de uno de nuestros socios, incluso para servicio al cliente, para proporcionarle actualizaciones y otra información relacionada con el Servicio, y con fines de marketing y promoción (con su consentimiento).</li>
              <li>Prevenir el fraude y garantizar la seguridad.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">4. NO Compartimos su Información Personal</h2>
            <p className="text-slate-700 leading-relaxed font-medium">
              Vacun.org tiene un compromiso fundamental con la privacidad de sus usuarios. 
              <strong>Bajo ninguna circunstancia compartiremos, venderemos, alquilaremos o divulgaremos su información personal identificable a terceros, incluyendo entidades gubernamentales, agencias de aplicación de la ley, u otras organizaciones, sin su consentimiento explícito previo.</strong>
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Las únicas excepciones a esta regla son:
            </p>
            <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-1 mt-2 pl-4">
              <li>Si estamos legalmente obligados a hacerlo por una orden judicial válida o un proceso legal similar, y solo después de agotar todas las vías legales para proteger su información. En tal caso, nos esforzaremos por notificarle, a menos que la ley lo prohíba.</li>
              <li>Para proteger nuestros derechos, propiedad o seguridad, o los de nuestros usuarios u otros, de manera consistente con las leyes aplicables.</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-2">
              La confianza que deposita en nosotros es primordial. Sus datos de salud son sensibles y los tratamos con el máximo nivel de confidencialidad y seguridad.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">5. Seguridad de los Datos</h2>
            <p className="text-slate-700 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas robustas para proteger su información personal contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Esto incluye encriptación de datos, controles de acceso y auditorías de seguridad regulares. Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">6. Sus Derechos (Habeas Data)</h2>
            <p className="text-slate-700 leading-relaxed">
              Usted tiene derecho a acceder, corregir, actualizar o solicitar la eliminación de su información personal. Para más detalles sobre cómo ejercer estos derechos, consulte nuestra <Link to="/habeas-data" className="text-emerald-600 hover:underline">Política de Habeas Data</Link>.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">7. Cambios a esta Política</h2>
            <p className="text-slate-700 leading-relaxed">
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">8. Contacto</h2>
            <p className="text-slate-700 leading-relaxed">
              Si tiene alguna pregunta sobre esta Política de Privacidad, por favor <Link to="/contact" className="text-emerald-600 hover:underline">contáctenos</Link>.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;