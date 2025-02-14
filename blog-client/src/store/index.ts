import {create} from 'zustand';


interface IndexStore {
    isInit: boolean;
    setIsInit: (isInit: boolean) => void;

    blogs: Array<any>;
    setBlogs: (blogs: Array<any>) => void;
  }
  
  export const useIndexStore = create<IndexStore>((set) => ({
    isInit: false,
    setIsInit: (isInit) => set({ isInit }),

    blogs: [],
    setBlogs: (blogs) => set({ blogs }),
  }));
  