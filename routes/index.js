const express = require('express');
const router = express.Router();
const { WebhookClient } = require('dialogflow-fulfillment');

const nearbyHandler = require('../handlers/nearbyHandler');
const nearestHanldler = require('../handlers/nearestHandler');
const categoriesHandler = require('../handlers/categoriesHandler');

const intentMap = new Map();
intentMap.set('info.nearby', nearbyHandler);
intentMap.set('Nearest Intent', nearestHanldler);
intentMap.set('info.categories', categoriesHandler);

/**
 * Routes HTTP POST requests to index
 */
router.post('/', function(request, response) {
  if (!request.hasOwnProperty('body') || Object.keys(request.body).length === 0) {
    response.status(400).send('Empty body');
  }

  if (!request.body.hasOwnProperty('queryResult') || Object.keys(request.body.queryResult).length === 0
    || !request.body.queryResult.hasOwnProperty('queryText')
    || Object.keys(request.body.queryResult.queryText).length === 0) {
    response.status(400).send('Invalid data format');
  }

  let agent = new WebhookClient({ request, response });

  agent.handleRequest(intentMap);
});

/**
 * Blocks all other HTTP methods
 */
router.all('/', function(req, res) {
  res.sendStatus(405);
});


module.exports = router;
