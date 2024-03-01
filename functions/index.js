
// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");


const serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fake-news-detection-syst-c6ed0-default-rtdb.firebaseio.com",
});


const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
// const {QuerySnapshot} = require("firebase-admin/firestore");
app.use( cors( {origin: true} ) );




// Routes
app.get("/hello-world", (req, res) =>{
  return res.status(200).send("hello world!");
});
// create
// post
app.post("/api/create", async (req, res) =>{
  try {
    await db.collection("product").doc("/" + req.body.id + "/")
        .create({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
        });
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
// read
// get
app.get("/api/read/:id", async (req, res) =>{
  try {
    const document = db.collection("product").doc(req.params.id);
    const product = await document.get();
    const responce = product.data();
    return res.status(200).send(responce);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
// read all data
// get
app.get("/api/read", async (req, res) =>{
  try {
    const query = db.collection("product");
    const responce = [];
    await query.get().then((QuerySnapshot) => {
      const docs = QuerySnapshot.docs; // result of the query
      for (const doc of docs) {
        const selectedItem = {
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          price: doc.data().price,
        };
        responce.push(selectedItem);
      }
      // return responce;
    });
    return res.status(200).send(responce);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
// update
// put
app.put("/api/update/:id", async (req, res) =>{
  try {
    const document = db.collection("product").doc(req.params.id);
    await document.update({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
// delete
// delete
app.delete("/api/delete/:id", async (req, res) =>{
  try {
    const document = db.collection("product").doc(req.params.id);
    await document.delete();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});


// export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);


