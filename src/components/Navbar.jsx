import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mainLogo from '../assets/Main logo.png';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Courses', href: '#courses' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Certificate', href: '/certificate', isRoute: true },
];

// === ANIMATION VARIANTS ===

// Navbar slides down from above on load
const navbarVariants = {
  hidden: { y: -72, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Logo entrance: subtle left-in spring
const logoVariants = {
  hidden: { x: -24, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
      delay: 0.15,
    },
  },
};

// Desktop nav links stagger in from top
const navLinkContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.25 },
  },
};

const navLinkVariants = {
  hidden: { y: -14, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Mobile menu: clip from top with opacity
const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    clipPath: 'inset(0% 0% 100% 0%)',
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0% 0% 100% 0%)',
    transition: {
      duration: 0.28,
      ease: [0.64, 0, 0.78, 0],
    },
  },
};

// Mobile menu items: stagger left-in
const mobileLinkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: (i) => ({
    opacity: 0,
    x: -12,
    transition: {
      delay: i * 0.03,
      duration: 0.18,
      ease: 'easeIn',
    },
  }),
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [activeSection, setActiveSection] = useState("home");

  // Handle scroll for navbar styling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle IntersectionObserver for active section highlighting on Home page
  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = ["home", "courses", "about", "contact"];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [isHomePage]);

  // Scroll to sections on Home, navigating there first when needed.
  const handleSectionNavClick = (href) => {
    setMenuOpen(false);
    if (!isHomePage) {
      navigate(`/${href}`);
      return;
    }

    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Lazy-loaded Home sections may mount shortly after the route changes.
  useEffect(() => {
    if (!isHomePage || !location.hash) return;

    const id = location.hash.slice(1);
    let attempts = 0;
    const scrollWhenReady = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (attempts++ < 20) window.setTimeout(scrollWhenReady, 50);
    };

    scrollWhenReady();
  }, [isHomePage, location.hash]);

  const handleNavClick = (link) => {
    setMenuOpen(false);
    if (!link.isRoute) {
      handleSectionNavClick(link.href);
    }
  };

  const getIsActive = (link) => {
    if (link.isRoute) {
      return location.pathname === link.href;
    } else {
      return isHomePage && activeSection === link.href.replace("#", "");
    }
  };

  return (
    <motion.header
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-[rgba(10,10,15,0.88)] backdrop-blur-xl border-b border-violet-500/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* === LOGO === */}
          <Link
            to="/#home"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 group"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Instel Computer Institute Home"
          >
            <motion.img
              src={mainLogo}
              alt="Instel Computer & Coaching Institute"
              className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-lg shadow-violet-500/20"
              whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
            />
          </Link>

          {/* === DESKTOP NAV === */}
          <motion.nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
            variants={navLinkContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {NAV_LINKS.map((link) => {
              const isActive = getIsActive(link);
              const NavComponent = link.isRoute ? Link : motion.a;

              return (
                <NavComponent
                  key={link.label}
                  to={link.isRoute ? link.href : undefined}
                  href={link.isRoute ? undefined : link.href}
                  onClick={(e) => {
                    if (!link.isRoute) e.preventDefault();
                    handleNavClick(link);
                  }}
                  variants={navLinkVariants}
                  className={`relative text-sm font-medium transition-colors duration-200 group ${
                    isActive ? "text-violet-400" : "text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {/*
                    Underline: scaleX from left=0 to full on hover
                    Active state: always full width
                  */}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transition-transform duration-300 origin-left w-full ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden="true"
                  />
                </NavComponent>
              );
            })}

            {/* CTA button */}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick({ href: '#contact', isRoute: false }); }}
              variants={navLinkVariants}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow duration-300"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              Join Now
            </motion.a>
          </motion.nav>

          {/* === MOBILE HAMBURGER === */}
          <motion.button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
            onClick={() => setMenuOpen((prev) => !prev)}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* === MOBILE MENU — clip-path slide from top === */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden bg-[rgba(10,10,15,0.96)] backdrop-blur-xl border-t border-violet-500/10"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = getIsActive(link);
                const NavComponent = link.isRoute ? Link : motion.a;

                return (
                  <NavComponent
                  key={link.label}
                  to={link.isRoute ? link.href : undefined}
                  href={link.isRoute ? undefined : link.href}
                  onClick={(e) => {
                    if (!link.isRoute) e.preventDefault();
                    handleNavClick(link);
                  }}
                  custom={i}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-violet-400 bg-violet-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  </NavComponent>
                );
              })}

              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick({ href: "#contact", isRoute: false }); }}
                custom={NAV_LINKS.length -1}
                variants={mobileLinkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-2 px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg"
              >
                Join Now
              </motion.a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
