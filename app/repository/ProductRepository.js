const Repository = require('wetland').EntityRepository;

class ProductRepository extends Repository {
  findDepleted() {
    return this.find({stock: 0}, {populate: 'categories'});
  }

  findDepletedCount() {
    return this.getQueryBuilder('p')
      .select({count: 'p.id'})
      .where({stock: 0})
      .getQuery()
      .getSingleScalarResult();
  }

  findAbundant() {
    return this.getQueryBuilder('p')
      .select('p', 'c')
      .where({'p.stock': {'>': 4}})
      .leftJoin('p.categories', 'c')
      .getQuery()
      .getResult();
  }

  findAbundantCount() {
    return this.getQueryBuilder('p')
      .select({count: 'p.id'})
      .where({'p.stock': {'>': 4}})
      .getQuery()
      .getSingleScalarResult();
  }
}

module.exports = ProductRepository;
