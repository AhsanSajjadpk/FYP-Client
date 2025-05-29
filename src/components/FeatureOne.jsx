import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeatureOne = () => {

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get('https://instagrocerrenderserver.up.railway.app/api/productCategories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button" onClick={onClick}
                className={` ${className} slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-right" />
            </button>
        );
    }
    function SamplePrevArrow(props) {
        const { className, onClick } = props;

        return (

            <button
                type="button"
                onClick={onClick}
                className={`${className} slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-left" />
            </button>
        );
    }
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 10,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1699,
                settings: {
                    slidesToShow: 9,
                },
            },
            {
                breakpoint: 1599,
                settings: {
                    slidesToShow: 8,
                },
            },
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 6,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 424,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 359,
                settings: {
                    slidesToShow: 1,
                },
            },

        ],
    };
    return (
        <div className="feature" id="featureSection">
        <div className="container container-lg">
            <h4 >Categories</h4>
            <div className="position-relative arrow-center">
                <div className="flex-align">
                    <button
                        type="button"
                        className="slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
                    >
                        <i className="ph ph-caret-left" />
                    </button>
                    <button
                        type="button"
                        className="slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
                    >
                        <i className="ph ph-caret-right" />
                    </button>
                </div>
                <div className="feature-item-wrapper">
                    {isLoading ? (
                        <div className="flex-center" style={{ minHeight: '200px' }}>
                            <div className="loading-spinner">
                                <i className="ph ph-spinner ph-spin text-3xl text-main-600"></i>
                            </div>
                        </div>
                    ) : (
                        <Slider {...settings}>
                            {categories.map((category) => (
                                <div className="feature-item text-center" key={category.category_id}>
                                    <div className="feature-item__thumb rounded-circle overflow-hidden">
                                        <Link to={`/shop/c/${category.category_id}`} className="w-100 h-100 flex-center">
                                            <img src={category.ImageURL} alt="img" />
                                        </Link>
                                    </div>
                                    <div className="feature-item__content mt-16">
                                        <h6 className="text-lg mb-8">
                                            <Link to={`/shop/c/${category.category_id}`} className="text-inherit font">
                                            <b>  {category.category_name}</b> 
                                            </Link>
                                        </h6>
                                        <span className="text-sm text-gray-400">{category.category_description}</span>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};

export default FeatureOne