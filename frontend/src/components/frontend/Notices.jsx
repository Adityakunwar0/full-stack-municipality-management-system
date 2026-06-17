import React, { useEffect, useState, useContext } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import Portal from '../common/Portal';
import { Link } from 'react-router-dom';
import Quote from '../common/Quote';
import { apiurl, fileUrl } from "../common/Http";
import { AuthContext } from '../backend/context/Auth';

const Notices = () => {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);

  const fetchAllNotices = async () => {
    try {
      const res = await fetch(apiurl + "get-notices", {
        method: "GET",
      });
      const result = await res.json();
      setNotices(result.data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);

  return (
    <>
      <Header />
      <main>
        {user ? (
          <Portal
            heading="Notice Board"
            text="Welcome to your portal notice feed. Check regular circulars, updates, and official announcements issued by the municipal office."
          />
        ) : (
          <Hero
            preHeading="Building Today For A Better Tomorrow."
            heading="Notices"
            text="Stay updated with the latest announcements and important information."
          />
        )}

        <section className="section-7 light-background py-5">
          <div className="container py-5">
            <div className="section-header text-center">
              <span>All Notices</span>
              <h2>Building A Better Tomorrow</h2>
              <p>
                Stay updated with the latest announcements. Get all essential updates and important information in one place.
              </p>
            </div>
            
            <div className="row pt-4">
              {notices && notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice.id} className="col-md-4 col-lg-4 mb-4">
                    <div className="item">
                      <div className="service-image">
                        <img
                          src={`${fileUrl}uploads/notices/small/${notice.image}`}
                          alt={notice.title}
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
                ))
              ) : (
                <div className="text-center w-100 py-4">
                  <p>No notices available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <Quote />
      </main>
      <Footer />
    </>
  );
};

export default Notices;