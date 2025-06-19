import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, DatabaseZap } from 'lucide-react';
import { motion } from 'framer-motion';

const HabeasDataPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">Vacun.org</span>
          </Link>
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center">
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
            <DatabaseZap className="w-12 h-12 text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-extrabold text-blue-700">Política de Tratamiento de Datos (Habeas Data)</h1>
              <p className="text-slate-500">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">1. Objeto y Alcance</h2>
            <p className="text-slate-700 leading-relaxed">
              Vacun.org, en cumplimiento con las leyes de protección de datos personales aplicables, establece esta Política de Tratamiento de Datos Personales. El objetivo es informar a los titulares de los datos sobre sus derechos, los procedimientos para ejercerlos y las responsabilidades de Vacun.org en el tratamiento de su información. Esta política aplica a todos los datos personales registrados en las bases de datos de Vacun.org.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">2. Principios para el Tratamiento de Datos</h2>
            <p className="text-slate-700 leading-relaxed">
              Vacun.org aplicará los siguientes principios en el tratamiento de datos personales:
            </p>
            <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-1 mt-2 pl-4">
              <li><strong>Legalidad:</strong> El tratamiento se sujetará a las disposiciones legales aplicables.</li>
              <li><strong>Finalidad:</strong> Los datos serán recolectados con fines determinados, explícitos y legítimos, informados al titular.</li>
              <li><strong>Libertad:</strong> El tratamiento solo se ejercerá con el consentimiento previo, expreso e informado del titular.</li>
              <li><strong>Veracidad o Calidad:</strong> La información será veraz, completa, exacta, actualizada, comprobable y comprensible.</li>
              <li><strong>Transparencia:</strong> Se garantizará el derecho del titular a obtener información sobre sus datos.</li>
              <li><strong>Acceso y Circulación Restringida:</strong> El tratamiento se sujetará a los límites que se derivan de la naturaleza de los datos y las disposiciones legales.</li>
              <li><strong>Seguridad:</strong> Se adoptarán las medidas técnicas, humanas y administrativas necesarias para proteger la información.</li>
              <li><strong>Confidencialidad:</strong> Se garantizará la reserva de la información, inclusive después de finalizada su relación con alguna de las labores que comprende el tratamiento. <strong>Reiteramos nuestro compromiso de no compartir sus datos con terceros, incluyendo entidades gubernamentales, sin su consentimiento explícito.</strong></li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">3. Derechos del Titular de los Datos</h2>
            <p className="text-slate-700 leading-relaxed">
              Como titular de sus datos personales, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-1 mt-2 pl-4">
              <li>Conocer, actualizar y rectificar sus datos personales.</li>
              <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
              <li>Ser informado sobre el uso que se ha dado a sus datos personales.</li>
              <li>Presentar quejas ante la autoridad competente por infracciones a la ley.</li>
              <li>Revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías constitucionales y legales.</li>
              <li>Acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">4. Procedimiento para Ejercer sus Derechos</h2>
            <p className="text-slate-700 leading-relaxed">
              Para ejercer sus derechos de Habeas Data, puede <Link to="/contact" className="text-blue-600 hover:underline">contactarnos</Link> a través de los canales indicados en nuestra página de Contacto. Deberá proporcionar:
            </p>
            <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-1 mt-2 pl-4">
              <li>Nombre completo y documento de identificación.</li>
              <li>Descripción clara de la consulta o petición.</li>
              <li>Dirección física o electrónica para notificaciones.</li>
              <li>Documentos que soporten su solicitud (si aplica).</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-2">
              Vacun.org responderá a su solicitud en los términos establecidos por la ley.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">5. Responsable del Tratamiento</h2>
            <p className="text-slate-700 leading-relaxed">
              El responsable del tratamiento de sus datos personales es Vacun.org. Puede encontrar nuestra información de contacto en la sección <Link to="/contact" className="text-blue-600 hover:underline">Contacto</Link> de nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">6. Vigencia</h2>
            <p className="text-slate-700 leading-relaxed">
              Esta Política de Tratamiento de Datos Personales rige a partir de su fecha de publicación. Cualquier cambio sustancial será comunicado oportunamente a los titulares.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default HabeasDataPage;