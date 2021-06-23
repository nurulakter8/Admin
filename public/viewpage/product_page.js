import { Products } from '../model/products.js';
import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as util from './util.js'
import * as Route from '../controller/route.js'
import * as Edit from '../controller/edit_product.js'
import * as Auth from '../controller/auth.js'

let imageFile2Upload;

export function addEventListener() {

	Element.menuproducts.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.PRODUCTS);
		const button = Element.menuproducts;
		const label = util.disableButton(button);
		await product_page();
		util.sleep(1000);
		util.enableButton(button,label);
	})

	Element.formAddProducts.form.addEventListener('submit', async e => {
		e.preventDefault();
		const button = e.target.getElementsByTagName('button')[0];
		const label = util.disableButton(button);
		await addNewProduct(e.target);
		await product_page();		
		util.enableButton(button,label);
	})

	Element.formAddProducts.imageButton.addEventListener('change', e => {
		imageFile2Upload = e.target.files[0];
		if (!imageFile2Upload) {
			Element.formAddProducts.image.src = null;
			return;
		}
		const reader = new FileReader();
		reader.onload = () => Element.formAddProducts.image.src = reader.result;
		reader.readAsDataURL(imageFile2Upload);

	})
}


export async function product_page() {

	if(!Auth.currentUser) return;

	let html = `
		<div>
			<button id = "button-add-product" class="btn btn-outline-danger">+Add Product</button> 
		</div>
	`;

	let products;
	try {
		products = await FirebaseController.getProductionList();
	} catch (e) {
		if (Constant.DEV) console.log(e);
		util.info('cannot get product list', JSON.stringify(e));
		return;
	}

	//render products
	products.forEach(p => {
		html += buildProductCard(p);
	});


	Element.root.innerHTML = html;

	document.getElementById('button-add-product').addEventListener('click', () => {
		Element.formAddProducts.form.reset();
		Element.formAddProducts.image.src = '';
		imageFile2Upload = null;
		Element.modalAddProducts.show();
	});

	const editForms = document.getElementsByClassName('form-edit-product');
	for (let i = 0; i < editForms.length; i++) {
		editForms[i].addEventListener('submit', async e=>{
			e.preventDefault();
			const button = e.target.getElementsByTagName('button')[0];
			const label = util.disableButton(button)
			await Edit.edit_product(e.target.docId.value);
			util.enableButton(button, label);

		});
		
	}

	const deleteForms = document.getElementsByClassName('form-delete-product');
	for (let i = 0; i < deleteForms.length; i++) {
		deleteForms[i].addEventListener('submit', async e=>{
			e.preventDefault();
			if(!window.confirm("Press OK to delete")) return; // cancle button pressed
			const button = e.target.getElementsByTagName('button')[0];
			const label = util.disableButton(button)
			await Edit.delete_product(e.target.docId.value, e.target.imageName.value);
			util.enableButton(button, label);

		});
		
	}

}

async function addNewProduct(form) {
	const name = form.name.value;
	const price = form.price.value;
	const summary = form.summary.value;

	const product = new Products({
		name, price, summary
	});

	const errors = product.validate(imageFile2Upload);

	Element.formAddProducts.errorName.innerHTML = errors.name ? errors.name : '';
	Element.formAddProducts.errorPrice.innerHTML = errors.price ? errors.price : '';
	Element.formAddProducts.errorSummary.innerHTML = errors.summary ? errors.summary : '';
	Element.formAddProducts.errorImage.innerHTML = errors.image ? errors.image : '';

	if (Object.keys(errors).length != 0) return; //error exists 

	//save the product in firebase

	// 1 . upload to img cloud storage => imge , url 
	// 2. store produtt into firesyore img info 
	try {
		const { imageName, imageURL } = await FirebaseController.uploadImage(imageFile2Upload);
		product.imageName = imageName;
		product.imageURL = imageURL;
		await FirebaseController.addProduct(product.serialize());
		util.info('Success', `${product.name} added!`, Element.modalAddProducts);
	} catch (error) {
		if (Constant.DEV) console.log(e);
		util.info('Add product failed', JSON.stringify(e), Element.modalAddProducts);
	}
}

function buildProductCard(product) {
	return `
	<div id = "card-${product.docId}" class="card" style="width: 18rem; display: inline-block">
		<img src="${product.imageURL}" class="card-img-top">
		<div class="card-body">
			<h5 class="card-title">${product.name}</h5>
	  		<p class="card-text">$ ${product.price} <br> ${product.summary}</p>
		</div>
		<form class = "form-edit-product float-start" method ="post">
			<input type = "hidden" name="docId" value="${product.docId}">
			<button class= "btn btn-outline-primary" type="submit">Edit</button>  
		</form>
		<form class = "form-delete-product float-end" method ="post">
			<input type = "hidden" name="docId" value="${product.docId}">
			<input type = "hidden" name="imageName" value="${product.imageName}">
			<button class= "btn btn-outline-danger" type="submit">Delete</button>  
		</form>
  	</div>
	`;

}