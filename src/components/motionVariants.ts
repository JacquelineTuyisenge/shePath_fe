export const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay: 0.2 },
  };
  
  export const fadeInLeft = {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 1 },
    viewport: { once: true },
  };
  
  export const fadeInRight = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 1 },
    viewport: { once: true },
  };
  
  export const buttonHover = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  };
  
  export const slideInFromRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  