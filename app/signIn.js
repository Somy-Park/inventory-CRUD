import React from "react";
import {auth, provider} from "@/firebase"
import { signInWithPopup } from "firebase/auth";
import page from "./page"

function SignIn() {
  const handleSignIn = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email)
      localStorage.setItem("email", data.user.email)
      window.location.href = "/page"
    })
  }

  return (
    <Box>
      <Button
        onClick = {handleSignIn}
      >
      Sign In with Google
      </Button>
    </Box>
  )
}

export default SignIn;