import React from 'react'

const BottomFooter = () => {
    return (
        <div className="bottom-footer bg-color-one py-8">
            <div className="container container-lg">
                <div className="bottom-footer__inner flex-between flex-wrap gap-16 py-16">
                    <p className="bottom-footer__text ">
                        Marketpro eCommerce © 2024. All Rights Reserved{" "}
                    </p>
                    <div className="flex-align gap-8 flex-wrap">    
                        <img src="assets/images/logo/bottom-footer.png" alt="" />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default BottomFooter