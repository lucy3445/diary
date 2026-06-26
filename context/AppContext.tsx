import React, { createContext, useContext, useState } from 'react';
import { Todo, TODOS_TODAY } from '../constants/Data';
import { DiaryData } from '../services/gemini';

interface AppState {
  todayDone: boolean;
  setTodayDone: (v: boolean) => void;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  addedTodos: string[];
  addTodoFromDiary: (text: string) => void;
  diaryData: DiaryData | null;
  setDiaryData: (d: DiaryData) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [todayDone, setTodayDone] = useState(false);
  const [todos, setTodos] = useState<Todo[]>(TODOS_TODAY);
  const [addedTodos, setAddedTodos] = useState<string[]>([]);
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);

  const addTodoFromDiary = (text: string) => {
    setAddedTodos(a => [...a, text]);
    setTodos(ts => [...ts, {
      id: 'd' + Date.now(),
      text,
      done: false,
      cat: text.includes('걷') || text.includes('운동') ? '건강' : '업무',
      from: '대화',
    }]);
  };

  return (
    <AppContext.Provider value={{ todayDone, setTodayDone, todos, setTodos, addedTodos, addTodoFromDiary, diaryData, setDiaryData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
