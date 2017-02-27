const express  = require('express');
const router   = express.Router();
const Category = require('../entity/Category');

// Get all categories
router.get('/', (req, res) => {
  req.getRepository('Category')
    .find(null, {populate: true})
    .then(result => res.json(result || []))
    .catch(error => res.status(500).json({error}));
});

// Create a category
router.post('/', (req, res) => {
  let manager   = req.getManager();
  let populator = req.wetland.getPopulator(manager);
  let category  = populator.assign(Category, req.body);

  manager.persist(category).flush()
    .then(() => res.json(category))
    .catch(error => res.status(500).json({error}));
});

module.exports = router;
