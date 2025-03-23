import React from 'react'
import HomeScreen from "./HomeScreen"
import AuthScreen from "./AuthScreen"

const user=true;
const HomePage = () => {
  return (
    <>
    {user? <AuthScreen /> : <HomeScreen/>}
    </>
  )
}

export default HomePage