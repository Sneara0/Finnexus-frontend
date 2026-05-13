
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Clock, Globe, CheckCircle, AlertCircle, Sparkles,
  ArrowRight, User, AtSign, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Social icons as custom SVGs
const TwitterIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedinIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>;
const GithubIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;
const InstagramIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, title: "Email", info: "hello@finnexus.com", detail: "support@finnexus.com", action: "mailto:hello@finnexus.com" },
    { icon: Phone, title: "Phone", info: "+1 (234) 567-8900", detail: "Mon-Fri, 9am-6pm EST", action: "tel:+12345678900" },
    { icon: MapPin, title: "Office", info: "123 AI Avenue", detail: "Silicon Valley, CA 94025", action: "https://maps.google.com" },
    { icon: Clock, title: "Support", info: "24/7 AI Support", detail: "Average response: 2min", action: "#" },
  ];

  const faqs = [
    { q: "How quickly do you respond?", a: "Our AI chatbot responds instantly. Human support within 24 hours." },
    { q: "Is there a free trial?", a: "Yes! You can start with our free plan and upgrade anytime." },
    { q: "Can I cancel anytime?", a: "Absolutely! No long-term contracts. Cancel with one click." },
    { q: "Do you offer enterprise plans?", a: "Yes, contact our sales team for custom enterprise solutions." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold mb-6 uppercase tracking-widest"
          >
            <Sparkles size={14} className="animate-spin-slow" /> Get in Touch
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black uppercase mb-6"
          >
            Contact{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Us
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.action}
              target={item.action.startsWith('http') ? "_blank" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group block p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <item.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-slate-300 text-sm">{item.info}</p>
              <p className="text-slate-500 text-xs mt-1">{item.detail}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Contact Form + Map Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <motion.div {...fadeInUp} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
            </div>
            
            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-200 text-sm">Message sent successfully! We'll get back to you soon.</p>
              </motion.div>
            )}
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="hello@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
          
          {/* FAQ Section */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Quick Answers</h2>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white font-semibold text-sm mb-2">{faq.q}</p>
                    <p className="text-slate-400 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Links */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-white font-bold text-lg mb-6 text-center">Connect With Us</h3>
              <div className="flex justify-center gap-4">
                <Link href="https://twitter.com" target="_blank" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-white/10 group">
                  <TwitterIcon />
                </Link>
                <Link href="https://linkedin.com" target="_blank" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-white/10 group">
                  <LinkedinIcon />
                </Link>
                <Link href="https://github.com" target="_blank" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-white/10 group">
                  <GithubIcon />
                </Link>
                <Link href="https://instagram.com" target="_blank" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-white/10 group">
                  <InstagramIcon />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-white/10"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126865.80443666744!2d-122.08406440829665!3d37.42199987998979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5c4b9f8d6d9%3A0x8f8b8b8b8b8b8b8b!2sSilicon%20Valley%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale hover:grayscale-0 transition-all duration-700"
            title="Office Location"
          />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Financial Journey Today
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their finances smarter with FinNexus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition group">
                  Get Started Free <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
