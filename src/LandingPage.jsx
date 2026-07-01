import React, { useState } from 'react'
import '../src/Styles/LandingPage.css'

const LandingPage = () => {
    let [bool,setBool]=useState(true)
  return (
    <div>
    <div className="LandingPage">
        <div className="page">
            <div className="text">Login Page😊</div>
            <form>
                <input type="text" placeholder='Enter Name'/>
                <input type="Password" placeholder='Enter Password'/>
                <button>Log In</button>
            </form>
        </div>
    </div>
    </div>
  )
}

export default LandingPage
