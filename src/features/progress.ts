// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../store";

// const useProgressTracker = (courseId: string) => {
//   const [progress, setProgress] = useState<number>(0);
//   const { user } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     if (!user) return; // Don't track progress for guests

//     const storedProgress = localStorage.getItem(`progress_${user.id}_${courseId}`);
//     if (storedProgress) {
//       setProgress(parseInt(storedProgress, 10));
//     }
//   }, [courseId, user]);

//   const updateProgress = (newProgress: number) => {
//     if (!user) return;

//     setProgress(newProgress);
//     localStorage.setItem(`progress_${user.id}_${courseId}`, newProgress.toString());
//   };

//   return { progress, updateProgress };
// };

// export default useProgressTracker;
