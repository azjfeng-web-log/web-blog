import {create} from 'zustand';


interface IndexStore {
    isInit: boolean;
    setIsInit: (isInit: boolean) => void;
  }
  
  export const useIndexStore = create<IndexStore>((set) => ({
    isInit: false,
    setIsInit: (isInit) => set({ isInit }),
  }));
  