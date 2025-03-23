import { ReactNode } from "react";

interface CardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
}

const Card = ({ title, value, icon, color }: CardProps) => {
  return (
    <div className={`h-min-screen w-full flex justify-center mt-10 p-8 w-140 rounded-2xl bg-light-gray dark:bg-dark-gray shadow-lg hover:shadow-2xl py-2 mb-4 items-center gap-4 ${color}`}>
      <div className="rounded-full shadow text-center">{icon}</div>
      <div className="text-justify">
        <h3 className="py-6 text-2xl font-semibold">{title} <span className="text-light-primary text-2xl px-2">{value}</span> </h3>
      </div>
    </div>
  );
};

export default Card;
