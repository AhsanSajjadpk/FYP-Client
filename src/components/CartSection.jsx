import React from "react";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import QuantityControl from "../helper/QuantityControl";
import { useNavigate } from "react-router-dom";

const CartSection = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  // const [quantities, setQuantities] = useState(() =>
  //   cartItems.reduce((acc, item) => {
  //     acc[item.product_id] = 1; // default quantity
  //     return acc;
  //   }, {})
  // );

  // const handleQuantityChange = (productId, newQuantity) => {
  //   setQuantities((prev) => ({
  //     ...prev,
  //     [productId]: newQuantity,
  //   }));
  // };

  // const getItemSubtotal = (productId, price) => {
  //   const qty = quantities[productId] || 1;
 
  //   const qty = productId;
  //   return qty * price;
  // };

const getItemSubtotal = (item) => {
  return item.quantity * item.price;
};


 const total = cartItems.reduce(
  (acc, item) => acc + getItemSubtotal(item),
  0
);

const navigate = useNavigate();
 useEffect(() => {
    if(localStorage.getItem("paymentSuccess") === "true"){
      navigate("/checkout");
    }

  }, [])

  const isCartEmpty = cartItems.length === 0;

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-xl-9 col-lg-8">
            <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
              <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                <table className="table style-three">
                  <thead>
                    <tr>
                      <th className="h6 mb-0 text-lg fw-bold">Delete</th>
                      <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
                      <th className="h6 mb-0 text-lg fw-bold">Price</th>
                      <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                      <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length === 0 ? (
                      <tr>
                        <td colSpan="5">
                          <p className="text-black text-lg font-medium text-center">
                            Your cart is empty!
                          </p>
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item, index) => (
                        <tr key={item.product_id}>
                          <td>
                            <button
                              type="button"
                              className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                              onClick={() => removeFromCart(item.product_id)}
                            >
                              <i className="ph ph-x-circle text-2xl d-flex" />
                              Remove
                            </button>
                          </td>
                          <td>
                            <div className="table-product d-flex align-items-center gap-24">
                              <Link className="table-product__thumb border border-gray-100 rounded-8 flex-center ">
                                <img
                                  src= {item.ImageURL}
                                  alt=""
                                />
                              </Link>
                              <div className="table-product__content text-start">
                                <h6 className="title text-lg fw-semibold mb-8">
                                  <Link
                                    className="link text-line-2"
                                    tabIndex={0}
                                  >
                                    {item.product_name}
                                  </Link>
                                </h6>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-lg h6 mb-0 fw-semibold">
                              ${item.price}
                            </span>
                          </td>
                          {/* <QuantityControl initialQuantity={1} /> */}
                          <td>
                            {/* initialQuantity={quantities[item.product_id] || 1} */}
                            {/* onChange={(newQty) => */}
                            {/* //   handleQuantityChange(item.product_id, newQty) */}
                            {/* // } */}
                            {/* <QuantityControl
                              initialQuantity={item.quantity}
                              onChange={(newQty) => {
                                updateQuantity(item.product_id, newQty);
                                handleQuantityChange(item.product_id, newQty);
                              }}
                            /> */}
                            <QuantityControl
                              initialQuantity={item.quantity}
                              onChange={(newQty) =>
                                updateQuantity(item.product_id, newQty)
                              }
                            />
                          </td>
                          <td>
                            <span className="text-lg h6 mb-0 fw-semibold">
                              $
                              {/* {getItemSubtotal(
                                item.product_id,
                                item.price
                              ).toFixed(2)} */}
                              {getItemSubtotal(item).toFixed(2)}

                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
              <h6 className="text-xl mb-32">Cart Totals</h6>
              <div className="bg-color-three rounded-8 p-24">
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">
                    Subtotal
                  </span>
                  <span className="text-gray-900 fw-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">
                    Extimated Delivery
                  </span>
                  <span className="text-gray-900 fw-semibold">Free</span>
                </div>
                <div className="mb-0 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">
                    Extimated Taxs
                  </span>
                  <span className="text-gray-900 fw-semibold">
                    {isCartEmpty ? "$0.00" : "USD 10.00"}
                  </span>
                </div>
              </div>
              <div className="bg-color-three rounded-8 p-24 mt-24">
                <div className="flex-between gap-8">
                  <span className="text-gray-900 text-xl fw-semibold">
                    Total
                  </span>
                  <span className="text-gray-900 text-xl fw-semibold">
                    {isCartEmpty ? "$0.00" : `$${(total + 10).toFixed(2)}`}
                  </span>
                </div>
              </div>
              <Link
                to={isCartEmpty ? "#" : "/checkout"}
                className={`btn btn-main mt-40 py-18 w-100 rounded-8 ${
                  isCartEmpty ? "disabled opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={(e) => isCartEmpty && e.preventDefault()}
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSection;
