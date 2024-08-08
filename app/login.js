'use client'
import {signIn} from "next-auth/react"
import { Box, Button, Typography } from "@mui/material"
export default function Login() {
  return (
    <Box 
      position = "absolute" //Center box on screen
      top = "30%"
      left = "50%"
      borderRadius={4}
      width = {700}
      height = {300}
      bgcolor = "white"
      border = "1px solid #000"
      p = {4}
      display = "flex"
      alignItems="center"
      flexDirection="column"
      sx={{
        transform: "translate(-50%, -50%)"
        }}
    >
      <Typography
        sx={{
          paddingBottom: 10,
          paddingTop: 5,
          fontSize: 40
        }}
      >
        Welcome to your pantry!
      </Typography>
      <Button 
        onClick = {() => signIn("google")}
        variant="contained"
      >
        Sign in with Google
      </Button>
    </Box>
  )
}
