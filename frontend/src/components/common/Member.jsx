import React, { useEffect, useState } from "react";
import { apiurl, fileUrl } from "./Http";

const Member = () => {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const res = await fetch(apiurl + "get-members", {
      method: "GET",
    });
    const result = await res.json();
    // console.log(result);
    setMembers(result.data);
  };
  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <section className="section-5 light-background py-5">
      <div className="container">
        <div className="section-header text-center">
          <span>Our Team</span>
          <h2>Team Members </h2>
          <p>
            Meet the dedicated team behind the Municipality, working together to deliver efficient services, and better community support.
          </p>
        </div>
        <div className="row pt-3">
          {members &&
            members.map((member) => {
              return (

                <div key={member.id}
                  className="col-md-6 col-lg-3 mb-3"

                >
                  <div className="card shadow border-0">
                    <div className="card-img-top">
                      <img
                        className="w-100"
                        src={`${fileUrl}uploads/members/${member.image}`}
                        alt=""
                      />
                    </div>
                    <div className="card-body p-4">
                      <div className="card-title pb-0 mb-0">{member.name}</div>
                      <div className="card-sub-title mb-3">{member.job_title}</div>
                      <div className='social-icon '>
                        <a target="_blank" href={member.facebook_url}><i class="fa-brands fa-facebook"></i></a>
                        <a target="_blank" href={member.linkedin_url}> <i class="fa-brands fa-linkedin-in"></i></a>
                        <a target="_blank" href={member.instagram_url}><i class="fa-brands fa-instagram"></i></a>


                      </div>


                    </div>
                  </div>
                </div>
              );
            })};
        </div>
      </div>
    </section>
  )
}

export default Member