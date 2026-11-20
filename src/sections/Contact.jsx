import emailjs from '@emailjs/browser';
import { useState } from 'react';

import useAlert from '../hooks/useAlert.js';
import Alert from '../components/Alert.jsx';
import { profile } from '../constants/index.js';

const Contact = () => {
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
          showAlert({ show: true, text: 'Message sent. I will reply by email.', type: 'success' });
          setTimeout(() => {
            hideAlert(false);
            setForm({ name: '', email: '', message: '' });
          }, 3000);
        },
        (error) => {
          setLoading(false);
          console.error(error);
          showAlert({ show: true, text: `That did not send. Email ${profile.email} instead.`, type: 'danger' });
        },
      );
  };

  return (
    <section id="contact" className="sec">
      {alert.show && <Alert {...alert} />}

      <div className="sec-h">
        <p className="lb">Open to {profile.openTo}</p>
        <h2>Contact</h2>
        <p className="sec-l">If you have manual work that should not be manual, or a role where that is the job, write to me.</p>
      </div>

      <form onSubmit={handleSubmit} className="ct">
        <label>
          <span className="lb">Name</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} required autoComplete="name" className="fld" />
        </label>
        <label>
          <span className="lb">Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" className="fld" />
        </label>
        <label>
          <span className="lb">Message</span>
          <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="fld" />
        </label>
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Sending…' : 'Send message'}
        </button>
      </form>
      <p className="ct-or">
        Or email <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
    </section>
  );
};

export default Contact;
