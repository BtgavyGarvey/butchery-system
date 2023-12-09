'use client'

import { navRefDiv } from "./navbar";
import React from 'react'

export default function Header({session}) {

    let checkBox=React.useRef()

    React.useEffect(()=>{
        navRefDiv.current.style.display='none'
    },[navRefDiv.current])

    const check_Box=()=>{
        if (checkBox.current.checked) {
            navRefDiv.current.style.display='none'
            checkBox.current.checked=false
        }
        else{
            navRefDiv.current.style.display='block'
            checkBox.current.checked
            checkBox.current.checked=true
        }
    }


    
  return (
    <>
        <nav class="navbar navbar-expand bg-white shadow mb-4 top-bar static-top navbar-light">
            <div class="container-fluid d-flex justify-content-between">
                <div className="d-flex ">
                <button onClick={check_Box}
                    class="btn btn-link d-md-block bounce animated rounded-circle me-3" id="sidebarToggleTop"
                    type="button"><i  class="fas fa-bars"><input ref={checkBox} type="checkbox" style={{visibility:'hidden'}}></input></i>
                    
                </button>
                <span class="d-block d-lg-inline  text-gray-600 small">{session.branchName} Branch</span>
                </div>
                
                <ul class="navbar-nav flex-wrap ms-auto">
                    {/* <li class="nav-item dropdown d-sm-none no-arrow"><a class="dropdown-toggle nav-link"
                            aria-expanded="false" data-bs-toggle="dropdown" href="#"><i
                                class="fas fa-search"></i></a>
                        <div class="dropdown-menu dropdown-menu-end p-3 animated--grow-in"
                            aria-labelledby="searchDropdown">
                            <form class="me-auto navbar-search w-100">
                                <div class="input-group"><input class="bg-light form-control border-0 small"
                                        type="text" placeholder="Search for ..." />
                                    <div class="input-group-append"><button class="btn btn-primary py-0"
                                            type="button"><i class="fas fa-search"></i></button></div>
                                </div>
                            </form>
                        </div>
                    </li> */}
                    {/* <li class="nav-item dropdown no-arrow mx-1">
                        <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link"
                                aria-expanded="false" data-bs-toggle="dropdown" href="#"><span
                                    class="badge bg-danger badge-counter">3+</span><i
                                    class="fas fa-bell fa-fw"></i></a>
                            <div class="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                                <h6 class="dropdown-header">alerts center</h6><a
                                    class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="me-3">
                                        <div class="bg-primary icon-circle"><i
                                                class="fas fa-file-alt text-white"></i></div>
                                    </div>
                                    <div><span class="small text-gray-500">December 12, 2019</span>
                                        <p>A new monthly report is ready to download!</p>
                                    </div>
                                </a><a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="me-3">
                                        <div class="bg-success icon-circle"><i
                                                class="fas fa-donate text-white"></i></div>
                                    </div>
                                    <div><span class="small text-gray-500">December 7, 2019</span>
                                        <p>$290.29 has been deposited into your account!</p>
                                    </div>
                                </a><a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="me-3">
                                        <div class="bg-warning icon-circle"><i
                                                class="fas fa-exclamation-triangle text-white"></i></div>
                                    </div>
                                    <div><span class="small text-gray-500">December 2, 2019</span>
                                        <p>Spending Alert: We've noticed unusually high spending for your
                                            account.</p>
                                    </div>
                                </a><a class="dropdown-item text-center small text-gray-500" href="#">Show All
                                    Alerts</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item dropdown no-arrow mx-1">
                        <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link"
                                aria-expanded="false" data-bs-toggle="dropdown" href="#"><span
                                    class="badge bg-danger badge-counter">7</span><i
                                    class="fas fa-envelope fa-fw"></i></a>
                            <div class="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                                <h6 class="dropdown-header">alerts center</h6><a
                                    class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image me-3"><img class="rounded-circle"
                                            src="/assets/img/avatars/avatar4.jpeg?h=fefb30b61c8459a66bd338b7d790c3d5" />
                                        <div class="bg-success status-indicator"></div>
                                    </div>
                                    <div class="fw-bold">
                                        <div class="text-truncate"><span>Hi there! I am wondering if you can
                                                help me with a problem I've been having.</span></div>
                                        <p class="small text-gray-500 mb-0">Emily Fowler - 58m</p>
                                    </div>
                                </a><a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image me-3"><img class="rounded-circle"
                                            src="/assets/img/avatars/avatar2.jpeg?h=5d142be9441885f0935b84cf739d4112" />
                                        <div class="status-indicator"></div>
                                    </div>
                                    <div class="fw-bold">
                                        <div class="text-truncate"><span>I have the photos that you ordered last
                                                month!</span></div>
                                        <p class="small text-gray-500 mb-0">Jae Chun - 1d</p>
                                    </div>
                                </a><a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image me-3"><img class="rounded-circle"
                                            src="/assets/img/avatars/avatar3.jpeg?h=c5166867f10a4e454b5b2ae8d63268b3" />
                                        <div class="bg-warning status-indicator" ></div>
                                    </div>
                                    <div class="fw-bold">
                                        <div class="text-truncate"><span>Last month's report looks great, I am
                                                very happy with the progress so far, keep up the good
                                                work!</span></div>
                                        <p class="small text-gray-500 mb-0">Morgan Alvarez - 2d</p>
                                    </div>
                                </a><a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image me-3"><img class="rounded-circle"
                                            src="/assets/img/avatars/avatar5.jpeg?h=35dc45edbcda6b3fc752dab2b0f082ea" />
                                        <div class="bg-success status-indicator" ></div>
                                    </div>
                                    <div class="fw-bold">
                                        <div class="text-truncate"><span>Am I a good boy? The reason I ask is
                                                because someone told me that people say this to all dogs, even
                                                if they aren't good...</span></div>
                                        <p class="small text-gray-500 mb-0">Chicken the Dog · 2w</p>
                                    </div>
                                </a><a class="dropdown-item text-center small text-gray-500" href="#">Show All
                                    Alerts</a>
                            </div>
                        </div>
                        <div class="shadow dropdown-list dropdown-menu dropdown-menu-end"
                            aria-labelledby="alertsDropdown"></div>
                    </li> */}
                    {/* <div class="d-none d-sm-block topbar-divider"></div> */}
                    <li class="nav-item dropdown no-arrow">
                        <div class="nav-item dropdown no-arrow ">
                        <span class="d-block d-lg-inline  text-gray-600 small">{session.name}</span>
                            
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </>
  )
}
