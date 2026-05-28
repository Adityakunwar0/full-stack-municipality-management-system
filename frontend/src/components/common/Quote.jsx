import React from 'react'
import TimeHouse from '../../assets/images/timehouse.png';

const Quote = () => {
  return (
    <div className='section-6 light-background py-5'>
        <div className='container'>
            <div className="quote-box">
        <div className="quote-left">
          <i className="fa-solid fa-quote-left quote-icon"></i>

          <p>
            Our vision is to create a clean, inclusive, and prosperous
            Gaur Municipality where every citizen enjoys equal
            opportunities and a better quality of life.
          </p>
        </div>

        <div className="quote-right">
            <div className='quote-right-l'>
                <h4>— Aditya Kunwar</h4>
          <span>Mayor, Gaur Municipality</span>
            </div>
          
          <div className='quote-right-r'>
            < img src={TimeHouse} />
          </div>

        </div>
      </div>

        </div>
     
      </div>
      
    
  )
}

export default Quote