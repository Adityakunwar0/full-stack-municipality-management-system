import React, { useEffect, useState } from "react";
import { apiurl, fileUrl } from "./Http";
import { Link } from "react-router-dom";

const LatestNotices = () => {
    const [notices, setNotices] = useState([]);

    const fetchLatestNotices = async () => {
        const res = await fetch(apiurl + "get-latest-notices?limit=4", {
            method: "GET",
        });
        const result = await res.json();
        //console.log(result);
        setNotices(result.data);
    };
    useEffect(() => {
        fetchLatestNotices();
    }, []);

    return (
        <section className="section-2 light-background">
            <div className="container-fluid  py-5">
                <div className="section-header text-center">
                    <span>Latest Notices</span>
                    <h2>Building A Better Tomorrow</h2>
                    <p>
                        Stay updated with the latest announcements Get all essential updates in one place and important information.

                    </p>
                </div>
                <div className="row pt-4">
                    {notices &&
                        notices.map((notice) => {
                            return (

                                <div key={notice.id} className="col-md-3 col-lg-3">
                                    <div className="item">
                                        <div className="service-image">
                                            <img
                                                src={`${fileUrl}uploads/notices/small/${notice.image}`}
                                                alt=""
                                                className="w-100"
                                            />
                                        </div>
                                        <div className="service-body">
                                            <div className="service-title">
                                                <h3>{notice.title}</h3>
                                            </div>
                                            <div className="service-content">
                                                <p>{notice.short_desc}</p>
                                            </div>
                                            <Link
                                                to={`/notice/${notice.id}`}
                                                className="btn btn-primary small"
                                            >
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    )
}

export default LatestNotices