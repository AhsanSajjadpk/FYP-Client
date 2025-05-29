import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51KUPeCJpxlGmZ79kug9YY4JyanqNAknBwkAor0t1ARtxvqDrsm8nBeeHWUKIlP6xXZEGrsYX74GXpOd4ChAapyp70040d4ix2O"
); // Replace with your actual public key

const Checkout = () => {
  const { cartItems, removeAllFromCart } = useContext(CartContext);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://instagrocerrenderserver.up.railway.app/api/cities/"
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // calculated subtotal of each product
  const getItemSubtotal = (item) => {
    return item.quantity * item.price;
  };

  // calculated sum of all product
  const total = cartItems.reduce((acc, item) => acc + getItemSubtotal(item), 0);

  const [selectedPayment, setSelectedPayment] = useState("payment2");
  const amount = total + 10; // USD for now

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.id);
  };
  const handleStripePayment = async () => {
    const stripe = await stripePromise;

    // Call your backend to create the Checkout session
    const response = await fetch(
      "https://instagrocerrenderserver.up.railway.app/api/stripeSession/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }), // Send amount to backend
      }
    );

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    console.log(result);
    if (result.error) {
      alert(result.error.message);
    }
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    // businessName: '',
    country: "Pakistan (PK)",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    notes: "",
    transactionId: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    // businessName: Yup.string().required('Business name is required'),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    postalCode: Yup.string().required("Postal code is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\d+$/, "Phone must be numeric"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    // transactionId: Yup.string().when([], {
    //     is: () => selectedPayment === "payment1",
    //     then: Yup.string().required('Transaction ID is required for bank transfer'),
    //     otherwise: Yup.string()
    // }),
  });

  const isCartEmpty = cartItems.length === 0;

  // place order
  const [loading, setLoading] = useState(false);
  const [checkPayment, setcheckPayment] = useState(false);

  useEffect(() => {
    const paymentStatus = localStorage.getItem("paymentSuccess");
    if (paymentStatus === "true" && selectedPayment === "payment2") {
      setcheckPayment(true);
      // Clean up
    } else if (selectedPayment === "payment3") {
      setcheckPayment(true);
    } else {
      setcheckPayment(false);
    }
  }, [selectedPayment]);
  const customerData = JSON.parse(localStorage.getItem("customerData"));
  // const cartItems = JSON.parse(localStorage.getItem("cartitems"));
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        customer_id: customerData?.customerId || null, // local storage
        merchant_id: 2, // Replace accordingly
        warehouse_id: 3,
        time_id: 4,
        total_price: amount,
        status_id: 1, // e.g., "Pending"
      };

      const response = await axios.post(
        "https://instagrocerrenderserver.up.railway.app/api/order/createOrder",
        orderData
      );
      // console.log("Order Created response orderid", response.data.orderId)
      const orderId = response.data.orderId; // Assuming this is returned after order is placed


      console.log("Order placed successfully:", response.data);

