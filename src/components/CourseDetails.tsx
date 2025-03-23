import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseDetails } from "../features/courseSlice";
import { RootState, AppDispatch } from "../store";
import { useTranslation } from "react-i18next";
import { FaBookOpen, FaInfoCircle } from "react-icons/fa";
import { getProfile } from "../features/userSlice";
import Toaster from "../components/Toaster";
import Loader from "../components/Loader";

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
    const [progress, setProgress] = useState(0);
    const { currentUser  } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseDetails(id)).unwrap();
            dispatch(getProfile());
        }
    }, [dispatch, id]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;
            const totalScrollableHeight = documentHeight - windowHeight;
            const newProgress = (scrollTop / totalScrollableHeight) * 100;
            setProgress(Math.min(Math.max(newProgress, 0), 100)); // Clamp between 0 and 100

            // Save progress to local storage with user ID
            if (currentUser ) {
                localStorage.setItem(`course-${id}-user-${currentUser .id}-progress`, Math.round(newProgress).toString());
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [currentUser , id]);

    const handleMarkAsComplete = () => {
        if (currentUser ) {
            localStorage.setItem(`course-${id}-user-${currentUser .id}-completed`, "true");
            alert("Course marked as complete!");
        }
    };

    if (loading) return <Loader />;
    if (error) return <Toaster message={error} type="error" />;
    if (!singleCourse) return <p className="text-center text-gray-500">{t('Course not found.')}</p>;

    const courseImage = categoryImageMap[singleCourse.categoryId as keyof typeof categoryImageMap] || pic;

    return (
        <div className="w-full m-auto p-2 sm:p-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="relative mt-9">
                <img src={courseImage} alt={singleCourse.title} className="w-full h-68 object-cover rounded-2xl shadow-lg" />
            </div>

            <div className="bg-light-gray dark:bg-dark-gray p-6 sm:p-8 rounded-2xl shadow-lg flex items-center gap-6">
                <FaBookOpen className="text-light-primary dark:text-dark-primary text-5xl" />
                <h1 className="text-3xl sm:text-4xl font-bold">{singleCourse.title}</h1>
            </div>

            <div className="mt-8 p-6 sm:p-8 bg-light-gray dark:bg-dark-gray rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaInfoCircle /> {t('Description')}
                </h2>
                <p className="text-base mt-2 leading-relaxed">{singleCourse.description}</p>
            </div>

            <div className="mt-8 p-6 sm:p-8 bg-light-gray dark:bg-dark-gray rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold">{t('Course Content')}</h2>
                <p className="mt-2 leading-relaxed">{singleCourse.content}</p>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-lg font-semibold">Progress: {Math.round(progress)}%</div>
                <button
                    onClick={handleMarkAsComplete}
                    className="px-4 py-2 bg-light-primary text-white rounded-lg"
                >
                    Mark as Complete
                </button>
            </div>
        </div>
    );
}

export default CourseDetails;