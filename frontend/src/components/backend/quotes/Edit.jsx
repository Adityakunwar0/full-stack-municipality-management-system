import React, { useState, useRef, useMemo } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiurl, token, fileUrl } from "../../common/Http";
import { useForm } from "react-hook-form";

const Edit = () => {
    const [isDisable, setIsDisable] = useState(false);
    const [imageId, setImageId] = useState(null);
    const [quote, setQuote] = useState([]);

    const params = useParams();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            const res = await fetch(apiurl + "quotes/" + params.id, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });
            const result = await res.json();

            setQuote(result.data);
            return {
                quote: result.data.quote,
                name: result.data.name,
                designation_title: result.data.designation_title,
                status: result.data.status,
            };
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const newData = { ...data, imageId: imageId };
        const res = await fetch(apiurl + "quotes/" + params.id, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token()}`,
            },
            body: JSON.stringify(newData),
        });
        const result = await res.json();
        // console.log(result);

        if (result.status == true) {
            toast.success(result.message);
            navigate("/admin/quotes");
        } else {
            toast.error(result.message);
        }
    };
    const handleFile = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append("image", file);
        setIsDisable(true);

        const res = await fetch(apiurl + "temp-images", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token()}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                setIsDisable(false);
                if (result.status == false) {
                    toast.error(result.errors.image[0]);
                } else {
                    setImageId(result.data.id);
                }
            });
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
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="h5">Quotes/ Edit </h4>
                                        <Link to="/admin/quotes" className="btn btn-primary">
                                            Back
                                        </Link>
                                    </div>
                                    <hr />
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mb-3">
                                            <label htmlFor="" className="form-label">
                                                Quote
                                            </label>
                                            <textarea
                                                placeholder="Quote"
                                                {...register("quote", {
                                                    required: "The Quote field is required",
                                                })}
                                                className={`form-control ${errors.quote && "is-invalid"}`}
                                                rows={4}
                                            ></textarea>
                                            {errors.quote && (
                                                <p className="invalid-feedback">
                                                    {errors.quote?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="" className="form-label">
                                                Name
                                            </label>
                                            <input
                                                placeholder="Name"
                                                {...register("name", {
                                                    required: "The name field is required",
                                                })}
                                                type="text"
                                                className={`form-control ${errors.name && "is-invalid"}`}
                                            />
                                            {errors.name && (
                                                <p className="invalid-feedback">
                                                    {errors.name?.message}
                                                </p>
                                            )}
                                        </div>


                                        <div className="mb-3">
                                            <label htmlFor="" className="form-label">
                                                Designation Title
                                            </label>
                                            <input
                                                placeholder="Designation Title"
                                                {...register("designation_title")}
                                                type="text"
                                                className={`form-control`}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="" className="form-label">
                                                Image
                                            </label>
                                            <br />
                                            <input onChange={handleFile} type="file" />
                                        </div>
                                        <div className="pb-3">
                                            {quote.image && (
                                                <img
                                                    src={
                                                        fileUrl + "uploads/quotes/" + quote.image
                                                    }
                                                    alt=""
                                                />
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="" className="form-label">
                                                Status
                                            </label>
                                            <select className="form-control" {...register("status")}>
                                                <option value="1">Active</option>
                                                <option value="0">Block</option>
                                            </select>
                                        </div>
                                        <button
                                            disabled={isDisable}
                                            className="btn btn-primary small"
                                        >
                                            update
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