import React, { useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";

const Edit = () => {
    const [isDisable, setIsDisable] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            const res = await fetch(apiurl + "services/" + params.id, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });
            const result = await res.json();
            return {
                icon: result.data.icon,
                title: result.data.title,
                description: result.data.description,
                btn_text: result.data.btn_text,
                color: result.data.color,
                amount: result.data.amount,
            };
        },
    });

    const onSubmit = async (data) => {
        setIsDisable(true);
        const res = await fetch(apiurl + "services/" + params.id, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token()}`,
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        setIsDisable(false);

        if (result.data) {
            toast.success(result.message);
            navigate("/admin/services");
        } else {
            toast.error(result.message || "Something went wrong.");
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
                                        <h4 className="h5">Services / Edit</h4>
                                        <Link to="/admin/services" className="btn btn-primary">
                                            Back
                                        </Link>
                                    </div>
                                    <hr />
                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        {/* Icon */}
                                        <div className="mb-3">
                                            <label className="form-label">Icon Class</label>
                                            <input
                                                type="text"
                                                placeholder="Icon Name "
                                                {...register("icon", {
                                                    required: "The Icon field is required",
                                                })}
                                                className={`form-control ${errors.icon && "is-invalid"}`}
                                            />
                                            {errors.icon && (
                                                <p className="invalid-feedback">{errors.icon?.message}</p>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <div className="mb-3">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                placeholder="Service Title"
                                                {...register("title", {
                                                    required: "The Title field is required",
                                                })}
                                                className={`form-control ${errors.title && "is-invalid"}`}
                                            />
                                            {errors.title && (
                                                <p className="invalid-feedback">{errors.title?.message}</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                placeholder="Service Description"
                                                rows={4}
                                                {...register("description", {
                                                    required: "The Description field is required",
                                                })}
                                                className={`form-control ${errors.description && "is-invalid"}`}
                                            ></textarea>
                                            {errors.description && (
                                                <p className="invalid-feedback">{errors.description?.message}</p>
                                            )}
                                        </div>
                                        {/* Amount */}
                                        <div className="mb-3">
                                            <label className="form-label">Amount</label>
                                            <input
                                                type="text"
                                                placeholder="Amount Name"
                                                {...register("amount")}
                                                className="form-control"
                                            />
                                        </div>


                                        {/* Button Text */}
                                        <div className="mb-3">
                                            <label className="form-label">Button Text</label>
                                            <input
                                                type="text"
                                                placeholder="Button Name"
                                                {...register("btn_text")}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Color */}
                                        <div className="mb-3">
                                            <label className="form-label">Color</label>
                                            <input
                                                type="text"
                                                placeholder="color name "
                                                {...register("color")}
                                                className="form-control"
                                            />
                                        </div>

                                        <button disabled={isDisable} className="btn btn-primary">
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
