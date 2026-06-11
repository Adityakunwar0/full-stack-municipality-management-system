import React, { useEffect, useState } from "react";
import Header from '../../common/Header';
import { useParams } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";
import Footer from '../../common/Footer';

const View = () => {
    const { id } = useParams();

    const [citizenNumber, setCitizenNumber] = useState("");
    const [citizenName, setCitizenName] = useState("");
    const [nidNumber, setNidNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [imageId, setImageId] = useState(null);
    const [isDisable, setIsDisable] = useState(false);
    const [profile, setProfile] = useState(null);

    const fetchProfile = async () => {

        const res = await fetch(
            apiurl + "admin/profiles/" + id,
            {
                headers: {
                    Authorization: `Bearer ${token()}`
                }
            }
        );

        const result = await res.json();

        const profile = result.data;

        setCitizenName(profile.citizen_name || "");
        setCitizenNumber(profile.citizen_number || "");
        setNidNumber(profile.nid_number || "");
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
        setAboutMe(profile.about_me || "");
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (e) => {
        e.preventDefault();

        try {

            const res = await fetch(
                apiurl + "admin/profiles/" + id,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token()}`
                    },
                    body: JSON.stringify({
                        citizen_name: citizenName,
                        citizen_number: citizenNumber,
                        nid_number: nidNumber,
                        phone,
                        address,
                        about_me: aboutMe,
                        imageId
                    })
                }
            );

            const result = await res.json();

            toast.success(result.message);

            fetchProfile();
            setImageId(null);

        } catch (error) {
            toast.error("Update failed");
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
                <div className="container mt-4">

                    <div className="card">
                        <div className="card-body">

                            <h4>Edit Profile</h4>

                            <form onSubmit={updateProfile}>

                                <div className="mb-3">
                                    <label>Citizen Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={citizenName}
                                        onChange={(e) =>
                                            setCitizenName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Citizen Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={citizenNumber}
                                        onChange={(e) =>
                                            setCitizenNumber(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>NID Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nidNumber}
                                        onChange={(e) =>
                                            setNidNumber(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Address</label>
                                    <textarea
                                        className="form-control"
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>About Me</label>
                                    <textarea
                                        className="form-control"
                                        value={aboutMe}
                                        onChange={(e) =>
                                            setAboutMe(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Profile Image</label>
                                    <br />
                                    <input
                                        type="file"
                                        onChange={handleFile}
                                    />
                                </div>

                                {/* Current image preview — same pattern as Edit.jsx */}
                                <div className="pb-3">
                                    {profile?.profile_image && (
                                        <img
                                            src={fileUrl + "uploads/profiles/" + profile.profile_image}
                                            alt="Profile"
                                            width={100}
                                        />
                                    )}
                                </div>

                                <button
                                    disabled={isDisable}
                                    className="btn btn-success"
                                    type="submit"
                                >
                                    Update Profile
                                </button>

                            </form>

                        </div>
                    </div>

                </div>
            </main>
            <Footer />

        </>

    );
}

export default View