import { ConnectPlugWalletSlice } from "@/utils/types";

const authSlice = (
  set: (fn: (state: ConnectPlugWalletSlice) => ConnectPlugWalletSlice) => void,
  get: () => ConnectPlugWalletSlice,
) => ({
  auth: {
    state: 'initializing-auth',
    connectedWithWeb2: false,
    actor: null,
    client: null,
    isLoading: true,
    identity: null,
    agent: null,
  },
  setAuth: (input: any): void =>
    set((state) => ({
      ...state,
      auth: input,
    })),
});

export default authSlice;
