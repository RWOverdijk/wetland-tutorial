class Category {
  static setMapping(mapping) {
    // Primary key.
    mapping.forProperty('id').primary().increments();

    mapping.field('name', {type: 'string'});

    mapping.field('created', {type: 'datetime'});

    mapping.manyToMany('products', {targetEntity: 'Product', inversedBy: 'categories'});
  }

  beforeCreate() {
    this.created = new Date();
  }
}

module.exports = Category;
