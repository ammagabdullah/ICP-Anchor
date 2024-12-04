
import { Actor, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import React, { useState, useCallback, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { createAgent, fromNullable } from '@dfinity/utils';

import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ConnectPlugWalletSlice } from './types';
import { LoginEnum } from './const';

const useAuth = () => {
  const { auth, setAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    setAuth: (state as ConnectPlugWalletSlice).setAuth,
   
  }));
  const router = useRouter();

  const initAuth = useCallback(async () => {
    setAuth({ ...auth, isLoading: true });
  
    const client = await AuthClient.create({
      idleOptions: {
        // idleTimeout: 1000 * 60 * 60 * 2, // set to 2 hours
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });

    if (await client.isAuthenticated()) {
      const tempAuth = await authenticate(client);
      return { success: false, actor: tempAuth };
    } else {
   

      setAuth({
        ...auth,
        state: 'anonymous',
        actor: null,
        client,
        isLoading: false,
      });
  
      return { success: false, actor: null };
    }
  }, [setAuth]);

  const login = useCallback(
    async ( navigation: any, callBackfn: () => void) => {
      if (auth.state === 'anonymous') {
        setAuth({ ...auth, isLoading: true });
     
          if (!auth.client) {
            initAuth();
            console.error('AuthClient not initialized');
            return;
          }
          await auth.client.login({
            maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000),
          

            identityProvider:
              process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
                ? 'https://identity.ic0.app/#authorize'
                : `http://${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/#authorize`,
            onSuccess: () => {
              authenticate(auth.client as AuthClient).then(() => {
               
              });
            },
            onError: () => {
              setAuth({ ...auth, isLoading: false });
            },
          });
          const refreshLogin = () => {
            // prompt the user then refresh their authentication
            if (auth.client) {
              auth.client.login({
                onSuccess: async () => {
                  authenticate(auth.client as AuthClient);
                },
              });
            }
          };

          auth.client.idleManager?.registerCallback?.(refreshLogin);
        
      }
    },
    [auth.state, auth.client, setAuth],
  );

  const logout = useCallback(async () => {
    

    if (auth.state === 'initialized') {
      setAuth({
        ...auth,
        isLoading: true,
      });
      if (auth.client instanceof AuthClient) {
        await auth.client.logout();
      } 

      setAuth({
        ...auth,
        state: 'anonymous',
        actor: null,
        isLoading: false,
      
      });
    } 
  }, [auth.state, auth.client, setAuth,]);

  

  const authenticate = useCallback(
    async (client?: AuthClient, identity?: Identity) => {
      try {
        if (!client && !identity) {
          // return logger('Unexpected error while authenticating');
        }
        const development = process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic';
        // setAuth({ ...auth, isLoading: true });

        let myIdentity = client ? client.getIdentity() : identity;
        const agent = await createAgent({
          identity: myIdentity as Identity,
          host: development ? 'http://localhost:4943' : 'https:icp0.io',
        });
        if (development) {
          try {
            await agent.fetchRootKey();
          } catch (error) {
            // logger(error, 'unable to fetch root key');
          }
        }
        // setAgent(agent);
        if (!myIdentity){
          // logger('Unexpected error while authenticating');

          return 
        } 

      
       
        setAuth({
          ...auth,
          state: 'initialized',
          actor:null,
          client: client ?? auth.client,
          isLoading: false,
          identity: myIdentity,
          agent,
        });

        return null;
      } catch (e) {
        setAuth({ ...auth, state: 'error' });
    
        // logger(e, 'Error while authenticating');
        throw new Error('encountered an error while authenticating');
      }
    },
    [, setAuth, auth],
  );

  // useEffect(() => {
  //   initAuth();
  // }, [initAuth]);

  return {
    auth,
    initAuth,
    login,
    logout,
    authenticate,
 
  };
};

export default useAuth;
