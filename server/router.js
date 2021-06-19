const express = require('express');
// const router = express.Router();
const router = require('express').Router();
const controllers = require('./controllers.js');

router
  .route('/products')
    .get(controllers.getProducts)

router
  .route('/reviews')
    .get(controllers.getReviews)

router.route('/reviews/meta')
  .get(controllers.getReviewsMeta)


module.exports = router;