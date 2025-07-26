export interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  color: string;
  isPinned: boolean;
}

export interface MemoStore {
  memos: Memo[];
  searchQuery: string;
  selectedTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  addMemo: (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMemo: (id: string, updates: Partial<Memo>) => void;
  deleteMemo: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSortBy: (sortBy: 'createdAt' | 'updatedAt' | 'title') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  togglePin: (id: string) => void;
}
