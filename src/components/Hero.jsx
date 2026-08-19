import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaLaptop,
  FaDatabase,
  FaKeyboard,
  FaShieldAlt,
  FaChartBar,
  FaChevronDown,
} from 'react-icons/fa';
import mainLogo from '../assets/Main logo.png';
import heroRobot from '../assets/hero-robot.png';

const MainLogoMark = () => (
  <img
    src={mainLogo}
    alt=""
    className="w-8 h-8 rounded-md object-cover opacity-40"
    aria-hidden="true"
  />
);

// === HEAVY PARTICLE SYSTEM ===
const PARTICLE_COUNT = 50;
const generateParticles = () =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 15 + 5,
    duration: Math.random() * 20 + 25,
    delay: Math.random() * 20,
    color:
      i % 3 === 0
        ? 'bg-white/10'
        : i % 3 === 1
        ? 'bg-white/8'
        : 'bg-white/6',
  }));

function HeavyParticles() {
  const [particles] = useState(generateParticles);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`heavy-particle ${p.color}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s, 3s`,
            animationDelay: `${p.delay}s, ${p.delay * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

// === FLOATING ICON DATA ===
const FLOATING_ICONS = [
  { Icon: FaCode,      top: '15%', left: '8%',   delay: 0,    durScale: 6,  size: 'text-2xl', color: 'text-white/20',    floatY: -18, floatR: 6  },
  { Icon: FaLaptop,    top: '25%', right: '7%',  delay: 1,    durScale: 7,  size: 'text-3xl', color: 'text-white/15',    floatY: 16,  floatR: -5 },
  { Icon: FaDatabase,  top: '60%', left: '5%',   delay: 0.5,  durScale: 9,  size: 'text-2xl', color: 'text-white/12',    floatY: -12, floatR: 4  },
  { Icon: FaKeyboard,  top: '70%', right: '6%',  delay: 1.5,  durScale: 6,  size: 'text-3xl', color: 'text-white/18',    floatY: 14,  floatR: -6 },
  { Icon: FaShieldAlt, top: '40%', left: '3%',   delay: 2,    durScale: 7,  size: 'text-xl',  color: 'text-white/10',    floatY: -16, floatR: 5  },
  { Icon: FaChartBar,  top: '80%', left: '15%',  delay: 0.8,  durScale: 9,  size: 'text-2xl', color: 'text-white/14',    floatY: 10,  floatR: -3 },
  { Icon: MainLogoMark, top: '20%', left: '20%', delay: 1.2,  durScale: 6,  size: 'text-xl',  color: 'text-white/8',     floatY: -14, floatR: 7  },
  { Icon: FaCode,      top: '55%', right: '12%', delay: 0.3,  durScale: 9,  size: 'text-xl',  color: 'text-white/10',    floatY: 12,  floatR: -4 },
];

// === HEADLINE WORDS ===
const HEADLINE_LINE_1 = ['Improve', 'Your', 'Skills'];
const HEADLINE_LINE_2 = ['With', 'Technology'];

// === ANIMATION VARIANTS ===
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

// Word reveal: clips up from a mask — cinematic line-by-line feel
const wordVariant = {
  hidden: { opacity: 0, y: '110%', rotateX: -20 },
  visible: {
    opacity: 1,
    y: '0%',
    rotateX: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Line 2 words stagger independently but start after line 1 finishes
const line2ContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: HEADLINE_LINE_1.length * 0.12 + 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// Spring-loaded CTA buttons
const ctaButtonVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
      mass: 0.9,
    },
  },
};

const ctaContainerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: (HEADLINE_LINE_1.length + HEADLINE_LINE_2.length) * 0.12 + 0.65,
    },
  },
};

const statsVariant = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Badge
const badgeVariant = {
  hidden: { opacity: 0, scale: 0.88, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const handleEnroll = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewCourses = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeavyParticles />
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]"
      aria-label="Hero section"
    >
      {/* === BACKGROUND GRADIENT BLOBS === */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none pulse-glow heavy-blur morph-blob"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none pulse-glow heavy-blur morph-blob"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animationDelay: '1.5s',
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
        aria-hidden="true"
      />

      {/* === GRID OVERLAY === */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden="true" />

      {/* === FLOATING TECH ICONS (Framer Motion continuous float) === */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {FLOATING_ICONS.map(({ Icon, top, left, right, delay, durScale, size, color, floatY, floatR }, i) => (
          <motion.div
            key={i}
            className={`absolute ${size} ${color}`}
            style={{ top, left, right }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, floatY, 0],
              rotate: [0, floatR, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: delay + 0.8 },
              scale: { duration: 0.6, delay: delay + 0.8 },
              y: {
                duration: durScale,
                delay: delay + 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: durScale * 1.1,
                delay: delay + 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <Icon />
          </motion.div>
        ))}
      </div>

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-24 lg:py-20 grid grid-cols-[1.08fr_0.92fr] items-center gap-2 sm:gap-6 text-left">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-4 sm:gap-6 min-w-0"
        >
          {/* --- BADGE --- */}
          <motion.div variants={badgeVariant}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-violet-400 border border-violet-500/30 bg-violet-500/8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
              Admissions Open — Limited Seats Available
            </span>
          </motion.div>

          {/* --- CINEMATIC WORD-BY-WORD HEADLINE --- */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight max-w-3xl"
            aria-label="Improve Your Skills With Technology"
          >
            {/* Line 1: white words */}
            <span className="block text-white" aria-hidden="true">
              <motion.span
                className="inline-flex flex-wrap justify-start gap-x-[0.3em]"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {HEADLINE_LINE_1.map((word, i) => (
                  <span key={i} className="overflow-hidden inline-block" style={{ perspective: '600px' }}>
                    <motion.span
                      className="inline-block"
                      variants={wordVariant}
                      custom={i}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.span>
            </span>

            {/* Line 2: gradient words */}
            <span className="block gradient-text mt-1" aria-hidden="true">
              <motion.span
                className="inline-flex flex-wrap justify-start gap-x-[0.3em]"
                variants={line2ContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {HEADLINE_LINE_2.map((word, i) => (
                  <span key={i} className="overflow-hidden inline-block" style={{ perspective: '600px' }}>
                    <motion.span
                      className="inline-block"
                      variants={wordVariant}
                      custom={i}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.span>
            </span>
          </h1>

          {/* --- SUBHEADLINE --- */}
          <motion.p
            variants={fadeInUp}
            className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed"
          >
            <strong className="text-gray-200">Instel Computer Institute</strong> — Learn, Grow, Succeed.
            Professional IT education with expert faculty, modern labs, and placement support.
          </motion.p>

          {/* --- CTA BUTTONS (spring slide-up, staggered) --- */}
          <motion.div
            variants={ctaContainerVariant}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2"
          >
            <motion.button
              variants={ctaButtonVariant}
              onClick={handleEnroll}
              className="relative overflow-hidden px-4 sm:px-8 py-2.5 sm:py-4 text-xs sm:text-base font-bold text-white rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow duration-300"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Join Now — get admission"
            >
              {/* Shimmer sweep on hover */}
              <span
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] pointer-events-none"
                aria-hidden="true"
              />
              Join Now
            </motion.button>

            <motion.button
              variants={ctaButtonVariant}
              onClick={handleViewCourses}
              className="px-4 sm:px-8 py-2.5 sm:py-4 text-xs sm:text-base font-bold text-violet-400 rounded-xl border border-violet-500/40 bg-violet-500/5 hover:bg-violet-500/12 hover:border-violet-400/60 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
              aria-label="View our available courses"
            >
              View Courses
            </motion.button>
          </motion.div>

          {/* --- STATS ROW --- */}
          <motion.div
            variants={statsVariant}
            className="hidden sm:flex flex-wrap justify-start gap-4 lg:gap-8 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/8"
          >
            {[
              { value: '500+', label: 'Students Trained' },
              { value: '10+', label: 'Courses' },
              { value: '5+', label: 'Years Experience' },
              { value: '98%', label: 'Placement Rate' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black gradient-text">{value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* === ANIMATED ROBOT === */}
        <motion.div
          className="relative mx-auto w-full max-w-[260px] sm:max-w-[420px] lg:max-w-[590px]"
          initial={{ opacity: 0, x: 70, scale: 0.88 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Friendly educational robot"
        >
          <div
            className="absolute inset-[12%] rounded-full bg-violet-500/20 blur-3xl"
            aria-hidden="true"
          />
          <motion.img
            src={heroRobot}
            alt="Friendly educational robot holding a tablet"
            className="relative z-10 w-full max-h-[620px] object-contain drop-shadow-[0_25px_55px_rgba(139,92,246,0.3)]"
            animate={{
              x: [-8, 8, -8],
              rotateY: [-7, 7, -7],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '50% 28%' }}
          />
        </motion.div>
      </div>

      {/* === SCROLL INDICATOR === */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6, ease: 'easeOut' }}
        onClick={handleViewCourses}
        aria-label="Scroll down to courses"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleViewCourses()}
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <FaChevronDown aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
    </>
  );
}
