import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import BannerOne from "../components/BannerOne";
import FeatureOne from "../components/FeatureOne";

import ShippingOne from "../components/ShippingOne";
import NewsletterOne from "../components/NewsletterOne";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import OrganicOne from "../components/OrganicOne";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
const HomePageOne = () => {

  return (

    <>

      {/* Preloader */}
      <Preloader />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />

      {/* FeatureOne */}
      <FeatureOne />

      {/* PromotionalOne */}
      {/* <PromotionalOne /> */}

      {/* FlashSalesOne */}
      {/* <FlashSalesOne /> */}

      {/* ProductListOne */}
      {/* <ProductListOne /> */}

      {/* OfferOne */}
      {/* <OfferOne /> */}

      {/* RecommendedOne */}
      {/* <RecommendedOne /> */}

      {/* HotDealsOne */}
      {/* <HotDealsOne /> */}

      {/* TopVendorsOne */}
      {/* <TopVendorsOne /> */}

      {/* BestSellsOne */}
      {/* <BestSellsOne /> */}

      {/* DeliveryOne */}
      {/* <DeliveryOne /> */}

      {/* OrganicOne */}
      <OrganicOne />

      {/* ShortProductOne */}
      {/* <ShortProductOne /> */}

      {/* BrandOne */}
      {/* <BrandOne /> */}

      {/* NewArrivalOne */}
      {/* <NewArrivalOne /> */}

      {/* ShippingOne */}
      <ShippingOne />

      {/* NewsletterOne */}
      <NewsletterOne />

      {/* FooterTwo */}
      <FooterTwo />

      {/* BottomFooter */}
      <BottomFooter />


    </>
  );
};

export default HomePageOne;
