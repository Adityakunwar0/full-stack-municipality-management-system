import React from 'react';
import Member1 from '../../assets/images/team1.jpg'

const Member = () => {
  return (
     <section className="section-5 light-background py-5">
      <div className="container">
        <div className="section-header text-center">
          <span>Our Team</span>
          <h2>Team Members </h2>
          <p>
            Meet the dedicated team behind the Municipality, working together to deliver efficient services, and better community support.
          </p>
        </div>
        <div className="row pt-3">
          
                <div
                  className="col-md-6 col-lg-3 mb-3"
                 
                >
                  <div className="card shadow border-0">
                    <div className="card-img-top">
                      <img
                        className="w-100"
                        src={Member1}
                        alt=""
                      />
                    </div>
                    <div className="card-body p-4">
                      <div className="card-title pb-0 mb-0">Aditya Kunwar</div>
                      <div className="card-sub-title mb-3">Mayor</div>
                      <div className='social-icon '>
                        <a target="_blank" href=""><i class="fa-brands fa-facebook"></i></a> 
                        <a target="_blank" href=""> <i class="fa-brands fa-linkedin-in"></i></a>
                        <a target="_blank" href=""><i class="fa-brands fa-instagram"></i></a> 
                        

                      </div>
                      
                      
                    </div>
                  </div>
                </div>
        </div>
      </div>
    </section>
  )
}

export default Member