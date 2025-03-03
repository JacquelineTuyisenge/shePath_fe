import React, { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { RootState } from "../store";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import dayjs from "dayjs";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const UserExpansionTrend = () => {
  const { users } = useAppSelector((state: any) => state.users);

  // Extract available years from users
  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(users.map((user: any) => dayjs(user.createdAt).format("YYYY")))
    ) as string[]; 
    
    return uniqueYears.sort();
  }, [users]);
  

  const [selectedYear, setSelectedYear] = useState(() =>
    years.length ? years[0] : dayjs().format("YYYY")
  );

  // Process users into daily counts for the selected year
  const chartData = useMemo(() => {
    const groupedUsers: Record<string, number> = {};

    users.forEach((user: any) => {
      const date = dayjs(user.createdAt);
      const formattedDate = date.format("MMM DD");

      if (date.format("YYYY") === selectedYear) {
        groupedUsers[formattedDate] = (groupedUsers[formattedDate] || 0) + 1;
      }
    });

    return Object.entries(groupedUsers)
      .map(([date, count]) => ({ date, users: count }))
      .sort((a, b) => dayjs(a.date, "MMM DD").unix() - dayjs(b.date, "MMM DD").unix());
  }, [users, selectedYear]);

  return (
    <div className="dark:bg-dark-gray p-4 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-dark-secondary font-semibold">User Growth Over Time</h2>
        <select
          className="border p-2 rounded-md bg-white dark:bg-dark-secondary"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <XAxis dataKey="date" stroke="#8884d8" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#f97316"
            fill="url(#colorOrange)"
            strokeWidth={3}
          />
          <defs>
            <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserExpansionTrend;
