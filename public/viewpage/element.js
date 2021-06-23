// single page root
export const root = document.getElementById('root');

//menu
export const menuhome = document.getElementById('menu-home')
export const menuproducts = document.getElementById('menu-products')
export const menuusers = document.getElementById('menu-users')
export const menuSignout = document.getElementById('menu-signout')

//form 
export const formSignin = document.getElementById('form-signin')
export const formAddProducts = {
	form: document.getElementById('form-add-product'),
	errorName:  document.getElementById('form-add-products-error-name'),
	errorPrice : document.getElementById('form-add-products-error-price'),
	errorSummary : document.getElementById('form-add-products-error-summary'),
	image : document.getElementById('form-add-product-image-tag'),
	imageButton: document.getElementById('form-add-product-image-button'),
	errorImage : document.getElementById('form-add-products-error-image'),
}

export const formEditProducts = {
	form: document.getElementById('form-edit-product'),
	errorName:  document.getElementById('form-edit-product-error-name'),
	errorPrice : document.getElementById('form-edit-product-error-price'),
	errorSummary : document.getElementById('form-edit-product-error-summary'),
	imageTag : document.getElementById('form-edit-product-image-tag'),
	imageButton: document.getElementById('form-edit-product-image-button'),
	errorImage : document.getElementById('form-edit-product-error-image'),

}


// modal bootstrap objects
export const modalInfobox = new bootstrap.Modal(document.getElementById('modal-info'), {backdrop: 'static'});
export const modalInfoboxTitleElement = document.getElementById('modal-info-title')
export const modalInfoboxBodyElement = document.getElementById('modal-info-body')


export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'), {backdrop: 'static'})


export const modalAddProducts = new bootstrap.Modal(document.getElementById('modal-add-product'), {backdrop: 'static'})

export const modalEditProduct = new bootstrap.Modal(document.getElementById('modal-edit-product'), {backdrop: 'static'})
