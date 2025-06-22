"use client";
import Link from "next/link";
import React, { useState } from "react";

const productsList = [
  { id: 1, name: "ANAHSA NNSJASK", price: 20 },
  { id: 2, name: "Product 2", price: 15 },
  { id: 3, name: "Product 3", price: 30 },
];

export default function CheckoutPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const handleCheckout = () => {
    const cartData = {
      products: cart,
      subtotal: subtotal,
    };

    // Save to localStorage
    localStorage.setItem("checkoutData", JSON.stringify(cartData));
  };
  const filtered = productsList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="min-h-screen text-black flex gap-8">
      <div className="flex-1">
        <input
          className="w-full p-3 rounded border border-gray-300 mb-6"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center border-b pb-3 border-gray-200"
            >
              <div className="text-sm">{product.name}</div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  onClick={() => addToCart(product)}
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Checkout Panel */}
      <div className="w-1/4 border-l pl-6 border-gray-300 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-4">CHECKOUT</h2>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={item.id} className="text-sm space-y-1">
                <div>
                  {index + 1}. {item.name}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">Price: {item.price}</span>
                  <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
                    <button onClick={() => updateQty(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                  <span className="ml-auto font-semibold">
                    {item.qty * item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <div className="text-right mb-3">
            Subtotal: <span className="font-bold">{subtotal}</span>
          </div>
          <Link href={"/checkout"}>
            <button
              onClick={handleCheckout}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              CheckOut →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
