import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function PartnerFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Partnership Inquiry from Lumina Literacy',
    content: ''
  });

  useEffect(() => {
    const showEvent = () => {
      setIsOpen(true);
      setStatus('idle');
      setFormData(prev => ({ ...prev, name: '', email: '', content: '' }));
    };
    window.addEventListener('show-partner-form', showEvent);
    return () => window.removeEventListener('show-partner-form', showEvent);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Use the internal Vercel/Vite proxy to bypass CORS
      const apiUrl = '/api/proxy/messages';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.content, // Maps to the standard Tales & Treasures DTO
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => status !== 'loading' && setIsOpen(false)}
            className="absolute inset-0 bg-[#101B38]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#FBF8F2] rounded-3xl shadow-2xl overflow-hidden border border-[#C9A84C]/20 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1B2D5E]/10 bg-white relative z-10">
              <h3 className="text-2xl font-bold text-[#1B2D5E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Partner With Us
              </h3>
              <button
                onClick={() => status !== 'loading' && setIsOpen(false)}
                disabled={status === 'loading'}
                className="p-2 text-[#1B2D5E]/60 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white relative z-0">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1B2D5E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Message Sent!</h4>
                  <p className="text-[#1B2D5E]/70 font-sans">
                    Thank you for your interest in partnering with Lumina Literacy. We will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>There was an error sending your message. Please try again later.</p>
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-semibold text-[#1B2D5E]">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      disabled={status === 'loading'}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name or organization"
                      className="w-full px-4 py-3 rounded-xl border border-[#1B2D5E]/10 bg-[#FBF8F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all text-[#1B2D5E] disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-semibold text-[#1B2D5E]">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled={status === 'loading'}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl border border-[#1B2D5E]/10 bg-[#FBF8F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all text-[#1B2D5E] disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="content" className="text-sm font-semibold text-[#1B2D5E]">How would you like to partner?</label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      disabled={status === 'loading'}
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Tell us about your organization and how we can work together..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-[#1B2D5E]/10 bg-[#FBF8F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all text-[#1B2D5E] resize-none disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-[#FFFCF7] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg, #E3C66D, #C9A84C)' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
