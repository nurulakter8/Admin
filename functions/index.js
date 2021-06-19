const functions = require("firebase-functions");


const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});


const Constant = require('./constant.js')

exports.cf_addProduct = functions.https.onCall(addProduct);

function isAdmin(email){
	return Constant.adminEmails.includes(email);
}


async function addProduct(data, context) {

	if(!isAdmin(context.auth.token.email)){
		if(Constant.DEV) console.log('not admin', context.auth.token.email);
		throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoke this function');
	}
	// data serialzed product obj
	try {
		await admin.firestore().collection(Constant.colloectionNames.PRODUCT)
			.add(data);
	} catch (e) {
		if(Constant.DEV) console.log(e);
		throw new functions.https.HttpsError('internal','addProduct failed');
	}
}