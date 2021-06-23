import * as FirebaseController from '../controller/firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import { Products } from '../model/products.js';


let imageFile2Upload;

export function addEventListeners(){

	Element.formEditProducts.imageButton.addEventListener('change', e =>{
		imageFile2Upload = e.target.files[0];
		if (!imageFile2Upload) {
			Element.formEditProducts.imageTag.src = null;
			Element.formEditProducts.errorImage.innerHTML = 'Image change canclled';
			return;	
		} 
		Element.formEditProducts.errorImage.innerHTML = '';
		const reader = new FileReader();
		reader.readAsDataURL(imageFile2Upload);
		reader.onload = ()=> Element.formEditProducts.imageTag.src = reader.result;

	})

	Element.formEditProducts.form.addEventListener('submit', async e =>{
		e.preventDefault();
		const button = e.target.getElementsByTagName('button')[0];
		const lable = Util.disableButton(button);

		const p = new Products({
			name: e.target.name.value,
			price: e.target.price.value,
			summary: e.target.summary.value,
		});
		p.docId = e.target.docId.value;

		const errors = p.validate(true); // bypass image file check
		Element.formEditProducts.errorName.innerHTML = errors.name ? errors.name : '';
		Element.formEditProducts.errorPrice.innerHTML = errors.price ? errors.price : '';
		Element.formEditProducts.errorSummary.innerHTML = errors.summary ? errors.summary : '';

		if(Object.keys(errors).length != 0) {
			Util.enableButton(button, lable);
			return;
		}

		try {
			if(imageFile2Upload){
				const imageInfo = await FirebaseController.uploadImage(imageFile2Upload,e.target.imageName.value);
				p.imageURL = imageInfo.imageURL;
			}

			//update firestore
			await FirebaseController.updateProduct(p);


			//update web browser
			const cardTag = document.getElementById('card-'+p.docId);
			if (imageFile2Upload) {
				cardTag.getElementsByTagName('img')[0].src = p.imageURL;

			}
			cardTag.getElementsByClassName('card-title')[0].innerHTML = p.name;
			cardTag.getElementsByClassName('card-text')[0].innerHTML = `$ ${p.price} <br> ${p.summary}`;

			Util.info('Updated', `${p.name} is updated sucessfully`, Element.modalEditProduct );


		} catch (e) {
			if(Constant.DEV) console.log(e)
			Util.info('Update product error', JSON.stringify(e), Element.modalEditProduct)
		}
		Util.enableButton(button,lable);
	});
}


export async function edit_product(docId) {
	let product;
	try {
		product = await FirebaseController.getProductById(docId);
		if (!product) {
			Util.info('getProductById error', 'no product found by the id');
			return;
		}
	} catch (e) {
		if (Constant.DEV) console.log(e);
		Util.info('getProductById Error', JSON.stringify(e));
		return;
	}


	//show product
	Element.formEditProducts.form.docId.value = product.docId;
	Element.formEditProducts.form.imageName.value = product.imageName;
	Element.formEditProducts.form.name.value = product.name;
	Element.formEditProducts.form.price.value = product.price;
	Element.formEditProducts.form.summary.value = product.summary;
	Element.formEditProducts.imageTag.src = product.imageURL;
	Element.formEditProducts.errorImage.innerHTML ='';
	imageFile2Upload = null;
	Element.formEditProducts.imageButton.value = null;


	Element.modalEditProduct.show();
}

export async function delete_product(docId, imageName){
	try {
		await FirebaseController.deleteProduct(docId, imageName);
		//update browser
		const cardTag = document.getElementById('card-'+docId);
		cardTag.remove();

		Util.info('Deleted!', `${docId} has been deleted`);

	} catch (e) {
		if(Constant.DEV) console.log(e);
		Util.info('Delete product error', JSON.stringify(e));
		
	}
}