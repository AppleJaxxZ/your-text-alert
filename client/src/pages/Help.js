import React from 'react';

const Help = () => {
    return (
        <div className="d-flex justify-content-center " style={{ height: "80vh", marginTop: '5rem' }}>
            <div className="container mt-5 align-items-center d-flex">
                <div className="row col-md-6 offset-md-3 mt-5 text-center">
                    <h1 className="pt-5 mt-5 fw-bold" >Contact Us</h1>
                    <p>Accepting Email, Text, And Calls 9am -5pm Mon-Fri</p>
                    <p>Please allow 24 hours to respond</p>
                    <p>DO NOT CALL AVERHEALTH for issues with your text alerts.  Contact US!</p>
                    <ul style={{ listStyle: "none" }} className="lead pb-4">
                        <li className="lead pb-4"><a type='email' href="mailto:easylandings.software@gmail.com">easylandings.software@gmail.com</a></li>
                        <li><a type="phone" href="tel:14842492503">484-249-2503</a></li>
                    </ul>

                    <h1 className="pt-5 fw-bold">Things To Know..</h1>
                    <p>A good habit is to check the date in your alert message everynight, make sure the date is correct.</p>
                    <p>It is your responsiblity to notify us if you arent receiving your alerts or you missed one.
                        It is your responsiblity to make sure you are getting your text every night, your phone plan is active/ paid for
                        and if there is any network errors or issues because you didnt get your text alert, then you need to call into your AverHealth hotline to check for your schedule as well as notify US to help fix any issues you are having with your nightly alert!
                    </p>
                </div>



            </div>
        </div>
    )
}

export default Help