// Loop through each cart item and post as individual sales
for (const item of cartItems) {
  const saleData = {
    order_id: orderId,
    product_id: item.product_id,
    time_id: 4, // Replace with correct time_id if needed
    customer_id: customerData?.customerId || null,
    city_id: item.warehouse_id, // Assuming warehouse is city-representative
    category_id: item.category_id,
    quantity: item.quantity,
    sales_amount: (item.price * item.quantity).toFixed(2),
  };

  try {
    const response2 = await axios.post(
      "https://instagrocerrenderserver.up.railway.app/api/sale/createSale",
      saleData
    );
    console.log("Sales data sent:", response2.data);
  } catch (error) {
    console.error("Failed to send sale data:", error);
  }
}


      // const saleData = {
      //   order_id: response.data.orderId, // Dummy order ID
      //   product_id: 5, // Dummy product ID
      //   time_id: 4, // Matches your time_id hint
      //   customer_id: customerData?.id || null, // From localStorage or session
      //   city_id: 3, // Could match warehouse_id or shipping city
      //   category_id: 2, // Product category
      //   quantity: 1, // Assume 1 unit bought
      //   sales_amount: amount, // Total price paid by the customer
      // };
      // const respone2 = await axios.post(
      //   "https://instagrocerrenderserver.up.railway.app/api/sale/createSale",
      //   saleData
      // );
      // console.log("Sales data : ", respone2);

      removeAllFromCart();
      alert("Order placed successfully!");
     
      localStorage.removeItem("paymentSuccess");
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
    handlePlaceOrder();
  };

  return (
    <>
   {localStorage.getItem("paymentSuccess") === "true" ? (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="bg-red-200 p-8 rounded-2xl shadow-xl text-center">
      <i className="text-green-600 text-5xl mb-4">✔️</i>
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h2>
      <p className="text-gray-700">You can place order.</p>
    </div>
  </div>
) : null}

      <section className="checkout py-40">
        <div className="container container-lg">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form className="pe-xl-5">
                  <div className="row gy-3">
                    <div className="col-sm-6 col-xs-6">
                      <Field
                        name="firstName"
                        placeholder="First Name"
                        className="common-input border-gray-100"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-sm-6 col-xs-6">
                      <Field
                        name="lastName"
                        placeholder="Last Name"
                        className="common-input border-gray-100"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    {/* <div className="col-12">
                    <Field name="businessName" placeholder="Business Name" className="common-input border-gray-100" />
                    <ErrorMessage name="businessName" component="div" className="text-danger" />
                  </div> */}
                    <div className="col-12">
                      <Field
                        name="country"
                        placeholder="Country"
                        className="common-input border-gray-100"
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        name="address"
                        placeholder="House number and street name"
                        className="common-input border-gray-100"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        name="apartment"
                        placeholder="Apartment, suite, unit, etc. (Optional)"
                        className="common-input border-gray-100"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        as="select"
                        name="city"
                        className="common-input border-gray-100"
                      >
                        <option value="">Select a city</option>
                        {cities.map((city) => (
                          <option key={city.city_id} value={city.city_name}>
                            {city.city_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        name="postalCode"
                        placeholder="Post Code"
                        className="common-input border-gray-100"
                      />
                      <ErrorMessage
                        name="postalCode"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        name="phone"
                        placeholder="Phone"
                        className="common-input border-gray-100"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="common-input border-gray-100"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-12">
                      <div className="my-40">
                        <h6 className="text-lg mb-24">
                          Additional Information
                        </h6>
                        <Field
                          name="notes"
                          placeholder="Notes about your order..."
                          className="common-input border-gray-100"
                        />
                      </div>
                    </div>
                    {!isCartEmpty && checkPayment && (
                      <button
                        type="submit"
                        className="btn btn-main mt-20 w-100 rounded-8"
                        // onClick={handlePlaceOrder}
                        disabled={loading}
                      >
                        {loading ? "Placing Order..." : "Place Order"}
                      </button>
                    )}
                  </div>
                </Form>
              </Formik>
            </div>

            {/* Order summary and payment section stays same */}
            <div className="col-xl-3 col-lg-4">
              <div className="checkout-sidebar">
                {/* [Order summary code here — unchanged] */}
                <div className="bg-color-three rounded-8 p-24 text-center">
                  <span className="text-gray-900 text-xl fw-semibold">
                    Your Orders
                  </span>
                </div>
                <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                  <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                    <span className="text-gray-900 fw-medium text-xl font-heading-two">
                      Product
                    </span>
                    <span className="text-gray-900 fw-medium text-xl font-heading-two">
                      Subtotal
                    </span>
                  </div>

                  {cartItems.map((item, index) => (
                    <div
                      className="flex-between gap-24 mb-32"
                      key={item.product_id}
                    >
                      <div className="flex-align gap-12">
                        <span className="text-gray-900 fw-normal text-md font-heading-two w-144">
                          {item.product_name}
                        </span>
                        <span className="text-gray-900 fw-normal text-md font-heading-two">
                          <i className="ph-bold ph-x" />
                        </span>
                        <span className="text-gray-900 fw-semibold text-md font-heading-two">
                          {item.quantity}
                        </span>
                      </div>
                      <span className="text-gray-900 fw-bold text-md font-heading-two">
                        ${getItemSubtotal(item).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-top border-gray-100 pt-30  mt-30">
                    <div className="mb-0 flex-between gap-8">
                      <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                        Total
                      </span>
                      <span className="text-gray-900 font-heading-two text-md fw-bold">
                        {isCartEmpty ? "$0.00" : `$${(total + 10).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Payment methods */}
                <div className="mt-32">
                  {[2, 3].map((num) => (
                    <div key={num} className="payment-item">
                      <div className="form-check common-check common-radio py-16 mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          id={`payment${num}`}
                          checked={selectedPayment === `payment${num}`}
                          onChange={handlePaymentChange}
                          disabled={
                            localStorage.getItem("paymentSuccess") === "true"
                          }
                        />
                        <label
                          className="form-check-label fw-semibold text-neutral-600"
                          htmlFor={`payment${num}`}
                        >
                          {num === 2 ? "Check payments" : "Cash on delivery"}
                        </label>
                      </div>

                      {selectedPayment === `payment${num}` &&
                        num === 2 &&
                        total > 0 && (
                          <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                            <p className="text-gray-800 mb-3">
                              You'll be redirected to Stripe to complete payment
                              securely.
                            </p>
                            <button
                              className="btn btn-main w-100 rounded-8"
                              type="button"
                              onClick={handleStripePayment}
                              disabled={
                                localStorage.getItem("paymentSuccess") ===
                                "true"
                              }
                            >
                              Pay with Stripe
                            </button>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {/* END PAYMNENT METHODS */}

                <div className="mt-32 pt-32 border-top border-gray-100">
                  <p className="text-gray-500">
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our{" "}
                    <Link
                      to="#"
                      className="text-main-600 text-decoration-underline"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
