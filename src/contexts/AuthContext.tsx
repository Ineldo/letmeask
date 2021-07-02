import { useEffect } from "react";
import { useState } from "react";
import { createContext, ReactNode } from "react";
import { auth, firebase } from "../services/firebase";

export const AuthContext = createContext({} as AuthContextType);


type User={
    id: string;
    name: string;
    avatar: string;
  }
  type AuthContextType={
    user : User | undefined;
    signInWIthGoogle: () => Promise<void>;
  }
  type AuthContextProps={
      children: ReactNode;
  }
export function AuthContextProvider(props: AuthContextProps){

    const [user , setUser]= useState <User>();

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user=>{
      if(user){
        const {displayName, photoURL, uid} = user

        if(!displayName || !photoURL ){
          throw new Error('Missing info from Google');
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
    return ()=>{
      unsubscribe();
    }
  }, [])

 async function signInWIthGoogle(){
    const provider= new firebase.auth.GoogleAuthProvider();

    const result= await auth.signInWithPopup(provider)
    
    if (result.user) {
      const {displayName, photoURL, uid} = result.user

      if(!displayName || !photoURL ){
        throw new Error('Missing info from Google');
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
   

  }
    return(
        <AuthContext.Provider value={{user, signInWIthGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );

}