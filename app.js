const express        = require('express');
const bodyParser     = require('body-parser');
const expressWetland = require('express-wetland');
const app            = express();
const Wetland        = require('wetland').Wetland;
const wetland        = new Wetland(require('./wetland'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressWetland(wetland));

// Resources
app.use('/product', require('./app/resource/product'));
app.use('/category', require('./app/resource/category'));

// Start server
app.listen(3000, () => console.log('Inventory manager ready! Available on http://127.0.0.1:3000'));
