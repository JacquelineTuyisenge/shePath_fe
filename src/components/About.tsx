import { motion } from "framer-motion";
import { FaHeart, FaUsers, FaGraduationCap } from "react-icons/fa";
import heroAbout from '../assets/heroAbout.svg';
import awareness from '../assets/awareness.svg';
import mentorship from '../assets/mentorship.svg';
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div id="about" className="min-h-screen m-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-4">
      {/* Hero Section */}
      <div className="w-full gap-2 p-2 flex flex-col md:flex-row items-center justify-between">
        <motion.img
          src={heroAbout}
          alt={t('empowering Rural Girls image')}
          className="md:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div
          className="md:w-1/2 text-lg leading-relaxed" 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-light-secondary dark:text-dark-secondary mb-4">
            {t('why_shepath_exists')}
          </h1>
          <p className="text-lg md:text-xl text-justify leading-relaxed">
            {t('why_shepath_exists_desc')}
          </p>
        </motion.div>
      </div>

      {/* The Challenge Section */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8">
        <motion.img
          src={awareness}
          alt={t('the_challenge')}
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
          <h2 className="text-2xl md:text-3xl font-bold text-light-secondary dark:text-dark-secondary mb-4">
            {t('the_challenge')}
          </h2>
          <p className="text-justify md:text-xl">
            {t('the_challenge_desc')}
          </p>
        </motion.div>
      </div>

      {/* How We Help Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.img
          src={mentorship}
          alt={t('how_we_help')}
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
          <h2 className="text-2xl md:text-3xl font-bold text-light-secondary dark:text-dark-secondary mb-4">
            {t('how_we_help')}
          </h2>
          <p className="text-justify md:text-xl">
            {t('how_we_help_desc')}
          </p>
        </motion.div>
      </div>
      {/* What We Offer */}
      <div className="mt-16">
        <h2 className="text-3xl text-center font-bold text-light-secondary dark:text-dark-secondary mb-8">
          {t('what_we_offer')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ icon: FaHeart, title: 'awareness', desc: 'awareness_desc' },
            { icon: FaUsers, title: 'mentorship', desc: 'mentorship_desc' },
            { icon: FaGraduationCap, title: 'education', desc: 'education_desc' }]
            .map((offer, index) => (
              <motion.div
                key={index}
                className="p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              >
                <offer.icon size={40} className="text-light-primary mx-auto" />
                <h3 className="text-xl md:text-2xl text-center font-bold mt-4">{t(offer.title)}</h3>
                <p className="mt-2">
                  {t(offer.desc)}
                </p>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Join Us */}
      <div className="mt-16">
        <motion.h3
          className="text-3xl text-center font-bold text-light-secondary dark:text-dark-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {t('join_us')}
        </motion.h3>
        <p className="text-xl text-justify mt-4">
          {t('join_us_desc')}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
