import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseDetails } from "../features/courseSlice";
import BackButton from "../buttons/Back";
import { RootState, AppDispatch } from "../store";
import { useTranslation } from "react-i18next";
import { FaBookOpen, FaInfoCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import Footer from "./Footer";

// Import images
import pic from '../assets/Hero-bg.png';
import educationImg from "../assets/education.jpg";
import personalGrowthImg from "../assets/personalGrowth.jpg";
import careerDevImg from "../assets/career.jpg";
import healthImg from "../assets/health.jpg";
import mentorshipImg from "../assets/empowerment.svg";
import communityEngagementImg from "../assets/community.jpg";

const categoryImageMap = {
    "b1e4e1e4-6b8d-43c1-8b7a-8d6c81c3a12e": educationImg,
    "e2e2bfc6-2a94-4f16-9a84-b689cfab4ef9": personalGrowthImg,
    "5adf94a8-0eaf-4773-902c-0c35c8ef6f3e": careerDevImg,
    "a760cf07-612d-47fb-881a-8d9813427aec": healthImg,
    "0526c4c0-50a6-44d9-b516-00bf19f39ff4": mentorshipImg,
    "39d2022f-87e6-436a-8acd-22e0394ad270": communityEngagementImg,
};

function CourseDetails() {
    const { loading, singleCourse, error } = useSelector((state: RootState) => state.courses);
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseDetails(id)).unwrap();
        } 
    }, [dispatch, id]);

    if (loading) return <p className="text-center text-lg text-light-primary dark:text-dark-primary animate-pulse">{t('Loading course details...')}</p>;
    if (error) return <p className="text-center text-red-500 flex items-center justify-center gap-2"><MdErrorOutline className="text-2xl" /> {error}</p>;
    if (!singleCourse) return <p className="text-center text-gray-500">{t('Course not found.')}</p>;

    // Getting the image based on the course category
    const courseImage = categoryImageMap[singleCourse.categoryId as keyof typeof categoryImageMap] || pic; // Default to pic if no match

    return (
        <>
        <div className="min-h-screen max-w-5xl mx-auto p-6 sm:p-8 lg:p-12 dark:bg-dark-background text-light-text dark:text-dark-text">
            <BackButton />
            <div className="relative mb-6">
                <img src={courseImage} alt={singleCourse.title} className="w-full h-64 object-cover rounded-2xl shadow-lg" />
            </div>

            <div className="bg-light-gray dark:bg-dark-gray p-6 sm:p-8 rounded-2xl shadow-lg flex items-center gap-6">
                <FaBookOpen className="text-light-primary dark:text-dark-primary text-5xl" />
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">{singleCourse.title}</h1>
                </div>
            </div>

            <div className="mt-8 p-6 sm:p-8 bg-light-gray dark:bg-dark-gray rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold flex items-center gap-2"><FaInfoCircle /> {t('Description')}</h2>
                <p className="text-base mt-2 leading-relaxed">{singleCourse.description}</p>
            </div>

            <div className="mt-8 p-6 sm:p-8 bg-light-gray dark:bg-dark-gray rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold">{t('Course Content')}</h2>
                <p className="mt-2 leading-relaxed">{singleCourse.content}</p>
            </div>

            <div className="mt-8 w-full bg-light-gray dark:bg-dark-gray rounded-full h-4 shadow-inner">
                <div className="bg-light-primary dark:bg-dark-primary -4 rounded-full transition-all duration-500 ease-in-out" style={{ width: `20%` }}></div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default CourseDetails;
