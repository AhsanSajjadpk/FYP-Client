import { Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useSearchParams,  } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ShopSection = () => {
  let [grid, setGrid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  let [active, setActive] = useState(false);
  let sidebarController = () => {
    setActive(!active);
  };

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
   const navigate = useNavigate();
  
  useEffect(() => {

    if(localStorage.getItem("paymentSuccess") === "true"){
      navigate("/checkout");
    }


    setIsLoading(true);
    axios
      .get("https://instagrocerrenderserver.up.railway.app/api/productCategories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://instagrocerrenderserver.up.railway.app/api/products")
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Products:", error);
        setIsLoading(false);
      });
  }, []);

  const { addToCart } = useContext(CartContext);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery);
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <section className="shop py-80">
        <div className="container container-lg">
          <div className="row">
            <div className="col-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="shop py-80">
      <div className={`side-overlay ${active && "show"}`}></div>
      <div className="container container-lg">
        <div className="row">
          {/* Sidebar Start */}
          <div className="col-lg-3">
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
              >
                <i className="ph ph-x" />
              </button>
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  {categories.map((category) => (
                    <li className="mb-24" key={category.category_id}>
                      <Link
                        to={`/shop/c/${category.category_id}`}
                        className="text-gray-900 hover-text-main-600"
                      >
                        {category.category_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Sidebar End */}
          {/* Content Start */}
          <div className="col-lg-9">
            {/* Top Start */}
            <div className="flex-between gap-16 flex-wrap mb-40 ">
              <span className="text-gray-900"></span>
              <div className="position-relative flex-align gap-16 flex-wrap">
                <div className="list-grid-btns flex-align gap-16">
                  <button
                    onClick={() => setGrid(true)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                      grid === true && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph-bold ph-list-dashes" />
                  </button>
                  <button
                    onClick={() => setGrid(false)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
                      grid === false && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph ph-squares-four" />
                  </button>
                </div>

                <button
                  onClick={sidebarController}
                  type="button"
                  className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                >
                  <i className="ph-bold ph-funnel" />
                </button>
              </div>
            </div>
            {/* Top End */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-5">
                <h3 className="text-gray-900 mb-3">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className={`list-grid-wrapper ${grid && "list-view"}`}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card h-100 p-16 border border-gray-200 hover-border-main-600 rounded-16 position-relative transition-2">
                    <div className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative overflow-hidden">
                      <img
                        src={product.ImageURL}
                        alt="Not Available"
                        className="max-w-unset"
                      />
                    </div>
                    <div className="product-card__content mt-16">
                      <h6 className="title text-lg fw-semibold mt-12 mb-8">
                        <Link
                          to="/product-details-two"
                          className="link text-line-2"
                          tabIndex={0}
                        >
                          {product.product_name}
                        </Link>
                      </h6>
                      {/* <div className="flex-align mb-20 mt-16 gap-6">
                        <span className="text-xs fw-medium text-gray-500">
                          4.8
                        </span>
                        <span className="text-15 fw-medium text-warning-600 d-flex">
                          <i className="ph-fill ph-star" />
                        </span>
                        <span className="text-xs fw-medium text-gray-500">
                          (17k)
                        </span>
                      </div> */}
                      <div className="mt-18">
                        <div
                          className="progress w-100 bg-color-three rounded-pill h-4"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow={35}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-main-two-600 rounded-pill"
                            style={{ width: "65%" }}
                          />
                        </div>
                        {/* <span className="text-gray-900 text-xs fw-medium mt-8">
                          Sold: 18/35
                        </span> */}
                      </div>
                      <div className="product-card__price my-20">
                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                          ${ (product.price + 20).toFixed(2)}
                        </span>
                        <br />
                        <span className="text-heading text-md fw-semibold ">
                          ${product.price}{" "}
                          <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                        </span>
                      </div>
                      <Link
                        to=""
                        className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                        tabIndex={0}
                        onClick={() => addToCart(product)}
                      >
                        Add To Cart <i className="ph ph-shopping-cart" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Content End */}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
