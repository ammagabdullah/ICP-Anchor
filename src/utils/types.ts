import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';


interface Auth {
  state: 'initializing-auth' | 'anonymous' | 'initialized' | 'error';
  actor: Actor | null;
  client: AuthClient | null;
  isLoading: boolean;
  connectedWithWeb2: boolean;
  identity: Identity;
  agent: HttpAgent | null;
}



export interface ConnectStore {
  identity: any;
  principal: string;
  auth: Auth;
  setIdentity: (input: string) => void;
  setPrincipal: (input: string) => void;
  setAuth: (input: Auth) => void;

}

export interface ConnectPlugWalletSlice {
  identity: any;
  principal: string;
  auth: Auth;
  setIdentity: (input: any) => void;
  setAuth: (input: Auth) => void;


}
