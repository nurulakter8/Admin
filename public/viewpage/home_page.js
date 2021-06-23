import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'


export function addEventListener() {
	Element.menuhome.addEventListener('click' , ()=> {
		history.pushState(null,null, Route.routePathname.HOME)
		home_page();
	})
}

export function home_page(){
	if(!Auth.currentUser) return;

	Element.root.innerHTML = `
		<h1> Welcome to Admin's page </h1>
	`;
}