import * as Element from './element.js'


export function addEventListener() {

	Element.menuproducts.addEventListener('click',async () => {
		await product_page();
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