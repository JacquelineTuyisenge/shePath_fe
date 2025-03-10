import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";
import { RootState, AppDispatch } from "../store";
import BackButton from "../buttons/Back";
import { Link } from "react-router-dom";

import pic from '../assets/Hero-bg.png';
import educationImg from "../assets/education.jpg";
import personalGrowthImg from "../assets/personalGrowth.jpg";
import careerDevImg from "../assets/career.jpg";
import healthImg from "../assets/health.jpg";
import mentorshipImg from "../assets/empowerment.svg";
import communityEngagementImg from "../assets/community.jpg";

// Mapping of category names to images
const categoryImageMap = {
    "Education": educationImg,
    "Personal Growth & Life skills": personalGrowthImg,
    "Career & Professional Development": careerDevImg,
    "Health & Well-being": healthImg,
    "Mentorship": mentorshipImg,
    "Community Engagement & Advocacy": communityEngagementImg,
};

const CoursesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses = [], loading, error } = useSelector((state: RootState) => state.courses);
    const { categories = [] } = useSelector((state: RootState) => state.categories);
    const [selectedCategory, setSelectedCategory] = useState("");
    const fakeProgress = Math.floor(Math.random() * 100) + 1;

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchCourseCategories());
    }, [dispatch]);

    const filteredCourses = selectedCategory
        ? courses.filter((course) => course.categoryId === categories.find(cat => cat.name === selectedCategory)?.name)
        : courses;

    if (loading) return <p className="text-center text-lg text-light-text dark:text-dark-text">Loading courses...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl px-7 min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-4">
            {location.pathname === "/courses" && <BackButton />}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Explore Our Courses</h2>
                <select
                    className="p-2 border rounded-lg bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text shadow-sm focus:outline-none"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name} className="bg-light-gray dark:bg-dark-gray">
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCourses.map((course) => {
                    
                    const courseImage = categoryImageMap[course.categoryId as keyof typeof categoryImageMap] || pic; // Default to pic if no match
                    return (
                        <div key={course.id} className="bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <img
                                src={courseImage}
                                alt={course.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-bold">{course.title}</h3>
                                <div className="mt-2 text-xs">Category: {course.categoryId}</div>
                                <div className="w-full bg-light-accent dark:bg-dark-accent rounded-full h-2 mt-3">
                                    <div className="bg-light-primary dark:bg-dark-primary h-2 rounded-full" style={{ width: `${fakeProgress}%` }}></div>
                                </div>
                                <Link
                                    to={`/courses/${course.id}`}
                                    className="block mt-3 text-sm font-medium underline"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CoursesList;