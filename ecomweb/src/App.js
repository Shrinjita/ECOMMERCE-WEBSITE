import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import items from "./mockData/items.json"; // Assuming you still have the items data available in the same location

// Define GlobalContext
const GlobalContext = React.createContext();

// Dummy getItemDetail function
const getItemDetail = (id) => items.find(item => item.id === id);

// Cart Component
function Cart() {
  const { cart } = useContext(GlobalContext);

  return (
    <div className="cart-container">
      <h1>Cart</h1>
      {!cart.length ? (
        <p>No Item Added! Please add something to your cart</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-price">${item.price}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-expectedDelivery">(Expected Delivery 3 - 6 days)</div>
              </div>
            ))}
          </div>
          <Link to="/checkout">
            <button className="item-btn">Next</button>
          </Link>
        </>
      )}
    </div>
  );
}

// Checkout Component
const Checkout = () => {
  const { cart, orders, addItemToOrderList, clearCart } = useContext(GlobalContext);
  const { discount, extraFees, tax } = { discount: 20, extraFees: 99, tax: 5 };
  const subTotal = Math.floor(cart?.reduce((sum, curr) => sum + curr.price, 0));
  const total = Math.floor(subTotal + extraFees + tax - (subTotal + extraFees + tax) * (discount / 100));
  const [isOrdered, setIsOrdered] = useState(false);

  const handlePay = () => {
    addItemToOrderList({
      orderId: orders.length + 1,
      buyerId: 1,
      items: [...cart],
      price: total,
      address: "7 Rusk Court",
      deliveryDate: "11/28/2022",
      isDelivered: false,
    });
    clearCart();
    setIsOrdered(true);
  };

  return (
    <div className="checkout-container">
      {isOrdered ? (
        <h3>Yay! 🚀 Order placed successfully. <Link to="/">Shop more!</Link></h3>
      ) : (
        <>
          <div>
            <div className="custom-row">
              <h4>Order Review</h4>
              <span>{cart?.length} items in cart</span>
            </div>
            <div className="custom-row">
              <h4>Coupons</h4>
              <span>Not Available</span>
            </div>
            <div className="custom-row">
              <h4>Checkout Summary</h4>
              <div className="checkout-summary">
                <span>Subtotal</span>
                <span>${subTotal}</span>
              </div>
              <div className="checkout-summary">
                <span>Discount</span>
                <span>{discount}%</span>
              </div>
              <div className="checkout-summary">
                <span>Extra Fee</span>
                <span>${extraFees}</span>
              </div>
              <div className="checkout-summary">
                <span>Tax</span>
                <span>${tax}</span>
              </div>
            </div>
            <div className="custom-row">
              <h4>Total</h4>
              <span>${total}</span>
            </div>
          </div>
          <button className="item-btn" onClick={handlePay}>Pay ${total}</button>
        </>
      )}
    </div>
  );
};

// HomePage Component
function HomePage() {
  return (
    <section>
      <ItemList items={items} />
    </section>
  );
}

// Item Component
function Item({ name, rating, price, saleDiscount, image, brand }) {
  return (
    <div className="item-card">
      <img src={image} alt={"Item image"} className="w-full" />
      <div className="item-brand">{brand}</div>
      <div className="item-name">{name}</div>
      <div className="item-info">
        <div className="item-price">${price}</div>
        <div className="item-rating">{rating}&#9733;</div>
      </div>
    </div>
  );
}

// ItemDetail Component
function ItemDetail() {
  const { id } = useParams();
  const itemId = parseInt(id);
  const item = !!itemId && getItemDetail(itemId);
  const { addItemToCartList, cart } = useContext(GlobalContext);
  const [isAdded, setIsAdded] = useState(cart.findIndex((c) => c.id === itemId) > -1);

  return (
    <div className="item-detail-container">
      <Link to="/"> &#8592; Back</Link>
      <div className="item-detail">
        <div className="item-detail-image">
          <img src={item?.image} alt={"Item image"} />
        </div>
        <div className="item-detail-info">
          <div className="item-brand" style={{ margin: "0px 10px" }}>{item?.brand}</div>
          <div className="item-name">{item?.name}</div>
          <div className="item-price">${item?.price}</div>
          <select className="item-size">
            <option value={"S"}> Select size (S)</option>
            <option value={"M"}> Select size (M)</option>
            <option value={"L"}> Select size (L)</option>
            <option value={"XL"}> Select size (XL)</option>
          </select>
          <button className="item-btn" disabled={isAdded} onClick={() => { addItemToCartList(item); setIsAdded(true); }}>
            {isAdded ? <Link to="/cart">Go to Cart</Link> : "Add To bag"}
          </button>
          <p className="item-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
      </div>
    </div>
  );
}

// ItemList Component
function ItemList({ items }) {
  return (
    <div className="item-list">
      {items.map((item) => (
        <Link to={`/item/${item.id}`} key={item.id}>
          <Item name={item.name} rating={item.rating} price={item.price} saleDiscount={item.saleDiscount} image={item.image} brand={item.brand} />
        </Link>
      ))}
    </div>
  );
}

// Navbar Component
const Navbar = () => {
  const { cart } = useContext(GlobalContext);

  return (
    <nav className="navbar">
      <h3>MyStore</h3>
      <ul className="navbar-ul">
        <li>Shop</li>
        <li>About</li>
        <li>
          <Link to="/cart">
            Cart <span className="card-count">({cart?.length})</span>
          </Link>
        </li>
      </ul>
      <button className="nav-btn">Login</button>
    </nav>
  );
};

// Main Application Component
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
