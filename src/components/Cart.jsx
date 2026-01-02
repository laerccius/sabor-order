import React from 'react';

const Cart = ({ cart, updateQuantity, removeFromCart, getCartTotal, onCheckout }) => {
  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🍽️</span>
        </div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">Your Cart is Empty</h2>
        <p className="text-emerald-600">Add some delicious lunch items from our menu!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-emerald-800 mb-8">Your Order</h2>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {cart.map((item) => (
          <div key={item.id + item.size} className="border-b border-emerald-100 last:border-b-0">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900">{item.name} - {item.size}</h3>
                  <p className="text-emerald-600 font-medium">${item.price}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id,item.size,item.price, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-emerald-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size,item.price,item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                
                <span className="w-20 text-right font-bold text-emerald-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                
                <button
                  onClick={() => removeFromCart(item.id,item.size,item.price)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold text-emerald-800">Total:</span>
          <span className="text-2xl font-bold text-emerald-600">
            ${getCartTotal().toFixed(2)}
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-emerald-500 text-white py-4 px-6 rounded-xl hover:bg-emerald-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;