'use client'

import Footer from "../../../../layout/footer"
import Header from "../../../../layout/header"
import NavBar from "../../../../layout/navbar"

export default function MakeSalesPage() {
  return (
    <>
    <div id="wrapper" className="bg-light">
        <NavBar />
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <Header />
                <div class="container-fluid">
                    <h1
                        class=" font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        sell Products</h1>
                    <div class="card shadow">
                        <div class="card-header py-3">
                            <p class="text-primary m-0 fw-bold">Product Info</p>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 text-nowrap">
                                    <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Show&nbsp;<select
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="10" selected="">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>&nbsp;</label></div>
                                </div>
                                <div class="col-md-6">
                                    <div class="text-md-end dataTables_filter" id="dataTable_filter"><label
                                            class="form-label"><input type="search" class="form-control form-control-sm"
                                                aria-controls="dataTable" placeholder="Search" /></label></div>
                                </div>
                            </div>
                            <div class="table-responsive font-monospace text-center border-2  shadow-sm table mt-2"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Amount</th>
                                            <th>Sold</th>
                                            <th colspan="1">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Beef Liver</td>
                                            <td>50.8798</td>
                                            <td>640</td>
                                            <td><input class="border rounded-pill border-2 border-success shadow"
                                                    type="number" data-bss-hover-animate="pulse"
                                                    placeholder="Enter amount" readonly="" /></td>
                                            <td>0</td>
                                            <td><input type="checkbox" data-bss-hover-animate="pulse" /></td>
                                        </tr>
                                    </tbody>
                                    
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-md-6 align-self-center">
                                    <p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">
                                        Showing 1 to 10 of 27</p>
                                </div>
                                <div class="col-md-6">
                                    <nav
                                        class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                        <ul class="pagination">
                                            <li class="page-item disabled"><a class="page-link" aria-label="Previous"
                                                    href="#"><span aria-hidden="true">«</span></a></li>
                                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                                            <li class="page-item"><a class="page-link" aria-label="Next" href="#"><span
                                                        aria-hidden="true">»</span></a></li>
                                        </ul>
                                    </nav>
                                </div>
                                <div class="col-sm-12" style={{width: "100%"}}>
                                    <div class="text-center d-flex flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-start align-content-start align-self-start flex-wrap order-first m-auto"
                                        style={{width: "100%"}}>
                                        <div class="row text-center d-flex">
                                            <div
                                                class="col font-monospace text-uppercase text-center d-flex align-content-start align-self-center flex-wrap order-first m-auto">
                                                <div class="row text-start d-grid me-xl-0">
                                                    <div class="col d-grid"><strong
                                                            class="text-uppercase text-center mb-xl-0 pb-xl-2">Total
                                                            Amount</strong><input
                                                            class="border tex-align-center fw-bold text-primary rounded-pill border-2 border-success shadow form-control-lg"
                                                            type="text" readonly="" required=""
                                                            disabled="" /></div>
                                                    <div class="col d-grid"><strong
                                                            class="text-uppercase text-center pt-xl-0 mt-xl-3">Change</strong><input
                                                            class="border tex-align-center fw-bold text-danger rounded-pill border-2 border-success shadow form-control-lg"
                                                            type="text" readonly="" disabled=""
                                                             />
                                                    </div>
                                                </div>
                                                <div class="row d-grid ms-xl-0">
                                                    <div class="col text-center d-grid"><strong
                                                            class="text-uppercase text-align-center mb-xl-2"
                                                            >Payment Type</strong><select
                                                            class="border tex-align-center fw-bold rounded-pill border-2 border-success shadow form-select-lg"
                                                            readonly="" >
                                                            <option value="cash" selected="">Cash</option>
                                                            <option value="m-pesa">M-Pesa</option>
                                                            <option value="both">Cash &amp; M-Pesa</option>
                                                        </select></div>
                                                    <div class="col d-grid"><strong
                                                            class="text-uppercase text-center text-danger mt-xl-2">Enter
                                                            Amount</strong><input
                                                            class="border tex-align-center fw-bold text-success rounded-pill border-2 border-primary shadow form-control-lg"
                                                            type="text" required=""
                                                            />
                                                    </div>
                                                    <div class="col d-grid d-none"><strong
                                                            class="text-uppercase text-center text-danger mt-xl-2">Enter
                                                            Amount</strong><span class="text-start tex-align-center fw-bold text-primary text-decoration-italic"
                                                            style={{fontStyle: "italic",marginTop: "3px"}}>Cash
                                                            Amount</span><input
                                                            class="border rounded-pill fw-bold text-success border-2 border-primary shadow form-control-lg"
                                                            type="text" required=""
                                                            /><span
                                                            class="text-start tex-align-center fw-bold text-primary text-decoration-italic"
                                                            style={{fontStyle: "italic",marginTop: "3px"}}>M-Pesa
                                                            Amount</span><input
                                                            class="border rounded-pill border-2 border-success shadow form-control-lg"
                                                            type="text" required=""
                                                             />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="me-xl-5 ms-xl-5 mt-xl-5 mb-xl-5"><button
                                                class="btn btn-outline-primary btn-md active font-monospace text-uppercase fs-1 fw-bolder text-center border rounded-pill border-2 border-success shadow"
                                                type="submit" style={{marginTop: "6px"}}>Make Sale</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        {/* <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a> */}
    </div>
    </>
  )
}
