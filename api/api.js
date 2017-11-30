const express = require('express');
const _ = require('lodash');
const moment = require('moment');
const redis = require("redis");

const client = redis.createClient();
const router = express.Router();

client.on("error", function (err) {
    console.log("Error " + err);
});

router.get('/budget/get/', function(req, res, next) {
  let fromDate;
  if (moment().get('date') < 25) {
    fromDate = moment().set('month', moment().month()-1).set('date', 25);  
  } else {
    fromDate = moment().set('month', moment().month()).set('date', 25);  
  }
  const days = _.times(moment().diff(fromDate, 'days'), (i) => {
    return moment().subtract(i, 'days').format('YYYY-MM-DD');
  });

  client.mget(days, function (err, result) {
    if (err) return res.sendStatus(500);
    const parsed = _.pull(_.flatten(_.map(result, JSON.parse)), null);

    res.send({result: _.map(parsed, (p) => ({x: p.date, y: p.price})), days});
  });
});

router.post('/budget/add/', function(req, res, next) {
  const map = _(req.body.budget).split('\n')
  .map((r) => r.split('\t'))
  .map((r) => (
    {
      date:     r[0], 
      purchase: r[1], 
      city:     r[2], 
      who:      r[3],
      price:    parseFloat(r[4].replace(',', '.').replace('−', '-'))
    }))
  .value();
  
  const dateGroup = _.groupBy(map, (r) => r.date);

  _.forEach(dateGroup, (arr, d) => {
    client.set(d, JSON.stringify(arr));
  });
  res.sendStatus(200);
});

module.exports = router;
