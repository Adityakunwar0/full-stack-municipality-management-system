import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Hero from "../common/Hero";
import { apiurl, fileUrl } from "../common/Http";
import { Link, useParams } from "react-router-dom";
import Quote from "../common/Quote";

const NoticeDetail = () => {
    const params = useParams();

    // Separate state for the list of sidebar notices and the active single notice detail
    const [sidebarNotices, setSidebarNotices] = useState([]);
    const [activeNotice, setActiveNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchNoticeDetail = async () => {
        setLoading(true);
        try {
            // 1. Fetch the single notice detail based on URL param ID
            const res = await fetch(`${apiurl}get-notice/${params.id}`, {
                method: "GET",
            });
            const result = await res.json();
            setActiveNotice(result.data);

            // 2. Optional: Fetch all notices for the sidebar if you haven't already
            // If your API returns the sidebar list somewhere else, adjust this endpoint.
            const listRes = await fetch(`${apiurl}get-notices`, { method: "GET" });
            const listResult = await listRes.json();
            setSidebarNotices(listResult.data || []);

        } catch (error) {
            console.error("Error fetching notice data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Re-run this effect whenever the ID in the URL changes (e.g., clicking a sidebar link)
    useEffect(() => {
        fetchNoticeDetail();
    }, [params.id]);

    // Show a clean loading state instead of crashing while fetching data
    if (loading || !activeNotice) {
        return (
            <>
                <Header />
                <main className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading Notice...</span>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading="Building Today For A Better Tomorrow."
                    heading={activeNotice.title}
                    text="Stay updated with the latest announcements <br/> and important information."
                />
                <section className="section-10">
                    <div className="container py-5">
                        <div className="row">

                            <div className="col-md-3">
                                <div className="card shadow border-0 sidebar">
                                    <div className="card-body px-4 py-4">
                                        <h3 className="mt-2 mb-3">Notices</h3>
                                        <ul>
                                            {sidebarNotices && sidebarNotices.length > 0 ? (
                                                sidebarNotices.map((item) => (
                                                    <li key={`notice-${item.id}`}>                                                        <Link to={`/notice/${item.id}`}>
                                                        {item.title}
                                                    </Link>
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No other notices found</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                {activeNotice.image && (
                                    <div>
                                        <img
                                            className="w-100"
                                            src={`${fileUrl}uploads/notices/large/${activeNotice.image}`}
                                            alt={activeNotice.title}
                                        />
                                    </div>
                                )}
                                <h3 className="py-3">{activeNotice.title}</h3>
                                <div
                                    dangerouslySetInnerHTML={{ __html: activeNotice.content }}
                                ></div>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="section-11 bg-light py-5">
                    <Quote />
                </section>
            </main>
            <Footer />
        </>
    );
};

export default NoticeDetail;