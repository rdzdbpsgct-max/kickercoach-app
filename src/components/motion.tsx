import { motion, AnimatePresence, type Variants } from "framer-motion";

// Staggered list container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// Staggered list item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// Fade in from below
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Scale on tap for buttons
export const tapScale = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Card hover effect
export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
};

// Re-export for convenience
export { motion, AnimatePresence };
