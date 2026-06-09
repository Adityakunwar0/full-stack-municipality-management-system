import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import { apiurl, token } from '../common/Http';
import Quote from '../common/Quote';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../backend/context/Auth';

const Services = () => {
    const [services, setServices] = useState([]);
    
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const fetchServices = async () => {
        const res = await fetch(apiurl + "get-services", {
            method: "GET",
        });
        const result = await res.json();
        // console.log(result);
        setServices(result.data);
    };
    useEffect(() => {
        fetchServices();
    }, []);

    const handleApply = (serviceId) => {
        const userToken = token();

        if (userToken) {
            const rolePath = user?.role === "admin" ? "admin" : "user";

            
            toast.success("Proceeding to application...");
            navigate(`/${rolePath}/my-requests`);
        } else {

            toast.warning(
                <div>
                    Please login to apply for this service.
                    <span
                        onClick={() => navigate("/login")}
                    >
                        Login now
                    </span>
                </div>,
                { autoClose: 4000 }
            );
            setTimeout(() => navigate("/login"), 3000);
        }
    };


    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading="Building Today For A Better Tommorow."
                    heading="Services"
                    text=" Stay updated with the latest announcements <br/> and important information. "
                />
                <section className='section-3 services light-background py-3'>
                    <div className='container-fluid py-5'>
                        <div className='section-header text-center'>
                            <span> Services </span>
                            <h2>Our Municipality</h2>
                        </div>
                        <div className='container-fluid row pt-4 services-grid '>
                            {services.map((service, index) => (
                                <div className="service-card" key={index}>
                                    <div className={`icon-circle ${service.color}`}>
                                        <i className={service.icon}></i>
                                    </div>

                                    <h4>{service.title}</h4>

                                    <p>{service.description}</p>

                                    <button
                                        onClick={handleApply}
                                        className={`service-btn ${service.color}`}>
                                        {service.btn_text}
                                    </button>
                                </div>
                            ))}

                        </div>
                    </div>

                </section>
                <Quote />

            </main>
            <Footer />

        </>
    )
}

export default Services