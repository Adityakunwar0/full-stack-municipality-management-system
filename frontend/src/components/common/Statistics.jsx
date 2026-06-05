import React, { useEffect, useState } from "react";
import { apiurl, fileUrl } from "./Http";

const Statistics = () => {
    const [statistics, setStatistics] = useState([]);

    const fetchStatistics = async () => {
        const res = await fetch(apiurl + "get-statistics", {
            method: "GET",
        });
        const result = await res.json();
        // console.log(result);
        setStatistics(result.data);
    };
    useEffect(() => {
        fetchStatistics();
    }, []);

    return (
        <section className='section-3 py-3'>
            <div className='container-fluid py-5'>
                <div className='section-header text-center'>
                    <span> Key Statistics </span>
                    <h2>Our Municipality</h2>
                </div>
                <div className='row pt-4 '>
                    {statistics &&
                        statistics.map((statistic) => {
                            return (

                                <div key={statistic.id} className='col-md-4 col-lg-4 '>
                                    <div className='item '>
                                        <div className='banner-icon'>
                                            <i className={statistic.icon_name}></i>

                                        </div>
                                        <div className='statistic-content'>
                                            <h2>{statistic.number}</h2>
                                            <h4>{statistic.title}</h4>
                                            <p>{statistic.slog}</p>
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

export default Statistics