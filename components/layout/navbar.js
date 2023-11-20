'use client'

import { signOut } from "next-auth/react"
import React from "react"

export let navRefDiv

export default function NavBar() {

        const navRef=React.useRef()
        navRefDiv=React.useRef()
        const ulRef=React.useRef()
        const brandText=React.useRef()

        const colapseNav=(e)=>{

                for (let i = 0; i < ulRef.current.children.length; i++) {
                        ulRef.current.children[i].children[0].children[1].style.display='none';
                        brandText.current.style.display='none'
                        navRef.current.style.maxWidth='7%'
                        
                }
                
        }

        


  return (
    <>
    <div ref={navRefDiv} className="navDiv">
    <nav ref={navRef} id="side-navbar" class="navbar align-items-start sidebar sidebar-dark bg-gradient-primary p-0 navbar-dark"
            >
        {/* <div className="sideNavbar"> */}
            <div class="container-fluid d-flex flex-column p-0">
                <a ref={brandText}
                    class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0">
                    <div class="sidebar-brand-icon rotate-n-0"><i class="fas fa-shop"></i></div>
                    <div class="sidebar-brand-text mx-3"><span>Empire Butchery</span></div>
                </a>
                <hr class="sidebar-divider my-0" />
                <ul class="navbar-nav text-light" id="accordionSidebar" ref={ulRef}>
                    <li class="nav-item" title="Dashboard">
                        <a class="nav-link " href="/sc/dashboard"><i
                                class="fas fa-tachometer-alt"></i><span className="p-1">Dashboard</span></a>
                    </li>
                    <li class="nav-item" title="Profile"><a class="nav-link" href="/sc/profile"><i
                                class="fas fa-user"></i><span  className="p-1">Profile</span></a>
                    </li>
                    <li class="nav-item" title="View Products"><a class="nav-link" href="/sc/products/viewproducts"><i
                                class="fas fa-table"></i><span className="p-1">View Products</span></a>
                    </li>
                    <li class="nav-item" title="Make Sale"><a
                            class="nav-link" href="/sc/products/sales/makesales"><i class="far fa-money-bill-alt"></i><span className="p-1">Make
                                Sale</span></a>
                    </li>
                    <li class="nav-item" title="View Sales"><a class="nav-link" href="/sc/products/sales/viewsales"><i
                                class="far fa-money-bill-alt"></i><span className="p-1">View Sales</span></a>
                    </li>
                    <li class="nav-item" title="New Employee"><a class="nav-link"
                            href="/sc/employees"><i class="fas fa-table"></i><span className="p-1">New Employees</span></a>
                    </li>
                    <li class="nav-item" title="View Employees"><a class="nav-link"
                            href="/sc/employees/view"><i class="fas fa-table"></i><span className="p-1">View Employees</span></a>
                    </li>
                    <li class="nav-item" title="View Cashier"><a class="nav-link"
                            href="/sc/employees/cashiers"><i class="fas fa-table"></i><span className="p-1">View Cashiers</span></a>
                    </li>
                    <li class="nav-item" title="Expenses"><a class="nav-link"
                            href="/sc/employees"><i class="fas fa-table"></i><span className="p-1">Expenses</span></a>
                    </li>
                    
                    <li class="nav-item " title="Log Out"><a class="nav-link text-dark fw-bold" onClick={signOut}
                            href="/"><i class="fas fa-sign-out"></i><span className="p-1">Log Out</span></a>
                    </li>
                   
                </ul>
                {/* <div class="text-center d-md-block"><button class="btn rounded-circle border-0"
                        id="sidebarToggle" type="button" onClick={colapseNav}></button></div> */}
            </div>
            {/* </div> */}
        </nav>
        </div>
    </>
  )
}
