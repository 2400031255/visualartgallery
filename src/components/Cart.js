import React from 'react';
import { useToast } from './Toast';

const Cart = ({ cart, setCart, onClose }) => {
  const toast = useToast();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const checkout = () => {
    toast(`Acquisition confirmed — $${total.toLocaleString()}`, 'success');
    setCart([]);
    onClose();
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-panel" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Collection</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="gold-divider" style={{ margin: '2rem auto' }} />
              <p>Your collection is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <strong>{item.title}</strong>
                  <p>{item.artist} · {item.year}</p>
                  <span className="cart-item-price">${item.price.toLocaleString()}</span>
                </div>
                <button className="btn-danger btn" onClick={() => setCart(cart.filter(i => i.id !== item.id))}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total Acquisition Value</span>
              <strong>${total.toLocaleString()}</strong>
            </div>
            <button className="btn" onClick={checkout}>Confirm Acquisition</button>
            <button className="btn-ghost" onClick={onClose}>Continue Browsing</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
