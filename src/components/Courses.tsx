import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";
import { RootState, AppDispatch } from "../store";
import { Link } from "react-router-dom";
import pic from '../assets/Hero-bg.png'

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
        ? courses.filter((course) => course.categoryId === categories.find(cat => cat.id === selectedCategory)?.name)
        : courses;

    if (loading) return <p className="text-center text-lg text-light-text dark:text-dark-text">Loading courses...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl px-7 min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Explore Our Courses</h2>
                <select
                    className="p-2 border rounded-lg bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text shadow-sm focus:outline-none"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-light-gray dark:bg-dark-gray">
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                        <img
                            src={pic}
                            alt={course.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-bold">{course.title}</h3>
                            <p className="text-sm truncate">{course.description}</p>
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
                ))}
            </div>
        </div>
    );
};

export default CoursesList;
