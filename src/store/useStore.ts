import { create } from 'zustand';
import authSlice from './slices/authSlice';


const useAuthStore = create<ReturnType<any>>()((set, get) => ({
  ...authSlice(set, get),
}));



export { useAuthStore};
