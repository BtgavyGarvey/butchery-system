'use client'

export default function LandingPage() {
  return (
    <>
    <div className="body-wrap text-light">
        <header className="site-header">
            <div className="container">
                <div className="site-header-inner">
                    <div className="brand header-brand">
                        <h1 className="m-0">
							<a href="#">
								<img className="header-logo-image" src="/systemFiles/logo.png" alt="Logo" />
                            </a>
                        </h1>
                    </div>
                </div>
            </div>
        </header>

        <main>
            <section className="hero">
                <div className="container">
                    <div className="hero-inner">
						<div className="hero-copy">
	                        <h1 className="hero-title display-6 mt-0 fw-bold"><span className="tweak text-danger">B</span>utchery <span className="tweak text-danger">S</span>ystem</h1>
	                        <p className="hero-paragraph">
                                Our mission is to revolutionize the butcher shop industry by providing a comprehensive POS system that optimizes sales, 
                                empowers precise stock management, leverages data-driven predictions, ensures a seamless user experience, 
                                and offers unwavering 24/7 support. We are committed to empowering businesses with the tools they need to thrive in an ever-evolving market, 
                                fostering efficiency, and maximizing success.
                            </p>
                            
	                        <div className="hero-cta">
                                <p>
                                    <a className="button button-primary" href="/register">Register</a><a className="button" href="/login">Login</a>
                                </p>
                            </div>
						</div>
						<div className="hero-figure anime-element">
							<svg className="placeholder" width="528" height="396" viewBox="0 0 528 396">
								<rect width="528" height="396" style={{fill:"transparent"}}/>
							</svg>
							<div className="hero-figure-box hero-figure-box-01" data-rotation="45deg">
							<img src="/systemFiles/landingImg1.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-02" data-rotation="-45deg">
							<img src="/systemFiles/landingImg2.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-03" data-rotation="0deg">
							<img src="/systemFiles/landingImg3.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-04" data-rotation="-135deg">
							<img src="/systemFiles/landingImg4.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-05">
							<img src="/systemFiles/landingImg1.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-06">
							<img src="/systemFiles/landingImg5.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-07">
							<img src="/systemFiles/landingImg3.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-08" data-rotation="-22deg">
							<img src="/systemFiles/landingImg2.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-09" data-rotation="-52deg">
							<img src="/systemFiles/landingImg5.jpg" alt="logo" />

                            </div>
							<div className="hero-figure-box hero-figure-box-10" data-rotation="-50deg">
							<img src="/systemFiles/landingImg2.jpg" alt="logo" />

                            </div>
						</div>
                    </div>
                </div>
            </section>

            <section className="features section">
                <div className="container">
					<div className="features-inner section-inner has-bottom-divider">
                        <div className="features-wrap">
                            <div className="feature text-center is-revealing">
                                <div className="feature-inner">
                                    <div className="feature-icon">
										<img src="/systemFiles/images/feature-icon-02.svg" alt="Feature 02" />
                                    </div>
                                    <h4 className="feature-title mt-24 text-warning">Optimize Sales Efficiency</h4>
                                    <p className="text-sm mb-0">
                                        Streamline your butcher shop's sales process with our cutting-edge Point of Sale (POS) system, 
                                        designed to enhance efficiency and elevate your customer experience.
                                        
                                    </p>
                                </div>
                            </div>
                            <div className="feature text-center is-revealing">
                                <div className="feature-inner">
                                    <div className="feature-icon">
										<img src="/systemFiles/images/feature-icon-06.svg" alt="Feature 06" />
                                    </div>
                                    <h4 className="feature-title mt-24 text-warning">Sale Reversal</h4>
                                    <p className="text-sm mb-0">
                                        Correct mistakes easily by rolling back or reversing sales transactions that were mistakenly entered or processed.
                                        This helps maintain accurate inventory levels and ensures that stock records accurately reflect the actual quantity of products available.
                                    </p>
                                </div>
                            </div>
                            <div className="feature text-center is-revealing">
                                <div className="feature-inner">
                                    <div className="feature-icon">
										<img src="/systemFiles/images/feature-icon-01.svg" alt="Feature 01" />
                                    </div>
                                    <h4 className="feature-title mt-24 text-warning">Data-Driven Predictions</h4>
                                    <p className="text-sm mb-0">
                                        Harness the power of data to predict future sales trends. Our system utilizes advanced analytics to provide valuable insights, 
                                        empowering you to make informed business decisions.
                                        
                                    </p>
                                </div>
                            </div>
                            <div className="feature text-center is-revealing">
                                <div className="feature-inner">
                                    <div className="feature-icon">
										<img src="/systemFiles/images/feature-icon-03.svg" alt="Feature 03" />
                                    </div>
                                    <h4 className="feature-title mt-24 text-warning">Precision Stock Management</h4>
                                    <p className="text-sm mb-0">
                                        Take control of your inventory like never before. Our butchery system ensures precise stock management, 
                                        minimizing waste and maximizing profitability.
                                    </p>
                                </div>
                            </div>
                            <div className="feature text-center is-revealing">
                                <div className="feature-inner">
                                    <div className="feature-icon">
										<img src="/systemFiles/images/feature-icon-04.svg" alt="Feature 04" />
                                    </div>
                                    <h4 className="feature-title mt-24 text-warning">Seamless User Experience</h4>
                                    <p className="text-sm mb-0">
                                        Enjoy a user-friendly interface that simplifies complex tasks. Our POS system is designed for ease of use, 
                                        ensuring that both staff and customers have a seamless experience.

                                    </p>
                                </div>
                            </div>
                            <div className="feature text-center is-revealing">
                                <div className="feature-inner">
                                    <div className="feature-icon">
										<img src="/systemFiles/images/feature-icon-05.svg" alt="Feature 05" />
                                    </div>
                                    <h4 className="feature-title mt-24 text-warning">24/7 Support and Updates</h4>
                                    <p className="text-sm mb-0">
                                        Stay ahead with continuous support and regular updates. Our team is committed to providing 
                                        assistance around the clock, ensuring your butchery system is always up-to-date and performing at its best.
                                        
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="d-flex justify-content-center h1 fw-bold text-warning">Pricing</div>

            <section className="pricing section ">
                <div className="pricing_container container justify-content-between">
                    <div className="pricing-inner section-inner col-md-6">
                        <div className="pricing-header text-center">
                            <h2 className="section-title mt-0 fw-bold"><span>Basic Package</span></h2>
                            <p className="section-paragraph mb-0">
                                By subscribing to our Basic Package plan, you'll gain access to essential features ensuring smooth sales and inventory management.
                            </p>
                        </div>
						<div className="pricing-tables-wrap">
                            <div className="pricing-table">
                                <div className="pricing-table-inner is-revealing">
                                    <div className="pricing-table-main">
                                        <div className="pricing-table-header pb-24">
                                            <div className="pricing-table-price"><span className="pricing-table-price-currency h2">KSh. </span><span className="pricing-table-price-amount h1 text-warning">1,200</span><span className="text-xs">/month</span></div>
                                            <div className="pricing-table-price m-1 d-flex justify-content-center">per Branch</div>
                                        </div>
										<div className="pricing-table-features-title text-xs pt-24 pb-24">What you will get.</div>
                                        <ul className="pricing-table-features list-reset text-xs">
                                            <li>
                                                <span>Streamlined and efficient sales processing.</span>
                                            </li>
                                            <li>
                                                <span>Precise stock management to minimize waste and maximize profitability.</span>
                                            </li>
                                            <li>
                                                <span>Seamless and intuitive user experience for easy navigation.</span>
                                            </li>
											<li>
												<span>24/7 customer support and regular system updates.</span>
											</li>
                                            <li>
												<span>Expense Monitoring and Tracking.</span>
											</li>
                                            <li>
												<span>Efficient management of employees, including tracking payment activities.</span>
											</li>
                                            <li>
												<span>View total revenue and expenses for the last 6 month.</span>
											</li>
                                        </ul>
                                    </div>
                                    <div className="pricing-table-cta mb-8">
                                        <a className="button button-primary button-shadow button-block" href="#">Subscribe now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pricing-inner section-inner">
                        <div className="pricing-header text-center">
                            <h2 className="section-title mt-0 fw-bold">Premium Package</h2>
                            <p className="section-paragraph mb-0">
                                Upgrade to our Premium Package plan for an advanced experience, including future sales prediction, 
                                cashier oversight, powerful analytics tools, and many more to propel your butcher shop to new heights.
                            </p>
                        </div>
						<div className="pricing-tables-wrap">
                            <div className="pricing-table">
                                <div className="pricing-table-inner is-revealing">
                                    <div className="pricing-table-main">
                                        <div className="pricing-table-header pb-24">
                                            <div className="pricing-table-price"><span className="pricing-table-price-currency h2">KSh. </span><span className="pricing-table-price-amount h1 text-warning">2,000</span><span className="text-xs">/month</span></div>
                                            <div className="pricing-table-price m-1 d-flex justify-content-center">per Branch</div>
                                        </div>
										<div className="pricing-table-features-title text-xs pt-24 pb-24">What you will get</div>
                                        <ul className="pricing-table-features list-reset text-xs">
                                            <li>
                                                <span>All in Basic Package</span>
                                            </li>
                                            <li>
                                                <span>Access to data analytics dashboard for in-depth business insights.</span>
                                            </li>
                                            <li>
                                                <span>Predict future sales trends based on historical sales data.</span>
                                            </li>
											<li>
												<span>Shop regulation - Owner's ability to mark the shop as open or closed, regulating cashier access.</span>
											</li>
                                            <li>
												<span>Tracking cashier login activities</span>
											</li>
                                            <li>
												<span>View total revenue and expenses for the past 5 years.</span>
											</li>
                                            
                                        </ul>
                                    </div>
                                    <div className="pricing-table-cta mb-8">
                                        <a className="button button-primary button-shadow button-block" href="#">Subscribe Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </section>

			<section className="cta section">
				<div className="container">
					<div className="cta-inner section-inner">
						<h3 className="section-title mt-0">Still not convinced on subscribing?</h3>
						<div className="cta-cta">
							<a className="button button-primary button-wide-mobile" href="mailto:mylegiomariae.systems@gmail.com">Get in touch</a>
						</div>
					</div>
				</div>
			</section>
        </main>

        <footer className="site-footer">
            <div className="container">
                <div className="site-footer-inner">
                    <div className="brand footer-brand">
						<a href="#">
							<img className="header-logo-image" src="/systemFiles/images/logo.svg" alt="Logo" />
						</a>
                    </div>
                    <ul className="footer-links list-reset">
                        <li>
                            <a href="#">Contact</a>
                        </li>
                        <li>
                            <a href="#">About us</a>
                        </li>
                        <li>
                            <a href="#">FAQ's</a>
                        </li>
                        <li>
                            <a href="#">Support</a>
                        </li>
                    </ul>
                    <ul className="footer-social-links list-reset">
                        <li>
                            <a href="#">
                                <span className="screen-reader-text">Facebook</span>
                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z" fill="#0270D7"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="screen-reader-text">Twitter</span>
                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z" fill="#0270D7"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="screen-reader-text">Google</span>
                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" fill="#0270D7"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                    <div>&copy; {new Date().getFullYear()} Butchery System, All Rights Reserved. Developed By: <a className="text-warning" href="#"> MyLegio Mariae Systems</a></div>
                </div>
            </div>
        </footer>
    </div>
    </>
  )
}
