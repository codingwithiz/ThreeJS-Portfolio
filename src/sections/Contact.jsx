import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import useAlert from '../hooks/useAlert.js';
import Alert from '../components/Alert.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { profile } from '../constants/index.js';

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Contact = () => {
  const formRef = useRef();
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = ({ target: { name, value } }) => setForm({ ...form, [name]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          title: `New message from ${form.name}`,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY,
      )
      .then(
        () => {
          setLoading(false);
          showAlert({ show: true, text: 'Thank you for your message 😃', type: 'success' });
          setTimeout(() => {
            hideAlert(false);
            setForm({ name: '', email: '', message: '' });
          }, 3000);
        },
        (error) => {
          setLoading(false);
          console.error(error);
          showAlert({ show: true, text: "I didn't receive your message 😢", type: 'danger' });
        },
      );
  };

  const fieldClass =
    'w-full rounded-xl border border-edge bg-surface-light px-4 py-3 text-ink placeholder:text-ink-muted/50 transition-colors focus:border-amber/60 focus:outline-none focus:ring-1 focus:ring-amber/30';

  return (
    <section id="contact" className="grain section-shell">
      {alert.show && <Alert {...alert} />}

      <motion.div
        className="mx-auto max-w-xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={item}>
        <SectionHeader
          number="08"
          label="Contact"
          title={
            <>
              Let&apos;s build <span className="font-display italic text-amber">something</span>.
            </>
          }
        />
        <p className="mt-4 text-ink-muted">
          Open to software engineering roles, freelance projects, and good conversations. Drop a message — or
          email me directly at{' '}
          <a href={`mailto:${profile.email}`} className="text-amber underline-offset-4 hover:underline">
            {profile.email}
          </a>
          .
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="card mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm text-ink-muted">Full name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="e.g. Jane Doe"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-ink-muted">Email address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="e.g. jane@company.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-ink-muted">Your message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className={fieldClass}
              placeholder="Tell me about the role, project, or idea…"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber px-5 py-3 font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60">
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
