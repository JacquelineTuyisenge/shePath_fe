import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";
import { RootState, AppDispatch } from "../store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Loader from "./Loader";
import Toaster from "./Toaster";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import pic from "../assets/Hero-bg.png";
import educationImg from "../assets/education.jpg";
import personalGrowthImg from "../assets/personalGrowth.jpg";
import careerDevImg from "../assets/career.jpg";
import healthImg from "../assets/health.jpg";
import mentorshipImg from "../assets/empowerment.svg";
import communityEngagementImg from "../assets/community.jpg";

// Circular Progress Component
const CircularProgress = ({ percentage }: any) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 10; // Width of the stroke
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#4caf50" // Change this color as needed
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.5s ease 0s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        stroke="#51c5ef"
        strokeWidth="1px"
        dy=".3em"
        fill="#000"
      >
        {percentage}%
      </text>
    </svg>
  );
};

// Mapping of category names to images
const categoryImageMap = {
  Education: educationImg,
  "Personal Growth & Life skills": personalGrowthImg,
  "Career & Professional Development": careerDevImg,
  "Health & Well-being": healthImg,
  "Mentorship": mentorshipImg,
  "Community Engagement & Advocacy": communityEngagementImg,
};

const CoursesList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );
  const { categories = [] } = useSelector(
    (state: RootState) => state.categories
  );
  const { currentUser  } = useSelector((state: RootState) => state.users);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [toasterMessage, setToasterMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchCourseCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setToasterMessage(error);
      setTimeout(() => setToasterMessage(null), 3000);
    }
  }, [error]);

  const filteredCourses = selectedCategory
    ? courses.filter(
        (course) =>
          course.categoryId ===
          categories.find((cat) => cat.name === selectedCategory)?.name
      )
    : courses;

  return (
    <div
      id="programs"
      className="max-h-screen w-full justify center p-8 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
    >
      {loading && <Loader />}
      {toasterMessage && <Toaster message={toasterMessage} type="error" />}

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
                <option
                  key={category.id}
                  value={category.name}
                  className="bg-light-gray dark:bg-dark-gray"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {filteredCourses.map((course) => {
              const courseImage =
                categoryImageMap[
                  course.categoryId as keyof typeof categoryImageMap
                ] || pic;

              // Retrieve progress from local storage using user ID
              const progress = parseInt(localStorage.getItem(`course-${course.id}-user-${currentUser?.id}-progress`) || "0", 10);

              return (
                <SwiperSlide key={course.id}>
                  <div className="bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                    <img
                      src={courseImage}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <h3 className="text-lg font-bold">{course.title}</h3>
                      <div className="mt-2 text-xs">
                        Category: {course.categoryId}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <CircularProgress percentage={progress} />
                        <button
                          onClick={() => navigate(`/courses/${course.id}`)}
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
            <div className="custom-prev text-orange-500 hover:text-orange-700 cursor-pointer">
              Prev
            </div>
            <div className="custom-next text-orange-500 hover:text-orange-700 cursor-pointer">
              Next
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesList;