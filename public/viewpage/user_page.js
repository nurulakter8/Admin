import * as Element from './element.js'
import * as Route from '../controller/route.js'


export function addEventListener() {
	Element.menuusers.addEventListener('click' , ()=> {
		history.pushState(null,null, Route.routePathname.USERS)
		user_page();
	})
}

export function user_page(){
	Element.root.innerHTML = `
		<h1> Welcome to User's page </h1>
	`;
}