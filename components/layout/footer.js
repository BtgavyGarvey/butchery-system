'use client'
export default function Footer() {
  return (
    <>
    <footer class="bg-white sticky-footer">
        <div class="container my-auto">
            <div class="text-center my-auto copyright"><span>Copyright © Butchery System {new Date().getFullYear()} | Developed By:
            <a className="text-decoration-noe" href="#">MyLegio Mariae Systems</a></span></div>
        </div>
    </footer>
    </>
  )
}
