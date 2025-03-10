import { motion } from "framer-motion";
import { FaHeart, FaUsers, FaGraduationCap } from "react-icons/fa";
import heroAbout from '../assets/heroAbout.svg';
import awareness from '../assets/awareness.svg';
import mentorship from '../assets/mentorship.svg';
import Footer from "./Footer";
import BackButton from "../buttons/Back";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-4">
      {location.pathname === "/about" && <BackButton />}

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        <motion.img
          src={heroAbout}
          alt={t('empowering Rural Girls image')}
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
            {t('why_shepath_exists')}
          </motion.h1>
          <motion.p
            className="text-lg text-justify leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {t('why_shepath_exists_desc')}
          </motion.p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl text-center font-bold text-light-secondary dark:text-dark-secondary mb-4">
          {t('mission')}
        </h2>
        <motion.p
          className="text-lg text-justify max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {t('mission_desc')}
        </motion.p>
      </div>

      <div className="mt-16 space-y-12">
        <div className="flex flex-col-reverse md:flex-row gap-8">
          <motion.img
            src={awareness}
            alt={t('awareness')}
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
              {t('the_challenge')}
            </h2>
            <p className="text-justify">
              {t('the_challenge_desc')}
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col-reverse md:flex-row-reverse gap-8">
          <motion.img
            src={mentorship}
            alt={t('mentorship')}
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
              {t('how_we_help')}
            </h2>
            <p className="text-justify">
              {t('how_we_help_desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-light-secondary dark:text-dark-secondary mb-8">
          {t('what_we_offer')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
          >
            <FaHeart size={40} className="text-light-primary mx-auto" />
            <h3 className="text-xl font-bold mt-4">{t('awareness')}</h3>
            <p className="text-sm mt-2">
              {t('awareness_desc')}
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
          >
            <FaUsers size={40} className="text-light-primary mx-auto" />
            <h3 className="text-xl font-bold mt-4">{t('mentorship')}</h3>
            <p className="text-sm mt-2">
              {t('mentorship_desc')}
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
          >
            <FaGraduationCap size={40} className="text-light-primary mx-auto" />
            <h3 className="text-xl font-bold mt-4">{t('education')}</h3>
            <p className="text-sm mt-2">
              {t('education_desc')}
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
          {t('join_us')}
        </motion.h3>
        <p className="text-lg mt-4">
          {t('join_us_desc')}
        </p>
      </div>
      {location.pathname === "/about" && <Footer />}
    </div>
  );
};

export default AboutPage;
