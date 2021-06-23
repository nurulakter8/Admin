const functions = require("firebase-functions");


const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});


const Constant = require('./constant.js')

exports.cf_addProduct = functions.https.onCall(addProduct);
exports.cf_getProductsList = functions.https.onCall(getProductList);
exports.cf_getProductById = functions.https.onCall(getProductById);
exports.cf_updateProduct = functions.https.onCall(updateProduct);
exports.cf_deleteProduct = functions.https.onCall(deleteProduct);
exports.cf_getUserList = functions.https.onCall(getUserList);
exports.cf_updateUser = functions.https.onCall(updateUser);
exports.cf_deleteUser = functions.https.onCall(deleteUser);


function isAdmin(email) {
	return Constant.adminEmails.includes(email);
}

async function deleteUser(data, context){
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}
	try {
		await admin.auth().deleteUser(data);
	} catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError('internal', 'delete user error');
	}
}

async function updateUser(data, context) {
	//data => {uid, upadare}
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}
	try {
		const uid = data.uid;
		const update = data.update;
		await admin.auth().updateUser(uid,update);

	} catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError('internal', 'updateuser faild');

	}
}

async function getUserList(data, context) {
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}
	const userList = [];
	const MAXRESULTS = 4;
	try {
		let result = await admin.auth().listUsers(MAXRESULTS);
		userList.push(...result.users); //spread operator
		let nextPageToken = result.pageToken;
		while (nextPageToken) {
			result = await admin.auth().listUsers(MAXRESULTS, nextPageToken);
			userList.push(...result.users);
			nextPageToken = result.pageToken;
		}
		return userList;
	} catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError('internal', 'getuserlist faild');
	}
}


async function deleteProduct(docId, context) {
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}

	try {
		await admin.firestore().collection(Constant.colloectionNames.PRODUCT)
			.doc(docId).delete();

	} catch (e) {
		if (Constant.DEV) console.log(e)
		throw new functions.https.HttpsError('intarnal', 'delete product failed');

	}
}

async function updateProduct(productInfo, context) {
	//productInfo = {docId, data}
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}

	try {
		await admin.firestore().collection(Constant.colloectionNames.PRODUCT)
			.doc(productInfo.docId).update(productInfo.data);
	} catch (e) {
		if (Constant.DEV) console.log(e)
		throw new functions.https.HttpsError('intarnal', 'update product failed');

	}
}

//@data ==> document (product id)
async function getProductById(data, context) {
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}

	try {
		const doc = await admin.firestore().collection(Constant.colloectionNames.PRODUCT)
			.doc(data).get();
		if (doc.exists) {
			const { name, summary, price, imageName, imageURL } = doc.data();
			const p = { name, summary, price, imageName, imageURL }
			p.docId = doc.id;
			return p;
		} else {
			return null;  //no doc exists
		}
	} catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError('internal', 'getproductById failed');
	}
}


async function getProductList(data, context) {
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}

	try {

		let products = [];
		const snapShot = await admin.firestore().collection(Constant.colloectionNames.PRODUCT)
			.orderBy('name')
			.get();
		snapShot.forEach(doc => {
			const { name, price, summary, imageName, imageURL } = doc.data();
			const p = { name, price, summary, imageName, imageURL };
			p.docId = doc.id;
			products.push(p)
		});
		return products;
	} catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError('internal', 'getproductsList failed');
	}
}

async function addProduct(data, context) {

	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}
	// data serialzed product obj
	try {
		await admin.firestore().collection(Constant.colloectionNames.PRODUCT)
			.add(data);
	} catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError('internal', 'addProduct failed');
	}
}