'use client'
export default function Footer() {
  return (
    <>
    <footer class="bg-white sticky-footer">
        <div class="container my-auto">
            <div class="text-center my-auto copyright text-dark"><span>Copyright © Butchery System {new Date().getFullYear()} | Developed By:
            <a className="text-primary" href="#">MyLegio Mariae Systems</a></span></div>
        </div>
    </footer>
    </>
  )
}
