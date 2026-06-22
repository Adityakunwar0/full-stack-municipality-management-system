import React, { useMemo, useRef, useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

const Create = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [imageId, setImageId] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Content",
    }),
    [placeholder],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  //http://localhost:8000/api/projects
  const onSubmit = async (data) => {
    const newData = { ...data, content: content, imageId: imageId };
    const res = await fetch(apiurl + "projects", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(newData),
    });
    const result = await res.json();
    //console.log(result);

    if (result.status == true) {
      toast.success(result.message);
      navigate("/admin/projects");
    } else {
      toast.error(result.message);
    }
  };
  const handleFile = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);
    setIsDisable(true);

    try {
      const res = await fetch(apiurl + "temp-images", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: formData,
      });

      const result = await res.json();
      setIsDisable(false);

      if (!res.ok || result.status === false) {
        toast.error(result?.errors?.image?.[0] ?? result?.message ?? "Upload failed");
      } else if (result?.data?.id) {
        setImageId(result.data.id);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      setIsDisable(false);
      toast.error("Image upload failed. Please try again.");
      console.error("Upload error:", err);
    }
  };
  return (
    <>
      <Header />
      <main>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3 ">
              <Sidebar />
              {/* sidebar */}
            </div>
            <div className="col-md-9">
              {/* Dashboard */}
              <div className="card shadow border-0">
                <div className="light-background card-body">
                  <div className="d-flex justify-content-between">
                    <h4 className="h5">Projects / Create </h4>
                    <Link to="/admin/projects" className="btn btn-primary">
                      Back
                    </Link>
                  </div>
                  <hr />
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Title
                      </label>
                      <input
                        placeholder="Title"
                        {...register("title", {
                          required: "The title field is required",
                        })}
                        type="text"
                        className={`form-control ${errors.title && "is-invalid"}`}
                      />
                      {errors.title && (
                        <p className="invalid-feedback">
                          {errors.title?.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        slug
                      </label>
                      <input
                        type="text"
                        placeholder="slug"
                        {...register("slug", {
                          required: "The slug field is required",
                        })}
                        className={`form-control ${errors.slug && "is-invalid"}`}
                      />
                      {errors.slug && (
                        <p className="invalid-feedback">
                          {errors.slug?.message}
                        </p>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="location"
                            {...register("location")}
                            className={`form-control `}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Project Type
                          </label>
                          <select
                            className="form-control"
                            {...register("project_type")}
                          >
                            <option value="">Project Type</option>
                            <option value="Urban Development">
                              Urban Development
                            </option>
                            <option value="Public Service Project">
                              Public Service Project
                            </option>
                            <option value="Environmental Project">
                              Environmental Project
                            </option>
                            <option value="Infrastructure Development">
                              Infrastructure Development
                            </option>
                            <option value="Social Development">
                              Social Development
                            </option>
                            <option value="Technology Development">
                              Technology Development
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Sector
                          </label>
                          <select
                            className="form-control"
                            {...register("sector")}
                          >
                            <option value="">Sector</option>
                            <option value="Health">Health</option>
                            <option value="Environment & Sanitation">Environment & Sanitation</option>
                            <option value="Digital Governance">Digital Governance</option>
                            <option value="Road & Transportation">Road & Transportation</option>
                            <option value="Water Supply">Water Supply</option>
                            <option value="Energy & Public Safety">Energy & Public Safety</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Status
                          </label>
                          <select
                            className="form-control"
                            {...register("status")}
                          >
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Short Description
                      </label>
                      <textarea
                        placeholder="Short Description"
                        {...register("short_desc")}
                        className="form-control"
                        rows={4}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Content
                      </label>
                      <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setContent(newContent)}
                        onChange={(newContent) => setContent(newContent)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Image
                      </label>
                      <br />
                      <input onChange={handleFile} type="file" />
                    </div>

                    <button
                      disabled={isDisable}
                      className="btn btn-primary small"
                    >
                      submit
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

export default Create;