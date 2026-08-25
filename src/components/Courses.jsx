import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FaGraduationCap,
  FaLaptop,
  FaPaintBrush,
  FaDesktop,
  FaCalculator,
  FaGlobe,
  FaCode,
  FaImage,
} from 'react-icons/fa';

const COURSES = [
  {
    id: 1,
    icon: FaGraduationCap,
    title: 'ADCA',
    subtitle: 'Advance Diploma in Computer Application',
    description:
      'Comprehensive advanced diploma covering MS Office, Tally, DTP, programming basics, internet, and project work. Best for career-ready students.',
    duration: '15 Months',
    level: 'Advanced',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.25)',
    glowBorder: 'rgba(139,92,246,0.5)',
  },
  {
    id: 2,
    icon: FaLaptop,
    title: 'DCA',
    subtitle: 'Diploma in Computer Application',
    description:
      'Complete diploma program covering MS Office, internet, basic programming, and practical computer skills for job and government exams.',
    duration: '12 Months',
    level: 'Intermediate',
    color: 'from-blue-500 to-violet-500',
    glow: 'rgba(59,130,246,0.25)',
    glowBorder: 'rgba(59,130,246,0.5)',
  },
  {
    id: 3,
    icon: FaPaintBrush,
    title: 'DTP & Graphic Designing',
    subtitle: 'Photoshop, CorelDraw & Page Layout',
    description:
      'Master desktop publishing and graphic design. Learn photo editing, logo creation, poster design, and professional print media layout.',
    duration: '6 Months',
    level: 'Intermediate',
    color: 'from-orange-500 to-red-500',
    glow: 'rgba(249,115,22,0.25)',
    glowBorder: 'rgba(249,115,22,0.5)',
  },
  {
    id: 4,
    icon: FaDesktop,
    title: 'Basic & Advance Computer',
    subtitle: 'Fundamentals to Advanced Skills',
    description:
      'Start from basics and go up to advanced computer usage — MS Office, file management, internet, and productivity tools.',
    duration: '3 Months',
    level: 'Beginner',
    color: 'from-purple-500 to-blue-500',
    glow: 'rgba(14,165,233,0.25)',
    glowBorder: 'rgba(14,165,233,0.5)',
  },
  {
    id: 5,
    icon: FaCalculator,
    title: 'Tally Prime + Accounting',
    subtitle: 'GST, Payroll & Financial Management',
    description:
      'Learn Tally Prime with complete accounting concepts, GST filing, inventory management, payroll, and financial reporting.',
    duration: '4 Months',
    level: 'Intermediate',
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(168,85,247,0.25)',
    glowBorder: 'rgba(168,85,247,0.5)',
  },
  {
    id: 6,
    icon: FaGlobe,
    title: 'Basic Computer & Internet',
    subtitle: 'Digital Literacy & Online Skills',
    description:
      'Build a strong foundation in computer basics, internet browsing, email, online forms, and safe digital communication.',
    duration: '2 Months',
    level: 'Beginner',
    color: 'from-violet-500 to-teal-500',
    glow: 'rgba(139,92,246,0.25)',
    glowBorder: 'rgba(139,92,246,0.5)',
  },
  {
    id: 7,
    icon: FaCode,
    title: 'Web Designing & Deployment',
    subtitle: 'HTML, CSS, JavaScript & AI Tools',
    description:
      'Design and deploy modern websites using HTML, CSS, JavaScript, and AI-powered tools. Learn hosting, domain setup, and live deployment.',
    duration: '6 Months',
    level: 'Intermediate',
    color: 'from-emerald-500 to-green-500',
    glow: 'rgba(16,185,129,0.25)',
    glowBorder: 'rgba(16,185,129,0.5)',
  },
  {
    id: 8,
    icon: FaImage,
    title: 'Editing & Design Tools',
    subtitle: 'Canva, Adobe Photoshop & CorelDraw',
    description:
      'Learn professional editing and design using Canva, Adobe Photoshop, and CorelDraw. Create social media graphics, banners, and creative content.',
    duration: '3 Months',
    level: 'Beginner',
    color: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.25)',
    glowBorder: 'rgba(244,63,94,0.5)',
  },
];

// === ANIMATION VARIANTS ===
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

// Cards slide up with a slight overshoot — premium spring feel
const cardVariants = {
  hidden: { opacity: 0, y: 56, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const iconVariants = {
  hidden: { scale: 0.7, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 18,
      delay: 0.1,
    },
  },
};

/**
 * CourseCard — premium hover: lift + cyan glow border + scale 1.03
 */
const CourseCard = ({ course }) => {
  const { title, subtitle, description, duration, level, color, glow, glowBorder } = course;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.03,
        transition: {
          y: { type: 'spring', stiffness: 300, damping: 20 },
          scale: { duration: 0.25, ease: 'easeOut' },
        },
      }}
      className="relative group min-w-0 rounded-2xl p-5 sm:p-6 glass-card transition-shadow duration-300 cursor-pointer overflow-hidden"
      style={{
        '--glow-border': glowBorder,
      }}
    >
      {/* Hover: glowing border via box-shadow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          boxShadow: `0 0 0 1.5px ${glowBorder}, 0 8px 32px ${glow}, 0 0 40px ${glow}`,
        }}
        aria-hidden="true"
      />

      {/* Hover glow radial overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none"
        style={{ background: `radial-gradient(circle at top left, ${glow}, transparent 65%)` }}
        aria-hidden="true"
      />

      {/* === ICON with spring entrance === */}
      <motion.div
        variants={iconVariants}
        className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4`}
      >
        <course.icon className="text-white text-2xl" aria-hidden="true" />
        {/* Icon inner glow on card hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${glow}, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* === CONTENT === */}
      <div className="relative">
        <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-violet-300 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
        <p className="text-sm text-gray-400 leading-relaxed mb-4">{description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {duration}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {level}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Certificate
          </span>
        </div>
      </div>

      {/* Bottom accent line — slides in from left on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color} scale-x-0 group-hover:scale-x-100 transition-transform duration-350 origin-left`}
        aria-hidden="true"
      />
    </motion.article>
  );
};

export default function Courses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="courses"
      className="relative py-20 sm:py-28 bg-[#0f0f1a] overflow-hidden"
      aria-labelledby="courses-heading"
    >
      {/* Heavy background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none heavy-blur morph-blob heavy-glow" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none heavy-blur morph-blob" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '2s' }} />

      {/* Background decoration */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === SECTION HEADER === */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={headingVariants}
          className="text-center mb-14"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-400 border border-purple-500/30 bg-purple-500/8 mb-4"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            What We Offer
          </motion.span>
          <h2
            id="courses-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
          >
            Our <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore practical computer courses in Ludhiana designed to make you job-ready. Each
            course comes with hands-on practice, expert guidance, and a recognized certificate.
          </p>
        </motion.div>

        {/* === STAGGERED CARD GRID === */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          role="list"
          aria-label="Available courses"
        >
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </motion.div>

        {/* === BOTTOM CTA === */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm mb-4">
            All courses include a government-recognized certificate upon completion.
          </p>
          <motion.button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Apply for admission"
          >
            Apply for Admission
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
