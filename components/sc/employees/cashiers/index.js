'use client'

import Footer from "../../../layout/footer"
import Header from "../../../layout/header"
import NavBar from "../../../layout/navbar"

export default function CashierPage() {
  return (
    <>
    <div id="wrapper" className="bg-light">
        <NavBar />
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <Header />
                <div class="container-fluid">
                    <h1
                        class="font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        My Cashiers</h1>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Cashier Info</p>
                            <div class="dropdown border rounded-pill"><button
                                    class="btn btn-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Cashier</strong></button>
                                <div class="dropdown-menu"><a class="dropdown-item" href="#">First Item</a><a
                                        class="dropdown-item" href="#">Second Item</a><a class="dropdown-item"
                                        href="#">Third Item</a></div>
                            </div>
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
                            <div class="table-responsive font-monospace text-center border-1 shadow-sm table mt-2"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Username</th>
                                            <th>Full Name</th>
                                            <th>Salary</th>
                                            <th>Ava. Salary</th>
                                            <th>Start Date</th>
                                            <th>Branch</th>
                                            <th colspan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>GD8EG5</td>
                                            <td>Beef Liver</td>
                                            <td>50.8798</td>
                                            <td>640</td>
                                            <td>Kayole</td>
                                            <td>Kayole</td>
                                            <td><i class="far fa-edit text-start text-warning "
                                                   ></i></td>
                                            <td><i class="far fa-trash-alt text-start text-danger"
                                                    ></i></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td><strong>No.</strong></td>
                                            <td><strong>Username</strong></td>
                                            <td><strong>Full Name</strong></td>
                                            <td><strong>Salary</strong></td>
                                            <td><strong>Ava. Salary</strong></td>
                                            <td><strong>Start Date</strong></td>
                                            <td><strong>Branch</strong></td>
                                            <td colspan="2"><strong>Action</strong></td>
                                        </tr>
                                    </tfoot>
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
                            </div>
                        </div>
                    </div>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Cashier Payments</p>
                            <div class="dropdown border rounded-pill"><button
                                    class="btn btn-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Cashier</strong></button>
                                <div class="dropdown-menu"><a class="dropdown-item" href="#">First Item</a><a
                                        class="dropdown-item" href="#">Second Item</a><a class="dropdown-item"
                                        href="#">Third Item</a></div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row d-flex justify-content-between">
                                <div class="col-md-6 text-nowrap">
                                    <div id="dataTable_length-1" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Show&nbsp;<select
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="10" selected="">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>&nbsp;</label></div>
                                </div>
                                <div class="col-md-6 text-nowrap">
                                    <div id="dataTable_length-2" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Cashier&nbsp;<select
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="all" selected="">All</option>
                                            </select>&nbsp;</label></div>
                                </div>
                            </div>
                            <div class="table-responsive font-monospace text-center border-1 shadow-sm table mt-2"
                                id="dataTable-1" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Username</th>
                                            <th>Full Name</th>
                                            <th>Salary</th>
                                            <th>Paid Salary</th>
                                            <th>Ava. Salary</th>
                                            <th colspan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>GD8EG5</td>
                                            <td>Beef Liver</td>
                                            <td>50.8798</td>
                                            <td>640</td>
                                            <td>640</td>
                                            <td><i class="far fa-edit text-start text-warning"
                                                    ></i></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td><strong>No.</strong></td>
                                            <td><strong>Username</strong></td>
                                            <td><strong>Full Name</strong></td>
                                            <td><strong>Salary</strong></td>
                                            <td><strong></strong><strong>Paid Salary</strong></td>
                                            <td><strong></strong><strong>Ava. Salary</strong></td>
                                            <td colspan="2"><strong>Action</strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-md-6 align-self-center">
                                    <p id="dataTable_info-1" class="dataTables_info" role="status" aria-live="polite">
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
                            </div>
                        </div>
                    </div>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Cashier1 Payments</p>
                            <div class="dropdown border rounded-pill"><button
                                    class="btn btn-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Cashier</strong></button>
                                <div class="dropdown-menu"><a class="dropdown-item" href="#">First Item</a><a
                                        class="dropdown-item" href="#">Second Item</a><a class="dropdown-item"
                                        href="#">Third Item</a></div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row d-flex justify-content-between">
                                <div class="col-md-6 text-nowrap">
                                    <div id="dataTable_length-3" class="dataTables_length" aria-controls="dataTable">
                                        <label class="form-label">Show&nbsp;<select
                                                class="d-inline-block form-select form-select-sm">
                                                <option value="10" selected="">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>&nbsp;</label></div>
                                </div>
                            </div>
                            <div class="table-responsive font-monospace text-center border-1 shadow-sm table mt-2"
                                id="dataTable-2" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped table-hover table-bordered my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Username</th>
                                            <th>Full Name</th>
                                            <th>Paid Salary</th>
                                            <th>Paid Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>GD8EG5</td>
                                            <td>Beef Liver</td>
                                            <td>640</td>
                                            <td>640</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td><strong>No.</strong></td>
                                            <td><strong>Username</strong></td>
                                            <td><strong>Full Name</strong></td>
                                            <td><strong></strong><strong>Paid Salary</strong></td>
                                            <td><strong></strong><strong>Paid Date</strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-md-6 align-self-center">
                                    <p id="dataTable_info-2" class="dataTables_info" role="status" aria-live="polite">
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
                            </div>
                        </div>
                    </div>
                    <div class="modal fade font-monospace text-center border rounded" role="dialog" tabindex="-1"
                        id="modal-1">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                            role="document">
                            <div class="modal-content">
                                <div class="modal-header text-center">
                                    <h1 class="modal-title text-capitalize fw-bolder text-center">edit Cashier</h1>
                                    <button class="btn-close" type="button" aria-label="Close"
                                        data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="font-monospace text-center d-flex justify-content-between">
                                        <p class="lead text-capitalize fs-4 fw-bolder text-center text-danger">Meshack
                                            Owino</p>
                                        <p class="font-monospace fs-5 fw-bolder text-primary">03892</p>
                                    </div>
                                    <div class="font-monospace text-center d-grid">
                                        <div class="row d-flex">
                                            <div class="col d-flex">
                                                <div class="row d-flex me-xl-0 ms-xl-" style={{width: "100%"}}>
                                                    <div class="col-xl-12 d-grid"><label class="form-label">First
                                                            Name</label><input
                                                            class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                            type="text" required/></div>
                                                    <div class="col-xl-12 d-grid"><label
                                                            class="form-label">Salary</label><input
                                                            class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                            type="text" required /></div>
                                                </div>
                                                <div class="row d-flex ms-xl-0" style={{width: "100%"}}>
                                                    <div class="col-xl-12 d-grid"><label class="form-label">Last
                                                            Name</label><input
                                                            class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                            type="text" required /></div>
                                                    <div class="col-xl-12 d-grid"><label class="form-label">Available
                                                            Salary</label>
                                                        <div class="input-group"><span
                                                                class="font-monospace fw-bolder text-center border rounded-pill border-2 border-success shadow-sm d-flex justify-content-between input-group-text"
                                                                ><i
                                                                    class="far fa-edit text-warning"
                                                                    ></i>700</span><input
                                                                class="border rounded-pill border-2 border-success shadow-sm form-control form-control-lg ms-xl-0"
                                                                type="text" style={{width: "50%"}}
                                                                placeholder="New Available Salary" disabled /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-1"
                                        data-bs-toggle="modal">Close</button><button class="btn btn-primary fw-bolder"
                                        type="button" data-bs-target="#modal-1" data-bs-toggle="modal">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade font-monospace text-center border rounded" role="dialog" tabindex="-1"
                        id="modal-2">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                            role="document">
                            <div class="modal-content">
                                <div class="modal-header text-center">
                                    <h1 class="modal-title text-capitalize fw-bolder text-center">Pay Cashier</h1>
                                    <button class="btn-close" type="button" aria-label="Close"
                                        data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="font-monospace text-center d-flex justify-content-between">
                                        <p class="lead text-capitalize fs-4 fw-bolder text-center text-danger">Meshack
                                            Owino</p>
                                        <p class="font-monospace fs-5 fw-bolder text-primary">03892</p>
                                    </div>
                                    <div class="font-monospace text-center d-grid">
                                        <div class="row d-flex">
                                            <div class="col d-flex">
                                                <div class="row d-flex me-xl-0 ms-xl-" style={{width: "100%"}}>
                                                    <div class="col-xl-12 d-grid"><label
                                                            class="form-label">Salary</label><input
                                                            class="border rounded-pill border-2 border-success shadow-sm form-control-lg"
                                                            type="text" required /></div>
                                                </div>
                                                <div class="row d-flex ms-xl-0" style={{width: "100%"}}>
                                                    <div class="col-xl-12 d-grid"><label class="form-label">Payment
                                                            Amount</label>
                                                        <div class="input-group"><span
                                                                class="font-monospace fw-bolder text-center border rounded-pill border-2 border-success shadow-sm d-flex justify-content-between input-group-text"
                                                                >700</span><input
                                                                class="border rounded-pill border-2 border-success shadow-sm form-control form-control-lg ms-xl-0"
                                                                type="text" style={{width: "50%"}} placeholder="Amount"
                                                                disabled="" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-2"
                                        data-bs-toggle="modal">Close</button><button class="btn btn-primary"
                                        type="button" data-bs-target="#modal-2" data-bs-toggle="modal">Save</button>
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
