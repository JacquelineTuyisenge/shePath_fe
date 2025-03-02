import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseDetails } from "../features/courseSlice";
import { RootState, AppDispatch } from "../store";
// import pic from "../assets/Hero-bg.png";
import videoPlaceholder from "../assets/video.mp4"; 
import audioPlaceholder from "../assets/audio.mp4"; 
// import { useTranslation } from "react-i18next"; 
// import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CourseDetails() {

    const { loading, singleCourse, error } = useSelector((state: RootState) => state.courses);
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const categoryName = 

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseDetails(id)).unwrap();
        } 
    }, [dispatch, id]);


    if (loading) return <p className="text-center text-lg">Loading course details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!singleCourse) return <p className="text-center text-gray-500">Course not found.</p>;

    return (
        <div className="min-h-screen max-w-5xl mx-auto p-6 dark:bg-dark-background text-light-text dark:text-dark-text">
            <h1 className="text-3xl font-bold mb-4">{singleCourse.title}</h1>
            {/* Course Media */}
            <div className="w-full h-64 mb-4">
                <video controls className="w-full h-full rounded-lg shadow-md">
                    <source src={videoPlaceholder} type="video/mp4" />
                    {t('videoSupportError')}
                </video>
            </div>

            {/* Course Audio */}
            <div className="mb-4">
                <p className="font-semibold">{t('audioLesson')}:</p>
                <audio controls className="w-full">
                    <source src={audioPlaceholder} type="audio/mp3" />
                    {t('audioSupportError')}
                </audio>
            </div>

            {/* Course Description */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-base">{singleCourse.description}</p>
            </div>

            <div className="mt-6">
                <h1>{singleCourse.content}</h1>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-light-gray dark:bg-dark-gray rounded-full h-3 mt-6">
                <div className="bg-light-primary dark:bg-dark-primary h-3 rounded-full" style={{ width: `20%` }}></div>
            </div>
        </div>
    );
};

export default CourseDetails;
