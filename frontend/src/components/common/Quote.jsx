import React, { useEffect, useState } from "react";
import { apiurl, fileUrl } from "./Http";

const Quote = () => {
  const [quotes, setQuotes] = useState([]);

  const fetchQuotes = async () => {
    const res = await fetch(apiurl + "get-quotes", {
      method: "GET",
    });
    const result = await res.json();
    // console.log(result);
    setQuotes(result.data);
  };
  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className='section-6 light-background py-5'>
      <div className='container'>
        {quotes &&
          quotes.map((quote) => {
            return (
              <div key={quote.id} className="quote-box">


                <div className="quote-left">

                  <i className="fa-solid fa-quote-left quote-icon"></i>

                  <p>
                    {quote.quote}
                  </p>
                </div>

                <div className="quote-right">
                  <div className='quote-right-l'>
                    <h4>{quote.name}</h4>
                    <span>{quote.designation_title}</span>
                  </div>

                  <div className='quote-right-r'>
                    < img src={`${fileUrl}uploads/quotes/${quote.image}`} />
                  </div>


                </div>

              </div>
            );
          })}


      </div>

    </div>


  )
}

export default Quote