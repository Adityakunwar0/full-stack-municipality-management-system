import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";

const Show = () => {
    const [profiles, setProfiles] = useState([]);

    const fetchProfiles = async () => {
        try {
            const res = await fetch(
                apiurl + "admin/profiles",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token()}`
                    }
                }
            );

            const result = await res.json();

            if (result.data) {
                setProfiles(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

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

                                    <h4>User Profiles</h4>

                                    <hr />

                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Citizen No</th>
                                                    <th>NID</th>
                                                    <th>Phone</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {profiles.map(profile => (
                                                    <tr key={profile.id}>
                                                        <td>{profile.id}</td>

                                                        <td>
                                                            {profile.user?.name}
                                                        </td>

                                                        <td>
                                                            {profile.citizen_number}
                                                        </td>

                                                        <td>
                                                            {profile.nid_number}
                                                        </td>

                                                        <td>
                                                            {profile.phone}
                                                        </td>

                                                        <td>
                                                            <Link
                                                                to={`/admin/profiles/${profile.id}`}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Show;