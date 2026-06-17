import React, { useContext } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import Portal from '../common/Portal';
import Quote from '../common/Quote';
import { useForm } from 'react-hook-form';
import { apiurl } from "../common/Http";
import { toast } from "react-toastify";
import { AuthContext } from '../backend/context/Auth';

const Contact = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(apiurl + "contact-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to connect to the server.");
    }
  };

  return (
    <>
      <Header />
      
      <main>
        {user ? (
          <Portal
            heading="Contact Dashboard"
            text="Welcome to the Portal. If you have an inquiry, direct message us or reach out via our municipal directory below."
          />
        ) : (
          <Hero
            preHeading="We're Here To Help You"
            heading="Contact Us"
            text="Have a question, suggestion, or need assistance regarding municipal projects or services? We'd love to hear from you."
          />
        )}

        <section className='section-8 light-background'>
          <div className="contact-cards container">
            <div className="contact-card">
              <div className="card-icon"><i className="fa fa-phone"></i></div>
              <div className="card-body">
                <h3>Call Us</h3>
                <a href="tel:+97755520292" className="card-highlight">+977 55-520292</a>
                <p>Sun – Fri (10:00 AM – 5:00 PM)</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="card-icon"><i className="fa fa-envelope"></i></div>
              <div className="card-body">
                <h3>Email Us</h3>
                <a href="mailto:info@gaurmun.gov.np" className="card-highlight">
                  info@gaurmun.gov.np
                </a>
                <p>We'll respond within 1 business day</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="card-icon"><i className="fa fa-map-marker"></i></div>
              <div className="card-body">
                <h3>Visit Us</h3>
                <p>Gaur Municipality Office<br />Gaur Rautahat, Nepal</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="card-icon"><i className="fa-regular fa-clock"></i></div>
              <div className="card-body">
                <h3>Office Hours</h3>
                <p>Sunday – Friday<br />10:00 AM – 5:00 PM<br />(Closed on Public Holidays)</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-9">
          <div className="container contact-wrapper">

            {/* Send Message Box */}
            <div className="message-box">
              <h2>Send Us A Message</h2>
              <p>
                Fill out the form below and our team
                will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="form-group">
                  <input
                    {...register("name", {
                      required: "The name field is required",
                    })}
                    type="text" placeholder="Your Name"
                    className={`form-control ${errors.name && "is-invalid"}`}
                  /> 
                  {errors.name && (
                    <p className="invalid-feedback">
                      {errors.name?.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    {...register("phone")}
                    className="form-control form-control-lg"
                    placeholder="Your Phone Number" 
                  />
                </div>

                <div className="form-group">
                  <input
                    {...register("email", {
                      required: "The email field is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={`form-control ${errors.email && "is-invalid"}`}
                    type="email" placeholder="Your Email" 
                  />
                  {errors.email && (
                    <p className="invalid-feedback">
                      {errors.email?.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <input 
                    type="text"
                    {...register("subject")}
                    className="form-control form-control-lg"
                    placeholder="Subject" 
                  />
                </div>

                <div className="form-group">
                  <textarea
                    {...register("message")}
                    rows="6"
                    placeholder="Write Your Message"
                    className="form-control form-control-lg"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary small">
                  <i className="fa-solid fa-paper-plane"></i> Send Message
                </button>
              </form>
            </div>

            {/* Find Us Box */}
            <div className="map-box">
              <h2>Find Us</h2>
              <p>
                Visit the Gaur Municipality Office at the location below.
              </p>

              <div className="map-container">
                <iframe
                  title="Gaur Municipality Office"
                  src="https://maps.google.com/maps?q=Gaur%20Municipality%20Office,%20Rautahat&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>
        </section>

        <Quote />
      </main>
      
      <Footer />
    </>
  );
};

export default Contact;