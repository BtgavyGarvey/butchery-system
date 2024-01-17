import { isAuthenticated } from '@lib/auth'

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ['/api/:function*','/sc/:path*'],
}

export function middleware(request) {
  // Call our authentication function to check the request
  if (isAuthenticated(request)) {
    // Respond with a 401 status code
    return new Response('Unauthorized', { status: 401 })
  }
  // Continue processing the request

  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const cookie = request.cookies.get('access');
  const token = cookie?.value;
  console.log(cookie);

  const cashierRoutes = [
    "/sc/dashboard",
    "/sc/expenses",
    "/sc/expenses/reports",
    "/sc/invoice",
    "/sc/invoice/details",
    "/sc/products/sales/makesales",
    "/sc/products/sales/reports",
    "/sc/products/sales/viewsales",
    "/sc/profile",
    "/sc/profile/resetpassword",
  ];

  const employerRoutes = [
    ...cashierRoutes,
    "/sc/products/viewproducts",
    "/sc/products/newproduct",
    "/sc/products/sales/rollback",
    "/sc/employees/cashiers/logins",
    "/sc/employees/cashiers",
    "/sc/employees/view/payments",
    "/sc/employees/view",
    "/sc/employees",
  ];

  const adminRoutes = [
    ...employerRoutes,
  ];

  if (token) {
    url.pathname = "/not-found";

    const user = decodedToken(token).IUserInfo;
    console.log(user);
    // if token is expired then redirect to login page
    if (user.exp < Date.now() / 1000) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    
    // // if user role is not admin and user is trying to access admin routes then redirect to login page
    // if (
    //   (user.role !== userRole.ADMIN || user.role !== userRole.SUPER_ADMIN) &&
    //   (employerRoutes.includes(pathname) || adminRoutes.includes(pathname))
    // ) {
    //   return NextResponse.redirect(url);
    // }

    // // if admin is trying to access user routes then redirect to login page
    // if (user.role === userRole.ADMIN && userRoutes.includes(pathname)) {
    //   return NextResponse.redirect(url);
    // }
    // // if admin is trying to access super-admin routes then redirect to login page
    // if (user.role === userRole.ADMIN && superAdminRoutes.includes(pathname)) {
    //   return NextResponse.redirect(url);
    // }
    // // if super-admin is trying to access user routes then redirect to login page
    // if (user.role === userRole.SUPER_ADMIN && userRoutes.includes(pathname)) {
    //   return NextResponse.redirect(url);
    // }
  }

  return request.next()

}
