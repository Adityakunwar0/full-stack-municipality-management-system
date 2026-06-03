import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import { default as CommonLogin } from '../common/Login'
import Quote from '../common/Quote'

const Login = () => {
  return (
    <>
      <Header />
      <main>
        <CommonLogin />

        <Quote />

      </main>

      <Footer />

    </>


  )
}

export default Login