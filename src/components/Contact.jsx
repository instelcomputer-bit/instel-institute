import { useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane,
} from 'react-icons/fa';

const COURSE_OPTIONS = [
  'ADCA – Advance Diploma in Computer Application',
  'DCA – Diploma in Computer Application',
  'DTP & Graphic Designing',
  'Basic & Advance Computer',
  'Tally Prime + Accounting',
  'Basic Computer & Internet',
  'Web Designing & Deployment + AI',
  'Editing (Canva, Photoshop, CorelDraw)',
];

const CONTACT_INFO = [
  {
    icon: FaMapMarkerAlt,
    label: 'Address',
    value: 'St.No.3, G.T.B, Near Children Valley School, Opp. Tiger Property, 33 Ft. Road, Ludhiana',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: FaPhone,
    label: 'Contact – Rohit',
    value: '+91 6239864548',
    href: 'tel:+916239864548',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'instelcomputer@gmail.com',
    href: 'mailto:instelcomputer@gmail.com',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: FaClock,
    label: 'Timing',
    value: 'Mon – Sat  |  7:00 AM – 11:00 AM  &  3:00 PM – 8:00 PM',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

const INITIAL_FORM = { name: '', phone: '', email: '', course: '', message: '' };
const INITIAL_ERRORS = { name: '', phone: '', email: '', course: '', message: '' };
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/rkumar89328@gmail.com';
const SECONDARY_RECIPIENT = 'instelcomputer@gmail.com';

function validateForm(fields) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!fields.name.trim()) {
    errors.name = 'Full name is required.';
    valid = false;
  } else if (fields.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
    valid = false;
  }

  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.';
    valid = false;
  } else if (!/^[6-9]\d{9}$/.test(fields.phone.replace(/\s+/g, ''))) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
    valid = false;
  }

  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.';
    valid = false;
  }

  if (!fields.course) {
    errors.course = 'Please select a course.';
    valid = false;
  }

  if (!fields.message.trim()) {
    errors.message = 'Message is required.';
    valid = false;
  } else if (fields.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
    valid = false;
  }

  return { errors, valid };
}

// === ANIMATION VARIANTS ===

const fadeInUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// Success banner: scales in with a spring
const successVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -8,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

// Ripple keyframe is handled inline via Framer Motion
// Field focus glow is handled by CSS class + Tailwind

/**
 * Ripple effect on the submit button.
 * Creates an expanding radial circle from the click origin.
 */
