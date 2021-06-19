import * as Route from './controller/route.js'
import * as Auth from './controller/auth.js'
import * as ProducPage from './viewpage/product_page.js'



window.onload =() => {
	const pathname = window.location.pathname;
	const hash = window.location.hash;

	Route.routing(pathname, hash);
}

Auth.addEventListners();
ProducPage.addEventListener();