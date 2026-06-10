import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Hero from '../common/Hero'
import { Link } from 'react-router-dom'
import Quote from '../common/Quote'
import { apiurl, fileUrl } from "../common/Http";

const Notices = () => {
  const [notices, setNotices] = useState([]);

  const fetchAllNotices = async () => {
    const res = await fetch(apiurl + "get-notices", {
      method: "GET",
    });
    const result = await res.json();
    // console.log(result);
    setNotices(result.data);
  };
  useEffect(() => {
    fetchAllNotices();
  }, []);

  return (
    <>
      <Header />
      <main >
        <Hero
          preHeading="Building Today For A Better Tommorow."
          heading="Notices"
          text=" Stay updated with the latest announcements <br/> and important information. "
        />
        <section className="section-7 light-background py-5">
          <div className="container py-5">
            <div className="section-header text-center">
              <span>All Notices</span>
              <h2>Building A Better Tomorrow</h2>
              <p>
                Stay updated with the latest announcements Get all essential updates in one place and important information.
              </p>
            </div>
            <div className="row pt-4">
              {notices &&
                notices.map((notice) => {
                  return (

                    <div key={notice.id} className="col-md-4 col-lg-4">
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
        <Quote />

      </main>
      <Footer />
    </>
  )
}

export default Notices