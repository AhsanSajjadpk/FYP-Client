import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import HomePageOne from "./pages/HomePageOne";
import PhosphorIconInit from "./helper/PhosphorIconInit";
import HomePageTwo from "./pages/HomePageTwo";
import ShopPage from "./pages/ShopPage";
import ShopPageCategory from "./pages/ShopPageCategory";
import ProductDetailsPageOne from "./pages/ProductDetailsPageOne";
import ProductDetailsPageTwo from "./pages/ProductDetailsPageTwo";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ContactPage from "./pages/ContactPage";
import SuccessPage from "./pages/SuccessPage";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <PhosphorIconInit />

        <Routes>
          <Route exact path="/" element={<HomePageOne />} />
          {/* <Route exact path="/index-two" element={<HomePageTwo />} /> */}
          <Route exact path="/shop" element={<ShopPage />} />
          <Route exact path="/shop/c/:id" element={<ShopPageCategory />} />
          {/* <Route exact path="/product-details" element={<ProductDetailsPageOne />} />
          <Route exact path="/product-details-two" element={<ProductDetailsPageTwo />} /> */}
          <Route exact path="/cart" element={<CartPage />} />
          <Route exact path="/checkout" element={<CheckoutPage />} />
          <Route exact path="/account" element={<AccountPage />} />
          {/* <Route exact path="/blog" element={<BlogPage />} /> */}
          {/* <Route exact path="/blog-details" element={<BlogDetailsPage />} /> */}
          <Route exact path="/contact" element={<ContactPage />} />
          <Route exact path="/success" element={<SuccessPage />} />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
