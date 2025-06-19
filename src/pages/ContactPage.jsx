import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Send, MessageSquare, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Aquí iría la lógica para enviar el formulario (ej. a un backend o servicio de email)
    // Por ahora, simularemos un envío exitoso.
    try {
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Mensaje Enviado",
        description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Error al Enviar",
        description: "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-red-100 text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">Vacun.org</span>
          </Link>
          <Link to="/" className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center">
            <ArrowLeft className="w-5 h-5 mr-1" /> Volver al Inicio
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <Mail className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold text-purple-700 mb-2">Contáctanos</h1>
            <p className="text-lg text-slate-500">¿Tienes preguntas o necesitas ayuda? Estamos aquí para asistirte.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-medium text-slate-700 flex items-center"><User className="w-4 h-4 mr-2 text-purple-500"/>Nombre Completo</Label>
                <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-medium text-slate-700 flex items-center"><Mail className="w-4 h-4 mr-2 text-purple-500"/>Correo Electrónico</Label>
                <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="tu@correo.com" required />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="font-medium text-slate-700 flex items-center"><Phone className="w-4 h-4 mr-2 text-purple-500"/>Teléfono (Opcional)</Label>
              <Input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject" className="font-medium text-slate-700 flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-purple-500"/>Asunto</Label>
              <Input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} placeholder="Ej: Consulta sobre mi certificado" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="font-medium text-slate-700 flex items-center"><Send className="w-4 h-4 mr-2 text-purple-500"/>Mensaje</Label>
              <Textarea name="message" id="message" value={formData.message} onChange={handleChange} placeholder="Escribe tu mensaje aquí..." rows={5} required />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold transition-colors" disabled={isSubmitting}>
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                ></motion.div>
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-600">También puedes revisar nuestras <Link to="/privacy-policy" className="text-purple-600 hover:underline">Políticas de Privacidad</Link> o los <Link to="/terms-and-conditions" className="text-purple-600 hover:underline">Términos y Condiciones</Link>.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ContactPage;