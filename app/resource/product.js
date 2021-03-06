const express = require('express');
const router  = express.Router();
const Product = require('../entity/Product');

// Get all products
router.get('/', (req, res) => {
  req.getRepository('Product')
    .find(null, {populate: true})
    .then(result => res.json(result || []))
    .catch(error => res.status(500).json({error}));
});

// Create a product
router.post('/', (req, res) => {
  let manager   = req.getManager();
  let populator = req.wetland.getPopulator(manager);
  let product   = populator.assign(Product, req.body);

  manager.persist(product).flush()
    .then(() => res.json(product))
    .catch(error => res.status(500).json({error}));
});

// Get depleted products
router.get('/depleted', (req, res) => {
  req.getRepository(Product)
    .findDepleted()
    .then(result => res.json(result || []))
    .catch(error => res.status(500).json({error}));
});

// Get abundant products
router.get('/abundant', (req, res) => {
  req.getRepository(Product)
    .findAbundant()
    .then(result => res.json(result || []))
    .catch(error => res.status(500).json({error}));
});

// Get abundant products count
router.get('/abundant/count', (req, res) => {
  req.getRepository(Product)
    .findAbundantCount()
    .then(result => res.json({count: result}))
    .catch(error => res.status(500).json({error}));
});

// Get depleted products count
router.get('/depleted/count', (req, res) => {
  req.getRepository(Product)
    .findDepletedCount()
    .then(result => res.json({count: result}))
    .catch(error => res.status(500).json({error}));
});

// Add stock for a product
router.patch('/:id/restock', (req, res) => updateStock(req, res, req.body.quantity));

// Consume stock for a product
router.patch('/:id/consume', (req, res) => updateStock(req, res, -req.body.quantity));

// Delete a product
router.delete('/:id', (req, res) => {
  let manager = req.getManager();

  manager.getRepository('Product')
    .findOne(req.params.id)
    .then(result => {
      if (!result) {
        return res.status(404).json(null)
      }

      return manager.remove(result).flush()
        .then(() => res.json(result));
    })
    .catch(error => res.status(500).json({error}));
});

// Get a specific product
router.get('/:id', (req, res) => {
  req.getRepository('Product')
    .findOne(req.params.id)
    .then(result => {
      if (!result) {
        return res.status(404).json(null)
      }

      return res.json(result);
    })
    .catch(error => res.status(500).json({error}));
});

// Helper method.
const updateStock = (req, res, quantity) => {
  let manager = req.getManager();

  manager.getRepository(Product)
    .findOne(req.params.id)
    .then(product => {
      if (!product) {
        return res.status(404).json(null)
      }

      product.stock += quantity;

      manager.flush()
        .then(() => res.json(product))
        .catch(error => res.status(500).json({error}));
    });
};

module.exports = router;
