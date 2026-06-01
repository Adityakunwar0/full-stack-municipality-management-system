import React from 'react'

const Login = () => {
  return (
             <div className="container  my-5 d-flex justify-content-center">
          <div className="login-form  my-5">
            <div className="card border-0 light-background shadow">
              <div className="card-body p-5 ">
                <form>
                  <h4 className="mb-3 ">Login Here </h4>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id= "email"
                      type="email"
                      placeholder="Email"
                      className = "form-control"
                    />
                 
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      
                      id="password" type="password"
                      placeholder="Password"
                      className="form-control"
                    />

                  </div>
                  <button type="submit" className="btn btn-primary small">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Login