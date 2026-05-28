import React from 'react'

const Statistics = () => {
    return (
        <section className='section-3 py-3'>
            <div className='container-fluid py-5'>
                <div className='section-header text-center'>
                    <span> Key Statistics </span>
                    <h2>Our Municipality</h2>
                </div>
                <div className='row pt-4 '>

                    <div className='col-md-4 col-lg-4 '>
                        <div className='item '>
                            <div className='banner-icon'>
                                <i className="fa-solid fa-users"></i>

                            </div>
                            <div className='statistic-content'>
                                <h2>39,846</h2>
                                <h4>Total Population</h4>
                                <p>Growing Together, Building Our Future</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 col-lg-4 '>
                        <div className='item'>
                            <div className='banner-icon'>
                                <i className="fa-solid fa-map-location-dot"></i>
                            </div>
                            <div className='statistic-content '>
                                <h2>21.53</h2>
                                <h4>Total Area (Sq Km)</h4>
                                <p>Spanning A Diverse And Vibrant Region </p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 col-lg-4 '>
                        <div className='item'>
                            <div className='banner-icon'>
                                <i className="fa-solid fa-building-columns"></i>
                            </div>
                            <div className='statistic-content '>
                                <h2>9</h2>
                                <h4>Total Wards</h4>
                                <p>Dedicated to every community</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 col-lg-4'>
                        <div className='item'>
                            <div className='banner-icon'>
                                <i className="fa-solid fa-users-rectangle"></i>
                            </div>
                            <div className='statistic-content'>
                                <h2>1,851</h2>
                                <h4>Population Density (Sq Km)</h4>
                                <p>Growing and vibrant community.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 col-lg-4'>
                        <div className='item'>
                            <div className='banner-icon'>
                                <i className="fa-solid fa-chart-line"></i>
                            </div>
                            <div className='statistic-content'>
                                <h2>1.26 - 1.4</h2>
                                <h4>Annual Growth Rate ( % )</h4>
                                <p>Steady community expansion</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 col-lg-4'>
                        <div className='item'>
                            <div className='banner-icon'>
                                <i class="fa-solid fa-book"></i>
                            </div>
                            <div className='statistic-content'>
                                <h2>69.46</h2>
                                <h4>Literacy Rate ( % )</h4>
                                <p>Empowering through education</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default Statistics