import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../backend/context/Auth";
import { apiurl } from "../common/Http";

const Login = () => {

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    const res = await fetch(apiurl + "authenticate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Server error, please try again.");
      return;
    }

    const result = await res.json();

    if (result.status == false) {
      toast.error(result.message);
    } else {
      // save user info in local storage and update auth context
      const userInfo = {
        id: result.id,
        token: result.token,
        role: result.role,
        name: result.name,
        email: result.email,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      login(userInfo);
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }

  };

  return (
    <>

      <main>
        <div className="container  my-5 d-flex justify-content-center">
          <div className="login-form  my-5">
            <div className="card light-background border-0 shadow">
              <div className="card-body p-4 ">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h4 className="mb-3">Login Here </h4>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      {...register("email", {
                        required: "This field is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      id="email"
                      type="email"
                      placeholder="Email"
                      className={`form-control ${errors.email && "is-invalid"}`}
                    />
                    {errors.email && (
                      <p className="invalid-feedback">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      {...register("password", {
                        required: "This field is required",
                      })}
                      id="password" type="password"
                      placeholder="Password"
                      className={`form-control ${errors.password && "is-invalid"}`}
                    />
                    {errors.password && (
                      <p className="invalid-feedback">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;