const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('catalog',['products']);

const app  = express();

const port = 8001;


//midleware for body parser
app.use(bodyParser.json());

//routes: Home
app.get('/', (req, res, next) => {
	res.send('please use /api/products');
});

//fetch all product
app.get('/api/products', (req, res, next) => {
	db.products.find((err,docs)=>{
		if(err) {
			res.send(err)
		}
		console.log('Products Found');
		res.json(docs);
	});
});

//fetch single product
app.get('/api/products/:id', (req, res, next) => {
	db.products.findOne({_id:mongojs.ObjectId(req.params.id)},(err,doc)=>{
			if(err) {
				res.send(err)
			}
			console.log('Product Found');
			res.json(doc);
		});
});
//routes completed above


//Now submmiting data to the api.  Adding product
app.post('/api/products',(req,res,send)=>{
	db.products.insert(req.body, (err, doc)=>{
		if(err){
			res.send(err);
		}
		console.log('adding product...');
		res.json(doc)
	})
});

// Update product
app.put('/api/products/:id', (req, res, next) => {
  db.products.findAndModify({query: {_id: mongojs.ObjectId(req.params.id)},
    update:{
      $set:{
        name: req.body.name,
        category: req.body.category,
        details: req.body.details
      }},
      new: true }, (err, doc) => {
        if(err){
          res.send(err);
        }
        console.log('Updating Product...');
        res.json(doc);
      })
});

// Delete Product
app.delete('/api/products/:id', (req, res, next) => {
  db.products.remove({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Removing Product...');
    res.json(doc);
  });
});




app.listen(port,()=>{
	console.log(`server started on 🚢 ${port}`);
});