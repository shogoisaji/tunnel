import { create } from 'zustand';
import { MemoStore, Memo } from '../types/memo';
import { saveMemo, getAllMemos, deleteMemoById } from '../database/database';
import * as Haptics from 'expo-haptics';

export const useMemoStore = create<MemoStore>((set, get) => ({
  memos: [],
  searchQuery: '',
  selectedTags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',

  addMemo: (memoData) => {
    const newMemo: Memo = {
      ...memoData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    saveMemo(newMemo);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    set((state) => ({
      memos: [newMemo, ...state.memos]
    }));
  },

  updateMemo: (id, updates) => {
    const updatedMemo = {
      ...get().memos.find(m => m.id === id)!,
      ...updates,
      updatedAt: new Date(),
    };
    
    saveMemo(updatedMemo);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    set((state) => ({
      memos: state.memos.map(memo => 
        memo.id === id ? updatedMemo : memo
      )
    }));
  },

  deleteMemo: (id) => {
    deleteMemoById(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    set((state) => ({
      memos: state.memos.filter(memo => memo.id !== id)
    }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  
  setSortBy: (sortBy) => set({ sortBy }),
  
  setSortOrder: (order) => set({ sortOrder: order }),

  togglePin: (id) => {
    const memo = get().memos.find(m => m.id === id);
    if (memo) {
      get().updateMemo(id, { isPinned: !memo.isPinned });
    }
  },
}));

export const loadMemosFromDatabase = () => {
  const memos = getAllMemos();
  useMemoStore.setState({ memos });
};
