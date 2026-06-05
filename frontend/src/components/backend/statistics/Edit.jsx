import React, { useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiurl, token } from "../../common/Http";
import { useForm } from "react-hook-form";

const Edit = () => {
  const [isDisable, setIsDisable] = useState(false);
  const [statistic, setStatistic] = useState({});

  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiurl + "statistics/" + params.id, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();
      setStatistic(result.data);
      return {
        icon_name: result.data.icon_name,
        number: result.data.number,
        title: result.data.title,
        slog: result.data.slog,
      };
    },
  });

  const navigate = useNavigate();

  // ✅ Fixed: added (data) parameter and use it in body
  const onSubmit = async (data) => {
    setIsDisable(true);
    const res = await fetch(apiurl + "statistics/" + params.id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(data), // ✅ Fixed
    });
    const result = await res.json();

    setIsDisable(false);

    if (result.status == true) {
      toast.success(result.message);
      navigate("/admin/statistics");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3">
              <Sidebar />
            </div>
            <div className="col-md-9">
              <div className="card shadow border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h4 className="h5">Statistics / Edit</h4>
                    <Link to="/admin/statistics" className="btn btn-primary">
                      Back
                    </Link>
                  </div>
                  <hr />
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label className="form-label">Icon Name</label>
                      <textarea
                        placeholder="Icon_Name"
                        {...register("icon_name", {
                          required: "The Icon Name field is required",
                        })}
                        className={`form-control ${errors.icon_name && "is-invalid"}`}
                        rows={4}
                      ></textarea>
                      {errors.icon_name && (
                        <p className="invalid-feedback">
                          {errors.icon_name?.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Number</label>
                      <input
                        placeholder="Number"
                        {...register("number", {
                          required: "The Number field is required",
                        })}
                        type="text"
                        className={`form-control ${errors.number && "is-invalid"}`}
                      />
                      {errors.number && (
                        <p className="invalid-feedback">
                          {errors.number?.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        placeholder="Title"
                        {...register("title")}
                        type="text"
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Slog</label>
                      <input
                        placeholder="Slog"
                        {...register("slog")}
                        type="text"
                        className="form-control"
                      />
                    </div>

                    {/* ✅ Fixed: button is disabled while submitting */}
                    <button
                      disabled={isDisable}
                      className="btn btn-primary small"
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Edit;