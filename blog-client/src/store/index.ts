import {create} from 'zustand';


interface IndexStore {
    isInit: boolean;
    setIsInit: (isInit: boolean) => void;

    blogs: Array<any>;
    setBlogs: (blogs: Array<any>) => void;

    menuIndex: string;
    setMenuIndex: (menuIndex: string) => void;
  }
  
  export const useIndexStore = create<IndexStore>((set) => ({
    isInit: false,
    setIsInit: (isInit) => set({ isInit }),

    blogs: [],
    setBlogs: (blogs) => set({ blogs }),

    menuIndex: 'index',
    setMenuIndex: (menuIndex) => set({ menuIndex }),
  }));
  