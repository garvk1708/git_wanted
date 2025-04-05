import { motion } from "framer-motion";

const features = [
  {
    title: "GitHub Integration",
    description:
      "Connect your GitHub account for seamless repository and issue management. Import issues directly from your repos.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-primary-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
        />
      </svg>
    ),
  },
  {
    title: "Blockchain Payments",
    description:
      "Fund and receive bounty payments using Ethereum. Secure escrow system ensures fair compensation for completed work.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-primary-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    title: "Dual Role System",
    description:
      "Use the platform as either a bounty creator or solver. Switch between roles seamlessly based on your needs.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-primary-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Features() {
  return (
    <section className="py-16 px-4 bg-dark-900/50" id="features">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="bg-primary-500/20 text-primary-400 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">How GitWanted Works</h2>
          <p className="text-dark-200 max-w-2xl mx-auto">A decentralized platform that connects repository maintainers with developers through incentivized open source contributions.</p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-dark-800/30 border border-dark-700 rounded-xl p-6 transition-all duration-300 hover:border-primary-500/50 hover:translate-y-[-5px]"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-heading">{feature.title}</h3>
              <p className="text-dark-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
