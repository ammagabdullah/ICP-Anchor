"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Spinner } from 'react-bootstrap';
import useAuth from "@/utils/auth";
import { useAuthStore } from "@/store/useStore";
import { ConnectPlugWalletSlice } from "@/utils/types";
export default function Home() {
  const { auth, } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,



  }));
  const { login, logout, initAuth } = useAuth();
  const [principalId, setPrincipalId] = useState<string | null>(null);
  const [isInternetIdentity, setisInternetIdentity] = useState(false)




 /** 
     * Function to disconnect from Plug wallet 
     */
 const disconnectFromPlug = async () => {
  try {
    if(isInternetIdentity){
      
      logout()

    }else if (window?.ic?.plug) {
          await window?.ic?.plug.disconnect();
          setPrincipalId(null); // Clear the principal ID
  
      }
   
  } catch (error) {
      console.error("Disconnection error:", error);
  }
};
  /**
   * connectToPlug use to connect plug wallet
   */
  const connectToPlug = async () => {
    try {
    
      if (!window?.ic || !window?.ic.plug) {
        window.open("https://chromewebstore.google.com/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm?hl=en-US&utm_source=ext_sidebar", '_blank');
 
        return;
      }
      const whitelist = ["gq3rs-huaaa-aaaaa-qaasa-cai"]; // Canister ID
      const result = await window.ic.plug.requestConnect({
        whitelist,
  
      });

      if (result) {
        const principal = await window.ic.plug.agent.getPrincipal();
        setPrincipalId(principal.toText());
      }
    } catch (error) {
  console.log(error,"connection error");
  

  
    }
  };
  useEffect(() => {
    const checkConnection = async () => {
        if (window?.ic?.plug) {
            const isConnected = await window.ic.plug.isConnected();
            if (isConnected) {
                const principal = await window.ic.plug.agent.getPrincipal();
                setPrincipalId(principal.toText());
            }
        }
    };
    checkConnection();
}, []);
useEffect(() => {
  if (auth) {
    initAuth();
  }
}, []);
useEffect(() => {
console.log(auth,"jagfjadfadsfadfadf");
if(auth.identity && auth.state !="anonymous"){
  let principal=auth.identity.getPrincipal();
console.log(principal.toString(),"jagfjadfadsfadfadf");
setisInternetIdentity(true)

  setPrincipalId(principal.toString())
}else{
  if(isInternetIdentity){
    setPrincipalId(null)
  }
  // setPrincipalId(null)
}

}, [auth]);
  return (

    <div className="main">
      <Container className="my-3 text-center">
        <div className="main-inner">
          <h2>Welcome To ICP-Anchor</h2>
            {principalId ?
              <>
                <h4>Your Principal Address</h4>
                <p>{principalId}</p>

                <Button onClick={disconnectFromPlug} className="my-3">
                  Disconnect
                </Button>
              </>:
              auth.isLoading? <Spinner variant="light"/>:
              <>
              <Button  onClick={connectToPlug} className="my-3">Connect Plug Wallet</Button>
              <br />
              <Button  onClick={()=>login(null,()=>{})} className="my-3">Connect Internet Identity</Button>
              </>
            }
          </div>
      </Container>
   </div>
  );
}
