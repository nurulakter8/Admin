import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'


export function addEventListener() {
	Element.menuusers.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.USERS)
		const lable = Util.disableButton(Element.menuusers);
		await user_page();
		Util.enableButton(Element.menuusers,lable)
	})
}

export async function user_page() {
	let html = `
		<h1> Welcome to User's page </h1>
	`;

	let userList;
	try {
		userList = await FirebaseController.getUserList();
		html += `
		<table class="table" table-striped>
		<thead>
		  <tr>
			<th scope="col">Email</th>
			<th scope="col">Status</th>
			<th scope="col">Action</th>
		  </tr>
		</thead>
		<tbody>
		`;
		userList.forEach(user => {
			html += buildUserRow(user);
		});
		html += '</tbody></table>'

	} catch (e) {
		if (Constant.DEV) console.log(e);
		Util.info('user error getList', JSON.stringify(e));

	}

	Element.root.innerHTML = html;

	const toggleForms = document.getElementsByClassName('form-toggle-user');
	for (let i = 0; i < toggleForms.length; i++) {
		toggleForms[i].addEventListener('submit', async e=>{
			e.preventDefault();
			const button = e.target.getElementsByTagName('button')[0];
			const lable = Util.disableButton(button);

			const uid = e.target.uid.value;
			const disabled = e.target.disabled.value;
			const update ={
				disabled: disabled == 'true' ? false : true,

			}
			try {
				await FirebaseController.updateUser(uid, update);
				e.target.disabled.value = `${update.disabled}`;
				document.getElementById(`user-status-${uid}`).innerHTML = `${update.disabled ? 'disabled' : 'Active'}`
				Util.info('Status toggled', `disabled: ${update.disabled}`);
			} catch (e) {
				if (Constant.DEV) console.log(e);
				Util.info('user error toggle', JSON.stringify(e));
			}
			Util.enableButton(button, lable);
		})		
	}
}


function buildUserRow(user) {
	return `
		<tr>
			<td> ${user.email}</td>
			<td id="user-status-${user.uid}">${user.disabled ? 'disabled' : 'Active'}</td>
			<td> 
				<form class="form-toggle-user" method="post" style="display: inline-block;">
					<input type="hidden" name="uid" value="${user.uid}">
					<input type="hidden" name="disabled" value="${user.disabled}">
					<button type="submit" class="btn btn-outline-primary">Toggle Active</button>
				</form>
				<form class="form-delete-user" method="post" style="display: inline-block;">
					<input type="hidden" name="uid" value="${user.uid}">
					<button type="submit" class="btn btn-outline-danger"> Delete</button>
				</form>
			</td>
		</tr>
	`;
}