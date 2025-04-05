import { Variants } from "framer-motion";

/**
 * Animation variants for page transitions
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

/**
 * Animation variants for container elements with staggered children
 */
export const containerVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { 
    opacity: 0,
    transition: { 
      staggerChildren: 0.05, 
      staggerDirection: -1 
    } 
  }
};

/**
 * Animation variants for child items in a staggered container
 */
export const itemVariants: Variants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Animation for fade in elements
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

/**
 * Animation for elements that slide in from the bottom
 */
export const slideUp: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

/**
 * Animation for elements that slide in from the left
 */
export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

/**
 * Animation for elements that slide in from the right
 */
export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

/**
 * Animation for card hover effects
 */
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: "0 0 0 rgba(99, 102, 241, 0)"
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

/**
 * Animation for floating effect (continuous)
 */
export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

/**
 * Animation for typing text effect
 */
export const typingVariants: Variants = {
  hidden: { width: "0%" },
  visible: {
    width: "100%",
    transition: {
      duration: 3.5,
      ease: "easeInOut"
    }
  }
};

/**
 * Animation for pulsing glow effect
 */
export const glowPulse: Variants = {
  initial: {
    boxShadow: "0 0 5px rgba(99, 102, 241, 0.5)"
  },
  animate: {
    boxShadow: ["0 0 5px rgba(99, 102, 241, 0.5)", "0 0 20px rgba(99, 102, 241, 0.8)", "0 0 5px rgba(99, 102, 241, 0.5)"],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

/**
 * Animation for bouncing effect
 */
export const bounce: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2
    }
  }
};
