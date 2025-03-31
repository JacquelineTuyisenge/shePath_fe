import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseDetails, fetchCourseProgress, updateCourseProgress } from "../features/courseSlice";
import { RootState, AppDispatch } from "../store";
import { useTranslation } from "react-i18next";
import { FaBookOpen, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { getProfile } from "../features/userSlice";
import Toaster from "../components/Toaster";
import Loader from "../components/Loader";
import careerDevImg from "../assets/career.jpg";

function CourseDetails() {
  const { loading, singleCourse, error, progress: courseProgressMap } = useSelector((state: RootState) => state.courses);
  const { currentUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const role = localStorage.getItem("role");
  const isLearner = role === "Learner";
  

  useEffect(() => {
    if (!id) return;

    dispatch(fetchCourseDetails(id)).unwrap().catch(() => {});

    if (!currentUser) {
      dispatch(getProfile()).unwrap().catch(() => {});
    } else if (id && isLearner) {
      dispatch(fetchCourseProgress(id)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setProgress(result.payload.progress);
          setIsCompleted(result.payload.completed);
        }
      });
    }
  }, [dispatch, id, currentUser]);

  useEffect(() => {
    if (id && courseProgressMap[id]) {
      setProgress(courseProgressMap[id].progress);
      setIsCompleted(courseProgressMap[id].completed);
    }
  }, [id, courseProgressMap]);

  const handleMarkAsComplete = () => {
    if (!currentUser) {
      setToastMessage("Please log in to mark this course as complete.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setProgress(100);
    setIsCompleted(true);
    if (id) {
      dispatch(updateCourseProgress({ courseId: id, progress: 100, completed: true }));
    }
  };

  if (loading) return <Loader />;
  if (error) return <Toaster message={error} type="error" />;
  if (!singleCourse) return <p className="text-center text-gray-500">{t("Course not found.")}</p>;

  const courseImage = singleCourse.image || careerDevImg;

  return (
    <div className="min-h-screen w-full bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      {toastMessage && <Toaster message={toastMessage} type="error" />}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={courseImage}
          alt={singleCourse.title}
          className="w-full h-full object-cover object-center brightness-75"
          onError={(e) => (e.currentTarget.src = careerDevImg)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{singleCourse.title}</h1>
            <p className="mt-2 text-lg md:text-xl text-white/80">{singleCourse.categoryName}</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-10 bg-light-gray dark:bg-dark-gray p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3 text-light-primary dark:text-dark-primary">
            <FaInfoCircle /> {t("Description")}
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed">{singleCourse.description}</p>
        </section>
        <section className="mb-10 bg-light-gray dark:bg-dark-gray p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3 text-light-primary dark:text-dark-primary">
            <FaBookOpen /> {t("Course Content")}
          </h2>
          <div
            className="mt-4 text-base md:text-lg leading-relaxed prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: singleCourse.content }}
          />
        </section>
        {isLearner && (
          <section className="sticky bottom-4 bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-2/3">
              <div className="text-sm font-medium mb-1">
                Progress: {currentUser ? Math.round(progress) : "N/A"}%
              </div>
              {currentUser ? (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-light-primary dark:bg-dark-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">Log in to track progress</p>
              )}
            </div>
            <button
              onClick={handleMarkAsComplete}
              disabled={isCompleted && !!currentUser} // Only disable if completed AND authenticated
              className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 transition ${
                isCompleted && currentUser
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-light-primary dark:bg-dark-primary hover:bg-light-accent dark:hover:bg-dark-accent"
              }`}
            >
              {isCompleted && currentUser ? (
                <>
                  <FaCheckCircle /> Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;