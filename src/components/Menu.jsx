import React from 'react';

const Menu = ({ addToCart }) => {
  const menuItems = [
    {
      id: 1,
      name: "Combo Salad In Box | Low Carb",
      description: "Mix de salada fresca com manga, tomate cereja, parmesão e sementes de chia, finalizada com crocantes croutons de alho. Servida com filé de frango empanado ou grelhado e molho leve especial. Acompanha suco natural 300ml. Aviso: combo padronizado.",
      sizes: [{ "name": "P", price: 10 }, { "name": "M", price: 20 }, { "name": "G", price: 30 }],
      image: "https://static-images.ifood.com.br/pratos/0c902059-b665-42fe-800b-51c606ab98a9/202509252235_6U64_i.jpg"
    },
    {
      id: 2,
      name: "Mediterranean Bowl",
      description: "Quinoa, falafel, hummus, fresh veggies, and tahini dressing",
      sizes: [{ "name": "P", price: 10 }, { "name": "M", price: 20 }, { "name": "G", price: 30 }],
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Protein Power Pack",
      description: "Lean steak, sweet potatoes, broccoli, and protein sauce",
      sizes: [{ "name": "P", price: 10 }, { "name": "M", price: 20 }, { "name": "G", price: 30 }],
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Vegetarian Delight",
      description: "Mixed grains, roasted vegetables, tofu, and herb dressing",
      sizes: [{ "name": "P", price: 10 }, { "name": "M", price: 20 }, { "name": "G", price: 30 }],
      image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-emerald-800 mb-4">Sabor in Box</h2>
        <p className="text-emerald-600 text-lg">Cardápio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-emerald-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-emerald-900 mb-2">{item.name}</h3>
              <p className="text-emerald-700 mb-4 leading-relaxed">{item.description}</p>

              {item.sizes.map((size, index) => (
                <div key={`${item.id}${size}${index}`} className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-emerald-600">R$ {size.price}</span>
                  <button
                    onClick={() => addToCart(item, size.name, size.price)}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                  >
                    +1 {size.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export default Menu;