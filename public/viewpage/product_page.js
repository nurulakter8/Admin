import { Products } from '../model/products.js';
import * as Element from './element.js'

let imageFile2Upload;

export function addEventListener() {

	Element.menuproducts.addEventListener('click',async () => {
		await product_page();
	})

	Element.formAddProducts.form.addEventListener('submit',async e => {
		e.preventDefault();
		addNewProduct(e.target);
	})

	Element .formAddProducts.imageButton.addEventListener('change', e=>{
		imageFile2Upload = e.target.files[0];
		if(!imageFile2Upload) {
			Element.formAddProducts.image.src = null;
			return;
		}
		const reader = new FileReader();
		reader.onload = () => Element.formAddProducts.image.src = reader.result;
		reader.readAsDataURL(imageFile2Upload);

	})
}


export async function product_page() {
	let html = `
		<div>
			<button id = "button-add-product" class="btn btn-outline-danger">+Add Product</button> 
		</div>
	`;

	Element.root.innerHTML = html;

	document.getElementById('button-add-product').addEventListener('click' , ()=> {
		Element.modalAddProducts.show();
	});

}

function addNewProduct(form){
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

	if(Object.keys(errors).length != 0) return; //error exists 

	//save the product in firebase

	// 1 . upload to img cloud storage => imge , url 
	// 2. store produtt into firesyore img info 

}