import * as Home from '../viewpage/home_page.js'
import * as Products from '../viewpage/product_page.js'
import * as Users from '../viewpage/user_page.js'


export const routePathname = {
	HOME: '/',
	PRODUCTS: '/products',
	USERS: '/users',
}

export const routes = [
	{pathname: routePathname.HOME, page: Home.home_page},
	{pathname: routePathname.PRODUCTS, page: Products.product_page},
	{pathname: routePathname.USERS, page: Users.user_page},
];

export function routing(pathname, hash){
	const route = routes.find(r => r.pathname == pathname);
	if (route) route.page();
	else routes[0].page();

}