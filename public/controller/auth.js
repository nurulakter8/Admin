import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js'

export let currentUser;

export function addEventListners() {
	Element.formSignin.addEventListener('submit', async e => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		if(!Constant.adminEmails.includes(email)){
			Util.info('Error', 'only for admin')
			return;
		}

		try {
			await FirebaseController.signIn(email, password)
			Element.modalSignin.hide();
		} catch (e) {
			if (Constant.DEV) console.log(e);
			Util.info('Sign In Error', JASON.stringify(e), Element.modalSignin)
		}
	})

	Element.menuSignout.addEventListener('click' , async () =>{
		try {
			await FirebaseController.signOut();
		} catch (e) {
			if (Constant.DEV) console.log(e);
			Util.info('Sign out Error: try again', JASON.stringify(e))

		}
	})

	firebase.auth().onAuthStateChanged(user => {
		if (user && Constant.adminEmails.includes(user.email)) {
			currentUser = user;
			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let index = 0; index < elements.length; index++) {
				elements[index].style.display = 'none'
			}
			elements = document.getElementsByClassName('modal-post-auth');
			for (let index = 0; index < elements.length; index++) {
				elements[index].style.display = 'block'
			}
		} else {
			//signout
			currentUser = null;
			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let index = 0; index < elements.length; index++) {
				elements[index].style.display = 'block'
			}
			elements = document.getElementsByClassName('modal-post-auth');
			for (let index = 0; index < elements.length; index++) {
				elements[index].style.display = 'none'
		}
	}
	})
}