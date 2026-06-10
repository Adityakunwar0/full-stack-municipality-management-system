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

    //http://localhost:8000/api/notices
    const onSubmit = async (data) => {
        const newData = { ...data, content: content, imageId: imageId };
        const res = await fetch(apiurl + "notices", {
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
            navigate("/admin/notices");
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
                        <div className="col-md-9 ">
                            {/* Dashboard */}
                            <div className="card  shadow border-0">
                                <div className="light-background card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="h5">Notices / Create </h4>
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
                                                placeholder="Title"
                                                {...register("title", {
                                                    required: "The title field is required",
                                                })}
                                                type="text"
                                                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                            />
                                            {errors.title && (
                                                <p className="invalid-feedback">{errors.title.message}</p>
                                            )}
                                        </div>

                                        {/* Slug */}
                                        <div className="mb-3">
                                            <label className="form-label">Slug</label>
                                            <input
                                                type="text"
                                                placeholder="Slug"
                                                {...register("slug", {
                                                    required: "The slug field is required",
                                                })}
                                                className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                                            />
                                            {errors.slug && (
                                                <p className="invalid-feedback">{errors.slug.message}</p>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div className="mb-3">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                placeholder="Location"
                                                {...register("location")}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select className="form-control" {...register("status")}>
                                                <option value="1">Active</option>
                                                <option value="0">Block</option>
                                            </select>
                                        </div>

                                        {/* Short Description */}
                                        <div className="mb-3">
                                            <label className="form-label">Short Description</label>
                                            <textarea
                                                placeholder="Short Description"
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

                                        {/* Submit */}
                                        <button type="submit" disabled={isDisable} className="btn btn-primary">
                                            Submit
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