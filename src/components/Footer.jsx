import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaHeart,
} from 'react-icons/fa';
import mainLogo from '../assets/Main logo.png';

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Courses', href: '#courses' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const SOCIAL_LINKS = [
  { icon: FaFacebook,  label: 'Facebook',  href: 'https://facebook.com',            color: 'hover:text-blue-400',    hoverBg: 'hover:bg-blue-400/10',    hoverShadow: '0 0 16px rgba(59,130,246,0.4)'  },
  { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/instel_computer_institute/', color: 'hover:text-pink-400',    hoverBg: 'hover:bg-pink-400/10',    hoverShadow: '0 0 16px rgba(236,72,153,0.4)'  },
  { icon: FaWhatsapp,  label: 'WhatsApp',  href: 'https://wa.me/916239864548',                         color: 'hover:text-emerald-400', hoverBg: 'hover:bg-emerald-400/10', hoverShadow: '0 0 16px rgba(52,211,153,0.4)'  },
  { icon: FaYoutube,   label: 'YouTube',   href: 'https://youtube.com',             color: 'hover:text-red-400',     hoverBg: 'hover:bg-red-400/10',     hoverShadow: '0 0 16px rgba(239,68,68,0.4)'   },
];

const COURSES_LIST = [
  'ADCA',
  'DCA',
  'DTP & Graphic Designing',
  'Basic & Advance Computer',
  'Tally Prime + Accounting',
  'Basic Computer & Internet',
  'Web Designing & AI',
  'Editing (Canva, Photoshop)',
];

const handleNavClick = (href) => {
  const id = href.replace('#', '');
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// === ANIMATION VARIANTS ===

// Footer columns stagger in when scrolled into view
const footerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const footerColumnVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Links: slide-up reveal from a mask — staggered
const linkContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const linkVariant = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Bottom bar fade
const bottomBarVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-60px' });

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0a0a0f] border-t border-white/6"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top gradient border */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === MAIN FOOTER GRID === */}
        <motion.div
          variants={footerContainerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid min-w-0 grid-cols-1 gap-9 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-4 lg:gap-10"
        >

          {/* === BRAND COLUMN === */}
          <motion.div
            variants={footerColumnVariants}
            className="lg:col-span-1 flex flex-col gap-5"
          >
            <motion.a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="flex items-center gap-2 group w-fit"
              aria-label="Instel Computer Coaching Institute Home"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.img
                src={mainLogo}
                alt="Instel Computer Coaching Institute"
                className="w-12 h-12 rounded-lg object-cover shadow-lg shadow-violet-500/25"
                whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
              />
            </motion.a>

            <p className="break-words text-sm leading-relaxed text-gray-500">
              Empowering students through practical computer classes in Ludhiana.
              Your trusted partner for IT education and career growth.
            </p>

            {/* === SOCIAL ICONS — bounce on hover === */}
            <div className="flex items-center gap-2" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, color, hoverBg, hoverShadow }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 border border-white/8 transition-all duration-200 ${color} ${hoverBg}`}
                  whileHover={{
                    scale: 1.18,
                    y: -4,
                    boxShadow: hoverShadow,
                    transition: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 12,
                    },
                  }}
                  whileTap={{ scale: 0.9, y: 0 }}
                  aria-label={`Follow us on ${label}`}
                >
                  <Icon className="text-sm" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* === QUICK LINKS — slide-up staggered === */}
          <motion.div variants={footerColumnVariants}>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <motion.ul
                className="flex flex-col gap-3"
                variants={linkContainerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {QUICK_LINKS.map(({ label, href }) => (
                  <motion.li key={label} variants={linkVariant}>
                    <a
                      href={href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                      className="text-sm text-gray-500 hover:text-violet-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <motion.span
                        className="w-1 h-1 rounded-full bg-violet-500/50 group-hover:bg-violet-400 transition-colors"
                        whileHover={{ scale: 1.6 }}
                        aria-hidden="true"
                      />
                      {label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>
          </motion.div>

          {/* === COURSES LIST — slide-up staggered === */}
          <motion.div variants={footerColumnVariants}>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Our Courses</h3>
            <motion.ul
              className="flex flex-col gap-3"
              aria-label="Course list"
              variants={linkContainerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {COURSES_LIST.map((course) => (
                <motion.li key={course} variants={linkVariant}>
                  <a
                    href="#courses"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#courses'); }}
                    className="text-sm text-gray-500 hover:text-violet-400 transition-colors duration-200 flex items-center gap-2 group"
                    aria-label={`Learn more about ${course}`}
                  >
                    <motion.span
                      className="w-1 h-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors"
                      whileHover={{ scale: 1.6 }}
                      aria-hidden="true"
                    />
                    {course}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* === CONTACT INFO === */}
          <motion.div variants={footerColumnVariants}>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Get in Touch</h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  label: 'Address',
                  content: <p className="text-sm text-gray-400">4410, Guru Teg Bahadur Singh Nagar, Ludhiana, Punjab, India, 141015</p>,
                },
                {
                  label: 'Contact – Rohit',
                  content: (
                    <a href="tel:+916239864548" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                      +91 6239864548
                    </a>
                  ),
                },
                {
                  label: 'Email',
                  content: (
                    <a href="mailto:instelcomputer@gmail.com" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                      instelcomputer@gmail.com
                    </a>
                  ),
                },
                {
                  label: 'Hours',
                  content: <p className="text-sm text-gray-400">Mon – Sat  |  7 AM – 11 AM  &  3 PM – 8 PM</p>,
                },
              ].map(({ label, content }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 14 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">{label}</p>
                  {content}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* === BOTTOM BAR === */}
        <motion.div
          variants={bottomBarVariant}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="py-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-gray-600 text-center sm:text-left">
            &copy; {currentYear} Instel Computer Coaching Institute. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            Made with
            <motion.span
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            >
              <FaHeart className="text-red-500/80 text-xs" aria-label="love" />
            </motion.span>
            for students
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
