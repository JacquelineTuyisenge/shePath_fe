import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, fetchCourseProgress } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";
import { RootState, AppDispatch } from "../store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Loader from "./Loader";
import Toaster from "./Toaster";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/utils";
import careerDevImg from "../assets/career.jpg";

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle stroke="#e6e6e6" fill="transparent" strokeWidth={strokeWidth} r={normalizedRadius} cx={radius} cy={radius} />
      <circle
        stroke="#4caf50"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 0.5s ease 0s" }}
      />
      <text x="50%" y="50%" textAnchor="middle" stroke="#51c5ef" strokeWidth="1px" dy=".3em" fill="#000">
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};

interface CoursesListProps {
  setToaster?: (message: string, type: "success" | "error") => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ setToaster }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error, progress: courseProgressMap } = useSelector((state: RootState) => state.courses);
  const { categories = [] } = useSelector((state: RootState) => state.categories);
  const { currentUser } = useSelector((state: RootState) => state.users);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [toasterMessage, setToasterMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCourses()).catch((err) => setToasterMessage(`Failed to fetch courses: ${err.message}`));
    dispatch(fetchCourseCategories()).catch((err) =>
      setToasterMessage(`Failed to fetch categories: ${err.message}`)
    );
    if (currentUser) {
      courses.forEach((course) => {
        if (!courseProgressMap[course.id]) {
          dispatch(fetchCourseProgress(course.id)).catch((err) =>
            setToasterMessage(`Failed to fetch progress for course ${course.id}: ${err.message}`)
          );
        }
      });
    }
  }, [dispatch, currentUser, courses.length]);

  useEffect(() => {
    if (error) {
      setToasterMessage(error);
      setTimeout(() => setToasterMessage(null), 3000);
    }
  }, [error]);

  // Filter courses by matching course.categoryId (name) with category.name
  const filteredCourses = selectedCategory
    ? courses.filter((course) =>
        categories.find((cat) => cat.id === selectedCategory)?.name === course.categoryId
      )
    : courses;

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const dateA = new Date(a.createdAt || "1970-01-01").getTime();
    const dateB = new Date(b.createdAt || "1970-01-01").getTime();
    return dateB - dateA; // Latest first
  });

  const handleViewDetails = (courseId: string) => {
    if (!isAuthenticated()) {
      if (setToaster) {
        setToaster("Please log in to view course details", "error");
      } else {
        setToasterMessage("Please log in to view course details");
        setTimeout(() => setToasterMessage(null), 3000);
      }
      return;
    }
    navigate(`/courses/${courseId}`);
  };

  return (
    <div
      id="programs"
      className="max-h-screen w-full justify-center p-8 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
    >
      {loading && <Loader />}
      {!loading && (
        <>
          <div className="flex flex-wrap justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-semibold">Programs</h2>
            <select
              className="p-3 text-center rounded-lg bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text shadow-sm focus:outline-none"
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
          {sortedCourses.length === 0 && !error && (
            <p className="text-center text-gray-600 dark:text-gray-300">No courses available for this category.</p>
          )}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {sortedCourses.map((course) => {
              const progress = currentUser ? courseProgressMap[course.id]?.progress || 0 : 0;
              return (
                <SwiperSlide key={course.id}>
                  <div className="bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                    <img
                      src={course.image || careerDevImg}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <h3 className="text-lg font-bold">{course.title}</h3>
                      <div className="mt-2 text-xs">
                        Category: {course.categoryId} {/* Already the name */}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <CircularProgress percentage={progress} />
                        <button
                          onClick={() => handleViewDetails(course.id)}
                          className="mt-3 px-4 py-2 cursor-pointer flex items-center justify-center gap-2 bg-light-primary text-white rounded-lg shadow-md hover:bg-orange-600 transition"
                        >
                          View Details <FaArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex justify-between p-4">
            <div className="custom-prev text-orange-500 hover:text-orange-700 cursor-pointer">Prev</div>
            <div className="custom-next text-orange-500 hover:text-orange-700 cursor-pointer">Next</div>
          </div>
      {toasterMessage && <Toaster message={toasterMessage} type="error" />}

        </>
      )}
    </div>
  );
};

export default CoursesList;