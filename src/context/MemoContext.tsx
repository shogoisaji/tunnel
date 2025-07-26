import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Memo } from '../types/memo';
import { getRandomColor } from '../utils/colors';

interface MemoContextType {
  memos: Memo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addMemo: (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMemo: (id: string, updates: Partial<Memo>) => void;
  deleteMemo: (id: string) => void;
  togglePin: (id: string) => void;
}

const MemoContext = createContext<MemoContextType | undefined>(undefined);

export const useMemos = () => {
  const context = useContext(MemoContext);
  if (!context) {
    throw new Error('useMemos must be used within a MemoProvider');
  }
  return context;
};

export const MemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addMemo = (memoData: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMemo: Memo = {
      ...memoData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMemos(prev => [newMemo, ...prev]);
  };

  const updateMemo = (id: string, updates: Partial<Memo>) => {
    setMemos(prev => prev.map(memo => 
      memo.id === id ? { ...memo, ...updates, updatedAt: new Date() } : memo
    ));
  };

  const deleteMemo = (id: string) => {
    setMemos(prev => prev.filter(memo => memo.id !== id));
  };

  const togglePin = (id: string) => {
    updateMemo(id, { isPinned: !memos.find(m => m.id === id)?.isPinned });
  };

  return (
    <MemoContext.Provider value={{
      memos, searchQuery, setSearchQuery, addMemo, updateMemo, deleteMemo, togglePin
    }}>
      {children}
    </MemoContext.Provider>
  );
};
