'use client'

import Footer from "../../layout/footer"
import Header from "../../layout/header"
import NavBar from "../../layout/navbar"

export default function ExpensePagePage({session}) {
  return (
    <>
    <div className="bg-light">
    <div id="wrapper">
        <NavBar session={session.user}/>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content" >
                <Header session={session.user}/>
                <div class="container-fluid">
                    <h1
                        class=" font-monospace text-uppercase fw-bolder text-center text-light bg-success bg-gradient border-2 border-secondary shadow-sm mb-4">
                        My Products</h1>
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between py-3">
                            <p class="text-primary m-0 fw-bold">Product Info</p>
                            <div class="dropdown border rounded-pill"><button
                                    class="btn btn-primary dropdown-toggle text-center border rounded-pill"
                                    aria-expanded="false" data-bs-toggle="dropdown"
                                    type="button"><strong>Product&nbsp;</strong></button>
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
                            <div class="table-responsive font-monospace text-center border-2  shadow-sm table"
                                id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table table-striped  table-hover table-bordered" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Branch</th>
                                            <th colspan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{maxHeight:'100vh', overflow:'scroll'}}>
                                        <tr>
                                            <td>1</td>
                                            <td>GD8EG5</td>
                                            <td>Beef Liver</td>
                                            <td>50.8798</td>
                                            <td>640</td>
                                            <td>Kayole</td>
                                            <td title="Edit"><i class="far fa-edit text-start text-warning "
                                                    ></i></td>
                                            <td title="Delete"><i class="far fa-trash-alt text-start text-danger "
                                                    ></i></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td><strong>No.</strong></td>
                                            <td><strong>ID</strong></td>
                                            <td><strong>Name</strong></td>
                                            <td><strong>Quantity</strong></td>
                                            <td><strong>Price</strong></td>
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
                    <div class="modal fade font-monospace text-capitalize fw-bold text-center" role="dialog"
                        tabindex="-1" id="modal-1">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">Edit Product</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div
                                        class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                        <p class="fs-5 text-warning">Product 1</p>
                                        <p>290180</p>
                                    </div>
                                    <div class="d-flex">
                                        <div class="row d-flex me-xxl-0 pe-xxl-1 pt-xxl-0">
                                            <div class="col">
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Product
                                                            Name</label><input
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" style={{textAlign: "center"}} required="" /></div>
                                                </div>
                                            </div>
                                            <div class="col d-grid">
                                                <div class="row">
                                                    <div class="col d-grid"><label class="form-label">Price Per
                                                            Unit</label><input
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" required="" style={{textAlign: "center"}} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer"><button class="btn btn-light" type="button"
                                        data-bs-dismiss="modal" data-bs-target="#modal-1"
                                        data-bs-toggle="modal">Close</button><button class="btn btn-primary"
                                        type="button" data-bs-target="#modal-1" data-bs-toggle="modal">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade font-monospace text-capitalize fw-bold text-center" role="dialog"
                        tabindex="-1" id="modal-2">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header text-capitalize">
                                    <h2 class="modal-title fw-bolder">Product issues</h2><button class="btn-close"
                                        type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <div
                                        class="font-monospace text-capitalize fw-bolder d-flex justify-content-between">
                                        <p class="fs-5 text-warning">Product 1</p>
                                        <p>290180</p>
                                    </div>
                                    <div class="d-flex">
                                        <div class="row d-flex me-xxl-0 pe-xxl-1 pt-xxl-0">
                                            <div class="col">
                                                <div class="row d-flex">
                                                    <div class="col d-grid"><label class="form-label">Product
                                                            Name</label><input
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" style={{textAlign: "center"}} required="" /></div>
                                                </div>
                                            </div>
                                            <div class="col d-grid">
                                                <div class="row">
                                                    <div class="col d-grid"><label class="form-label">Quantity
                                                            Issue</label><input
                                                            class="border rounded-pill border-2 border-primary shadow-sm form-control-lg"
                                                            type="text" required="" style={{textAlign: "center"}} /></div>
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
        </div><a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a>
    </div>
    </div>
    </>
  )
}
