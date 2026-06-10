import React, { useMemo, useRef, useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiurl, fileUrl, token } from "../../common/Http";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

const Edit = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState({});
  const [isDisable, setIsDisable] = useState(false);
  const [imageId, setImageId] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "",
    }),
    [placeholder]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiurl + "notices/" + params.id, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      const data = result.data;

      setNotice(data);
      setContent(data.content || "");

      return {
        title: data.title,
        slug: data.slug,
        short_desc: data.short_desc,
        status: data.status,
        location: data.location,
      };
    },
  });

  const onSubmit = async (data) => {
    const newData = {
      ...data,
      content,
      imageId,
    };

    const res = await fetch(apiurl + "notices/" + params.id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(newData),
    });

    const result = await res.json();

    if (result.status === true) {
      toast.success(result.message);
      navigate("/admin/notices");
    } else {
      toast.error(result.message);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
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
        toast.error(
          result?.errors?.image?.[0] || result?.message || "Upload failed"
        );
      } else {
        setImageId(result.data.id);
      }
    } catch (err) {
      setIsDisable(false);
      toast.error("Image upload failed");
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
                <div className="light-background card-body">
                  <div className="d-flex justify-content-between">
                    <h4 className="h5">Notices / Edit</h4>
                    <Link to="/admin/notices" className="btn btn-primary">
                      Back
                    </Link>
                  </div>

                  <hr />

                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        {...register("title", {
                          required: "Title is required",
                        })}
                        className={`form-control ${errors.title ? "is-invalid" : ""
                          }`}
                      />
                      {errors.title && (
                        <p className="invalid-feedback">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Slug */}
                    <div className="mb-3">
                      <label className="form-label">Slug</label>
                      <input
                        {...register("slug", {
                          required: "Slug is required",
                        })}
                        className={`form-control ${errors.slug ? "is-invalid" : ""
                          }`}
                      />
                      {errors.slug && (
                        <p className="invalid-feedback">
                          {errors.slug.message}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        {...register("location")}
                        className="form-control"
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        {...register("status", {
                          required: "Status is required",
                        })}
                        className="form-control"
                      >
                        <option value="1">Active</option>
                        <option value="0">Block</option>
                      </select>

                      {errors.status && (
                        <p className="invalid-feedback d-block">
                          {errors.status.message}
                        </p>
                      )}
                    </div>

                    {/* Short Description */}
                    <div className="mb-3">
                      <label className="form-label">
                        Short Description
                      </label>
                      <textarea
                        {...register("short_desc")}
                        className="form-control"
                        rows={4}
                      />
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => setContent(newContent)}
                        onChange={() => { }}
                      />
                    </div>

                    {/* Image */}
                    <div className="mb-3">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFile}
                      />
                    </div>

                    {/* Existing Image */}
                    <div className="pb-3">
                      {notice.image && (
                        <img
                          src={
                            fileUrl +
                            "uploads/notices/small/" +
                            notice.image
                          }
                          alt="notice"
                        />
                      )}
                    </div>

                    <button
                      disabled={isDisable}
                      className="btn btn-primary"
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