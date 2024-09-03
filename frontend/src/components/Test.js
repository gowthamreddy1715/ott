import React from 'react';

const PhonePePaymentButton = () => {
  const handlePaymentClick = () => {
    // Replace this URL with the actual payment URL provided by PhonePe
    const paymentURL = 'http://localhost:8800/api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';


    // Open the PhonePe payment URL in a new tab/window
    window.open(paymentURL);
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      <button onClick={handlePaymentClick}>Pay Now</button>
    </div>
  );
};

export default PhonePePaymentButton;
