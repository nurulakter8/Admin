import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../modal/constant.js'
import * as Util from '../viewpage/util.js'

export function addEventListners(){
	Element.formSignin.addEventListener('submit', async e => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		try {
			await FirebaseController.signIn(email, password)
			Element.modalSignin.hide();
		} catch (e) {
			if (Constant.DEV) console.log(e);
			Util.info('Sign In Error', JASON.stringify(e), Element.modalSignin)

		}
	})
}