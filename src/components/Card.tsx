import { ReactNode } from "react";

interface CardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
}

const Card = ({ title, value, icon, color }: CardProps) => {
  return (
    <div className={`h-min-screen mt-10 p-8 w-140 rounded-2xl bg-light-gray dark:bg-dark-gray shadow-lg hover:shadow-2xl py-2 mb-4 items-center gap-4 ${color}`}>
      <div className="p-7 rounded-full shadow text-center">{icon}</div>
      <div className="text-center">
        <h3 className="py-6 text-lg font-semibold">{title} {value}</h3>
      </div>
    </div>
  );
};

export default Card;
