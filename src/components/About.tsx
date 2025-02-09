import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaUsers, FaGraduationCap } from "react-icons/fa";
import heroAbout from '../assets/heroAbout.svg';
import awareness from '../assets/awareness.svg';
import mentorship from '../assets/mentorship.svg'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-4">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        <motion.img
          src={heroAbout}
          alt="Empowering rural girls illustration"
          className="w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="max-w-2xl">
          <motion.h1
            className="text-4xl font-bold text-light-secondary dark:text-dark-secondary mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Why ShePath Exists
          </motion.h1>
          <motion.p
            className="text-lg text-justify leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Many girls in rural areas drop out of school not because they lack 
            potential, but because they lack support. Household duties, poverty, 
            and social norms push them away from education. ShePath is here to change that.
          </motion.p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl text-center font-bold text-light-secondary dark:text-dark-secondary mb-4">
          Our Mission
        </h2>
        <motion.p
          className="text-lg text-justify max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          We aim to tackle the education crisis among rural girls by developing 
          a platform that raises awareness, connects them to mentorship, and 
          provides access to basic education and available resources. 
          Our goal is to ensure that no girl is left behind.
        </motion.p>
      </div>

      <div className="mt-16 space-y-12">
        <div className="flex flex-col-reverse md:flex-row gap-8">
          <motion.img
            src={awareness}
            alt="Raising awareness illustration"
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="text-lg leading-relaxed max-w-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-light-secondary dark:text-dark-secondary mb-4">
              The Challenge
            </h2>
            <p className="text-justify">
              In many rural areas, girls are forced to abandon school. Poverty 
              makes education unaffordable, while societal norms push them into 
              household duties and early marriages. Parents, often struggling with 
              personal challenges, may not prioritize their childrens' education especially daughters.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col-reverse md:flex-row-reverse gap-8">
          <motion.img
            src={mentorship}
            alt="Mentorship and guidance illustration"
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="text-lg leading-relaxed max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-light-secondary dark:text-dark-secondary mb-4">
              How We Help
            </h2>
            <p className="text-justify">
              ShePath provides a safe space where girls can access mentorship, 
              educational resources, and tools that help them stay in school. 
              Our platform ensures they receive the guidance and knowledge 
              needed to build a better future.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-light-secondary dark:text-dark-secondary mb-8">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <FaHeart size={40} className="text-light-primary mx-auto" />
            <h3 className="text-xl font-bold mt-4">Awareness</h3>
            <p className="text-sm mt-2">
              Educating communities on the importance of girls’ education.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <FaUsers size={40} className="text-light-primary mx-auto" />
            <h3 className="text-xl font-bold mt-4">Mentorship</h3>
            <p className="text-sm mt-2">
              Connecting girls with role models and mentors who inspire them.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <FaGraduationCap size={40} className="text-light-primary mx-auto" />
            <h3 className="text-xl font-bold mt-4">Education</h3>
            <p className="text-sm mt-2">
              Providing access to reading materials, basic numeracy, and 
              financial literacy programs.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <motion.h3
          className="text-2xl font-bold text-light-secondary dark:text-dark-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Join Us in Empowering Girls
        </motion.h3>
        <p className="text-lg mt-4">
          Together, we can break barriers and ensure every girl has access to 
          quality education and mentorship. Join our mission today.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