function RippleButton({ disabled, status }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback(
    (e) => {
      if (disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      // Remove after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    },
    [disabled]
  );

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      onClick={handleClick}
      className="mt-1 w-full relative overflow-hidden flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/45 transition-shadow duration-300 disabled:opacity-70 disabled:cursor-not-allowed select-none"
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      aria-label={status === 'submitting' ? 'Submitting your application...' : 'Apply Now'}
    >
      {/* Ripple circles */}
      {ripples.map(({ id, x, y }) => (
        <motion.span
          key={id}
          className="absolute rounded-full bg-white/25 pointer-events-none"
          style={{ left: x, top: y, translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 320, height: 320, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          aria-hidden="true"
        />
      ))}

      {/* Button content */}
      {status === 'submitting' ? (
        <>
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            aria-hidden="true"
          />
          Submitting...
        </>
      ) : (
        <>
          <FaPaperPlane className="text-sm" aria-hidden="true" />
          Apply Now
        </>
      )}
    </motion.button>
  );
}

/**
 * FormField — label + children + animated error message
 */
function FormField({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label} <span className="text-red-400" aria-hidden="true">*</span>
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center gap-1.5 text-xs text-red-400 overflow-hidden"
            role="alert"
            aria-live="polite"
          >
            <FaExclamationCircle aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Input class: enhanced focus glow transition
const inputClass = (hasError) =>
  `w-full px-4 py-3 text-sm text-white rounded-xl bg-white/5 border outline-none placeholder-gray-600 transition-all duration-250 ${
    hasError
      ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
      : 'border-white/10 focus:border-violet-500/70 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]'
  }`;

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors: newErrors, valid } = validateForm(form);

    if (!valid) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors).find((k) => newErrors[k]);
      if (firstErrorKey) {
        document.getElementById(firstErrorKey)?.focus();
      }
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\s+/g, ''),
          email: form.email.trim(),
          course: form.course,
          message: form.message.trim(),
          submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          _subject: `New Admission Enquiry - ${form.name.trim()}`,
          _cc: SECONDARY_RECIPIENT,
          _replyto: form.email.trim(),
          _template: 'table',
          _honey: '',
        }),
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Unable to submit the application.');
      }

      setStatus('success');
      setForm(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Admission form submission failed:', error);
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 sm:py-28 bg-[#0f0f1a]"
      aria-labelledby="contact-heading"
    >
      {/* Background decorations */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === SECTION HEADER === */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          className="text-center mb-14"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-violet-400 border border-violet-500/30 bg-violet-500/8 mb-4"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Admissions Open
          </motion.span>
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
          >
            Get <span className="gradient-text">Admission</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Take the first step towards a brighter future. Fill out the form and our
            counsellor will contact you within 24 hours.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10"
        >
          {/* === FORM — 3 columns === */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <div className="glass-card min-w-0 rounded-2xl p-5 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Admission Enquiry Form</h3>

              {/* === SUCCESS MESSAGE — spring scale-in === */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6"
                    role="status"
                    aria-live="polite"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.1 }}
                    >
                      <FaCheckCircle className="flex-shrink-0 text-lg" aria-hidden="true" />
                    </motion.span>
                    <div>
                      <p className="font-semibold text-sm">Application Submitted Successfully!</p>
                      <p className="text-xs text-emerald-400/70 mt-0.5">We will contact you within 24 hours.</p>
                    </div>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6"
                    role="alert"
                    aria-live="assertive"
                  >
                    <FaExclamationCircle className="flex-shrink-0 text-lg" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-sm">Application could not be sent.</p>
                      <p className="text-xs text-red-400/70 mt-0.5">Please check your connection and try again.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
                aria-label="Admission enquiry form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Full Name" id="name" error={errors.name}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className={inputClass(!!errors.name)}
                      autoComplete="name"
                      aria-required="true"
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </FormField>

                  <FormField label="Phone Number" id="phone" error={errors.phone}>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={inputClass(!!errors.phone)}
                      autoComplete="tel"
                      aria-required="true"
                      maxLength={10}
                    />
                  </FormField>
                </div>

                <FormField label="Email Address" id="email" error={errors.email}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass(!!errors.email)}
                    autoComplete="email"
                    aria-required="true"
                  />
                </FormField>

                <FormField label="Select Course" id="course" error={errors.course}>
                  <select
                    id="course"
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    className={`${inputClass(!!errors.course)} cursor-pointer`}
                    aria-required="true"
                  >
                    <option value="" className="bg-[#0f0f1a] text-gray-400">-- Choose a Course --</option>
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-[#0f0f1a] text-white">{c}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Message" id="message" error={errors.message}>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about yourself, your background, or any questions you have..."
                    className={`${inputClass(!!errors.message)} resize-none`}
                    aria-required="true"
                  />
                </FormField>

                {/* === SUBMIT BUTTON with ripple === */}
                <RippleButton
                  disabled={status === 'submitting'}
                  status={status}
                />
              </form>
            </div>
          </motion.div>

          {/* === INFO PANEL — 2 columns === */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-card min-w-0 rounded-2xl p-5 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>

              <div className="flex flex-col gap-5">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href, color, bg }, i) => (
                  <motion.div
                    key={label}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
                      whileHover={{ scale: 1.12, rotate: [0, -6, 6, 0], transition: { duration: 0.35 } }}
                    >
                      <Icon className={`${color} text-base`} aria-hidden="true" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          className={`text-sm font-semibold ${color} hover:underline transition-colors`}
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-gray-200">{value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div
                className="relative h-44 bg-[#13131f] flex items-center justify-center"
                aria-label="Institute location map placeholder"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                  }}
                  aria-hidden="true"
                />
                <div className="relative flex flex-col items-center gap-2 text-center px-4">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  >
                    <FaMapMarkerAlt className="text-violet-400 text-base" aria-hidden="true" />
                  </motion.div>
                  <p className="text-sm font-semibold text-gray-300">G.T.B, 33 Ft. Road, Near Children Valley School</p>
                  <p className="text-xs text-gray-500">Ludhiana, Punjab</p>
                </div>
              </div>
              <div className="p-4 border-t border-white/6">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                  aria-label="Open Google Maps to find us"
                >
                  <FaMapMarkerAlt aria-hidden="true" />
                  Get Directions on Google Maps
                </a>
              </div>
            </div>

            {/* Quick info pills */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Why Choose Instel?</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Free Demo Class',
                  'Flexible Batches',
                  'EMI Available',
                  'Job Assistance',
                  'Expert Faculty',
                  'Certificate Provided',
                ].map((pill, i) => (
                  <motion.span
                    key={pill}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-300 border border-violet-500/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.32, delay: 0.45 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.08, y: -1 }}
                  >
                    {pill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
