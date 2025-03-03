import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseDetails } from "../features/courseSlice";
import { RootState, AppDispatch } from "../store";
import { useTranslation } from "react-i18next";
import { FaBookOpen, FaInfoCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

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

    return (
        <div className="min-h-screen max-w-5xl mx-auto p-6 sm:p-8 lg:p-12 dark:bg-dark-background text-light-text dark:text-dark-text">
            {/* Course Header */}
            <div className="bg-light-gray dark:bg-dark-gray p-6 sm:p-8 rounded-2xl shadow-lg flex items-center gap-6">
                <FaBookOpen className="text-light-primary dark:text-dark-primary text-5xl" />
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">{singleCourse.title}</h1>
                </div>
            </div>

            {/* Course Description */}
            <div className="mt-8 p-6 sm:p-8 bg-light-gray dark:bg-dark-gray rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold flex items-center gap-2"><FaInfoCircle /> {t('Description')}</h2>
                <p className="text-base mt-2 leading-relaxed">{singleCourse.description}</p>
            </div>

            {/* Course Content */}
            <div className="mt-8 p-6 sm:p-8 bg-light-gray dark:bg-dark-gray rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold">{t('Course Content')}</h2>
                <p className="mt-2 leading-relaxed">{singleCourse.content}</p>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 w-full bg-light-gray dark:bg-dark-gray rounded-full h-4 shadow-inner">
                <div className="bg-light-primary dark:bg-dark-primary h-4 rounded-full transition-all duration-500 ease-in-out" style={{ width: `20%` }}></div>
            </div>
        </div>
    );
}

export default CourseDetails;
