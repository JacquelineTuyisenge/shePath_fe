import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addTask, deleteTask, toggleComplete } from '../features/taskSlice';
import { useTranslation } from 'react-i18next';

const TaskManager: React.FC = () => {
  const {t} = useTranslation();
  const [taskText, setTaskText] = useState('');
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch: AppDispatch = useDispatch();

  const handleAddTask = () => {
    if (taskText.trim()) {
      dispatch(addTask(taskText));
      setTaskText('');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-light-background dark:bg-dark-background border border-light-primary dark:border-dark-primary rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-4 text-light-primary dark:text-dark-primary">
        {t('taskManager')}
      </h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="flex-grow p-2 border rounded dark:bg-gray-800 dark:text-white"
          placeholder={t('addtask')}
        />
        <button
          onClick={handleAddTask}
          className="ml-2 px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded"
        >
          {t('add')}
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-2 mb-2 border rounded ${
              task.completed
                ? 'bg-light-primary dark:bg-dark-primary text-white'
                : 'bg-light-background dark:bg-dark-background'
            }`}
          >
            <span
              onClick={() => dispatch(toggleComplete(task.id))}
              className={`cursor-pointer ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.text}
            </span>
            <button
              onClick={() => dispatch(deleteTask(task.id))}
              className="text-red-500"
            >
              {t('delete')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
