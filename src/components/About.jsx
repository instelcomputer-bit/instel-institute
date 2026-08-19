import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  FaGraduationCap,
  FaBook,
  FaAward,
  FaStar,
  FaCheckCircle,
} from 'react-icons/fa';
import mainLogo from '../assets/Main logo.png';

const STATS = [
  { icon: FaGraduationCap, value: 500, suffix: '+', label: 'Students Trained',  color: 'from-violet-500 to-purple-500',      glow: 'rgba(139,92,246,0.3)'   },
  { icon: FaBook,          value: 10,  suffix: '+', label: 'Courses Available', color: 'from-purple-500 to-pink-500',   glow: 'rgba(168,85,247,0.3)'  },
  { icon: FaAward,         value: 5,   suffix: '+', label: 'Years Experience',  color: 'from-emerald-500 to-violet-500', glow: 'rgba(16,185,129,0.3)'  },
  { icon: FaStar,          value: 98,  suffix: '%', label: 'Placement Rate',    color: 'from-yellow-500 to-orange-500', glow: 'rgba(234,179,8,0.3)'   },
];

const HIGHLIGHTS = [
  'Expert faculty with industry experience',
  'Modern computer labs with latest software',
  'Government-recognized certificate programs',
  'Flexible batch timings for all age groups',
  'Personal attention with small batch sizes',
  'Post-course placement assistance',
];

// === ANIMATION VARIANTS ===

// Left column: slides in from the left
const fadeInLeft = {
  hidden: { opacity: 0, x: -56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

// Right column: slides in from the right
const fadeInRight = {
  hidden: { opacity: 0, x: 56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Stat card spring lift
const statCardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 240,
      damping: 22,
    },
  },
};

// Heavy wobble for stats
const heavyWobble = {
  animate: {
    y: [0, -4, 4, -4, 0],
    x: [0, 2, -2, 2, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

/**
 * AnimatedCounter — counts from 0 to target using a spring motion value.
 * Triggers only when scrolled into view (once).
 */
function AnimatedCounter({ target, suffix }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Raw motion value for the number
  const raw = useMotionValue(0);
  // Spring it for an eased, slightly overshooting finish
  const springVal = useSpring(raw, { stiffness: 60, damping: 18, mass: 1 });

  useEffect(() => {
    if (!isInView) return;
    // Trigger the spring by setting the target
    raw.set(target);
  }, [isInView, target, raw]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (v) => {
      setDisplayValue(Math.min(Math.round(v), target));
    });
    return unsubscribe;
  }, [springVal, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}{suffix}
    </span>
  );
}

/**
 * StatCard — stat with icon, spring counter, label, and hover lift
 */
function StatCard({ stat, index }) {
  const { icon: Icon, value, suffix, label, color, glow } = stat;

  return (
    <motion.div
      variants={statCardVariant}
      custom={index}
      animate={heavyWobble.animate}
      whileHover={{
        y: -6,
        boxShadow: `0 12px 28px ${glow}`,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      className="relative group glass-card rounded-2xl p-6 text-center transition-colors duration-300 cursor-default"
      style={{ animationDelay: `${index * 0.5}s` }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${glow.replace('0.3', '0.07')}, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* Icon */}
      <motion.div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-3 mx-auto`}
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1, transition: { duration: 0.4 } }}
      >
        <Icon className="text-white text-xl" aria-hidden="true" />
      </motion.div>

      {/* Counter */}
      <div className="text-3xl font-black gradient-text mb-1">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>

      {/* Label */}
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </motion.div>
  );
}

export default function About() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, margin: '-80px' });
  const rightInView = useInView(rightRef, { once: true, margin: '-80px' });

  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 bg-[#0a0a0f] overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Heavy background blobs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full pointer-events-none heavy-blur morph-blob heavy-glow" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full pointer-events-none heavy-blur morph-blob" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '1.5s' }} />

      {/* Background decoration */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-0 w-64 h-64 rounded-full -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* === LEFT — Text Content (slide in from left) === */}
          <motion.div
            ref={leftRef}
            variants={fadeInLeft}
            initial="hidden"
            animate={leftInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            <div>
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-violet-400 border border-violet-500/30 bg-violet-500/8 mb-4"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={leftInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                Who We Are
              </motion.span>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight"
              >
                About <span className="gradient-text">Instel Computer</span> Institute
              </h2>
            </div>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              We are a leading computer education institute dedicated to providing
              quality IT education to students of all backgrounds. Our expert faculty
              and modern labs ensure the best learning experience, preparing students
              for the demands of today's digital workforce.
            </p>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Founded with the mission to bridge the digital divide, Instel Computer
              Institute has been transforming lives through technology education.
              Whether you're a student, homemaker, or working professional — we have
              a course tailored for you.
            </p>

            {/* === HIGHLIGHTS — staggered checklist === */}
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate={leftInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              aria-label="Institute highlights"
            >
              {HIGHLIGHTS.map((item) => (
                <motion.li
                  key={item}
                  variants={itemVariant}
                  className="flex items-start gap-2.5 text-sm text-gray-400"
                >
                  <motion.span
                    whileInView={{ scale: [0, 1.25, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, ease: 'backOut' }}
                  >
                    <FaCheckCircle
                      className="text-violet-400 mt-0.5 flex-shrink-0 text-base"
                      aria-hidden="true"
                    />
                  </motion.span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <motion.button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Get admission at Instel"
              >
                Get Admission
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 text-sm font-bold text-violet-400 border border-violet-500/40 rounded-xl hover:bg-violet-500/8 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Browse courses offered"
              >
                Browse Courses
              </motion.button>
            </div>
          </motion.div>

          {/* === RIGHT — Stats Grid + Decorative Panel (slide in from right) === */}
          <motion.div
            ref={rightRef}
            variants={fadeInRight}
            initial="hidden"
            animate={rightInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-8"
          >
            {/* Decorative institute card */}
            <motion.div
              className="relative glass-card rounded-2xl p-6 sm:p-8 overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={rightInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(139,92,246,0.08), transparent 60%)' }}
                aria-hidden="true"
              />
              <div className="relative flex items-start gap-4">
                <motion.img
                  src={mainLogo}
                  alt="Instel Computer & Coaching Institute"
                  className="flex-shrink-0 w-16 h-16 rounded-xl object-cover shadow-lg shadow-violet-500/25"
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08, transition: { duration: 0.4 } }}
                />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Instel Computer Institute</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Affiliated with leading certification bodies, our programs are
                    recognized by government and private sector employers alike.
                  </p>
                </div>
              </div>

              <div className="relative mt-6 pt-6 border-t border-white/6 flex flex-wrap gap-3">
                {['ISO Certified', 'Govt. Recognized', 'Since 2019', 'Expert Faculty'].map((badge, i) => (
                  <motion.span
                    key={badge}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 text-gray-300 border border-white/8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={rightInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.06, borderColor: 'rgba(139,92,246,0.4)' }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* === STATS GRID — stagger with spring counter === */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={rightInView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 gap-4"
              aria-label="Institute statistics"
            >
              {STATS.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
