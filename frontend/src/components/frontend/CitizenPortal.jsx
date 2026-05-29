import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Login from '../backend/Login'
import Quote from '../common/Quote'

const CitizenPortal = () => {
    return (
        <>
            <Header />
            <main>
                <Login />

                <Quote />
            </main>

            <Footer />
        </>
    )
}

export default CitizenPortal