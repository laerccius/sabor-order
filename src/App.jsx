import React, { useState } from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import EpsonPrinter from './components/qz-print';

import { db } from "./fb";
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const saveCart = async (cart) => {

  try {
    // 1. Referência da coleção
    const ordersRef = collection(db, "orders");

    // 2. Adiciona o documento
    await addDoc(ordersRef, {
      id: Math.random(),
      cart: cart,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Erro ao adicionar pedido: ", error);
    alert("Erro ao salvar pedido. Verifique as Regras de Segurança.");
  }
};

async function buscarPedidos() {
  try {
    // 1. Referencia a coleção "orders"
    const ordersCol = collection(db, "orders");

    // 2. Busca todos os documentos da coleção
    const snapshot = await getDocs(ordersCol);

    // 3. Mapeia os dados dos documentos
    const listaDePedidos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Pedidos encontrados:", listaDePedidos);
    return listaDePedidos;

  } catch (e) {
    console.error("Erro ao buscar documentos: ", e);
  }
}

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [cart, setCart] = useState([]);
  buscarPedidos().then((data) => {
    console.log(data);
  }).catch((error) => {
    console.error("Erro ao buscar pedidos: ", error);
  });
  const addToCart = (item, size, price) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.size === size && cartItem.price === price);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.size == size && cartItem.price === price
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, size, price, quantity: 1 }];
    });
    console.log(cart);
  };

  const updateQuantity = (id, size, price, quantity) => {
    if (quantity === 0) {
      removeFromCart(id, size, price);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.size == size && item.price ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id, size, price) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id && item.size !== size && item.price !== price));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      { }
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-full mr-3"></div>
              <h1 className="text-2xl font-bold text-emerald-800">Sabor in Box</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('menu')}
                className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'menu'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
              >
                Menu
              </button>

              <button
                onClick={() => setCurrentView('print')}
                className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'print'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
              >
                Print
              </button>
              <button
                onClick={() => setCurrentView('cart')}
                className="relative px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
              >
                Carrinho
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'menu' && (
          <Menu addToCart={addToCart} />
        )}
        {currentView === 'cart' && (
          <Cart
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getCartTotal={getCartTotal}
            onCheckout={() => {
              setCurrentView('checkout')
            }
            }
          />
        )}
        {currentView === 'checkout' && (
          <Checkout
            cart={cart}
            getCartTotal={getCartTotal}
            onBack={() => setCurrentView('cart')}
            onOrderComplete={() => {
              saveCart(cart).finally();
              setCart([]);
              setCurrentView('menu');
            }}
          />
        )}
        {currentView === 'print' && (
          <EpsonPrinter></EpsonPrinter>
        )}
      </main>
    </div>
  );
}

export default App;