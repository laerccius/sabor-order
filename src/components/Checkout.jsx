import React, { useState } from 'react';

const Checkout = ({ cart, getCartTotal, onBack, onOrderComplete }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentInfoChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Order placed successfully! Thank you for your purchase.');
      onOrderComplete();
    }, 2000);
  };

  const isFormValid = () => {
    return customerInfo.name && 
           customerInfo.email && 
           customerInfo.phone && 
           customerInfo.address &&
           paymentInfo.cardNumber &&
           paymentInfo.expiryDate &&
           paymentInfo.cvv &&
           paymentInfo.nameOnCard;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center font-medium"
      >
        ← Back to Cart
      </button>

      <h2 className="text-3xl font-bold text-emerald-800 mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
          <h3 className="text-xl font-semibold text-emerald-800 mb-4">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-3 py-2 border-b border-emerald-50">
              <span className="text-emerald-700">{item.name} × {item.quantity}</span>
              <span className="font-semibold text-emerald-600">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-emerald-200 pt-4 mt-3">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-emerald-800">Total:</span>
              <span className="text-emerald-600">${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">Customer Information</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Delivery Address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={customerInfo.city}
                    onChange={handleCustomerInfoChange}
                    className="p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={customerInfo.zipCode}
                    onChange={handleCustomerInfoChange}
                    className="p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">Payment Information</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentInfoChange}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentInfoChange}
                    className="p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentInfoChange}
                    className="p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="nameOnCard"
                  placeholder="Name on Card"
                  value={paymentInfo.nameOnCard}
                  onChange={handlePaymentInfoChange}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                isFormValid() && !isProcessing
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-xl'
                  : 'bg-emerald-200 text-emerald-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;