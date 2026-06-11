import React, { useState, useEffect, useContext } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { apiurl, fileUrl, token } from "../../common/Http";
import { toast } from "react-toastify";
import { AuthContext } from "../context/Auth";

const Profile = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [imageId, setImageId] = useState(0);
    const [imageUploading, setImageUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        citizen_name: "",
        citizen_number: "",
        nid_number: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        about_me: "",
    });

    // ── Fetch existing profile on mount ──────────────────────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            const applyUrl = user?.role === "admin"
                ? apiurl + "admin/profile"
                : apiurl + "user/profile";


            try {
                const res = await fetch(applyUrl, {
                    headers: { Authorization: `Bearer ${token()}` },
                });
                const result = await res.json();
                if (result.success && result.data) {
                    const p = result.data;
                    setFormData({
                        citizen_name: p.citizen_name || "",
                        citizen_number: p.citizen_number || "",
                        nid_number: p.nid_number || "",
                        phone: p.phone || "",
                        dob: p.dob || "",
                        gender: p.gender || "",
                        address: p.address || "",
                        about_me: p.about_me || "",
                    });
                    if (p.profile_image) {
                        setPreviewImage(
                            `${fileUrl}uploads/profiles/${p.profile_image}`
                        );
                    }
                }
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };
        fetchProfile();
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Immediate local preview
        setPreviewImage(URL.createObjectURL(file));
        setImageUploading(true);

        try {
            const data = new FormData();
            data.append("image", file);

            const res = await fetch(apiurl + "temp-images", {
                method: "POST",
                headers: { Authorization: `Bearer ${token()}` },
                body: data,
            });
            const result = await res.json();

            if (result.status) {
                setImageId(result.data.id);
            } else {
                toast.error("Image upload failed. Please try again.");
                setPreviewImage(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Image upload failed.");
            setPreviewImage(null);
        } finally {
            setImageUploading(false);
        }
    };

    // ── Save profile ─────────────────────────────────────────────────────────
    const saveProfile = async (e) => {
        e.preventDefault();
        if (imageUploading) {
            toast.info("Please wait — image is still uploading.");
            return;
        }

        setSaving(true);
        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([k, v]) =>
                payload.append(k, v ?? "")
            );
            payload.append("imageId", imageId);

            const applyUrl = user?.role === "admin"
                ? apiurl + "admin/profile"
                : apiurl + "user/profile";

            const res = await fetch(applyUrl, {
                method: "POST",
                headers: { Authorization: `Bearer ${token()}` },
                body: payload,
            });
            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || "Profile saved successfully");
            } else {
                toast.error(result.message || "Failed to save profile");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <Header />
            <main>
                <div className="profile-page">
                    <div className="row g-4">

                        {/* ── Left: Profile Card ── */}
                        <div className="col-lg-4">
                            <div className="profile-sidebar">
                                <div className="profile-cover" />

                                <div className="profile-image-wrapper">
                                    <img
                                        src={previewImage || "/images/default-user.png"}
                                        alt="Profile"
                                        className="profile-image"
                                    />
                                    <label
                                        className={`upload-btn ${imageUploading ? "uploading" : ""}`}
                                        title="Change profile photo"
                                    >
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/jpg,image/jpeg,image/png,image/gif"
                                            onChange={handleImage}
                                        />
                                        {imageUploading ? "⏳" : "📷"}
                                    </label>
                                </div>

                                <h4>{formData.citizen_name}</h4>
                                <span className="role-badge">Citizen Number :{formData.citizen_number}</span>
                                

                                <div className="profile-info">
                                    <div className="info-item">
                                         <i className="fa-solid fa-id-card"></i>
                                        {formData.citizen_name || "Citizen Name"}
                                    </div>
                                    <div className="info-item">
                                         <i className="fa-solid fa-id-card"></i>
                                        {formData.citizen_number || "Citizen Number"}
                                    </div>
                                    <div className="info-item">
                                        <i className="fa-solid fa-file-lines"></i>
                                        {formData.nid_number || "NID Number"}
                                    </div>
                                    <div className="info-item">
                                         <i className="fa-solid fa-phone"></i>
                                        {formData.phone || "Phone Number"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Form ── */}
                        <div className="col-lg-8">
                            <div className="profile-form-card">
                                <h4>Personal Information</h4>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Citizen Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="citizen_name"
                                                value={formData.citizen_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Citizen Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="citizen_number"
                                                value={formData.citizen_number}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>NID Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nid_number"
                                                value={formData.nid_number}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <select
                                                className="form-control"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Address</label>
                                            <textarea
                                                rows="3"
                                                className="form-control"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>About Me</label>
                                            <textarea
                                                rows="5"
                                                className="form-control"
                                                name="about_me"
                                                value={formData.about_me}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end">
                                    <button
                                        className="save-btn"
                                        onClick={saveProfile}
                                        disabled={saving || imageUploading}
                                    >
                                        {saving ? "Saving..." : "Save Profile"}
                                    </button>
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

export default Profile;