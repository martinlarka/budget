const express = require('express');
const _ = require('lodash');
const moment = require('moment');
const redis = require("redis");

const client = redis.createClient();
const router = express.Router();

client.on("error", function (err) {
    console.log("Error " + err);
});

router.get('/budget', function(req, res, next) {
  client.get('budget', function (err, budget) {
    if (err) return res.sendStatus(500);
    res.send({budget});
  });  
});

router.get('/budget/get/', function(req, res, next) {
  let fromDate, toDate;
  if (req.query.month) {
    const month = parseInt(req.query.month);
    fromDate = moment().set({'month': month, 'date': 1});
    toDate = moment().set({'month': month + 1, 'date': 1});
  } else {
    toDate = moment().add('days', 1);
    if (moment().get('date') < 25) {
      fromDate = moment().set('month', moment().month()-1).set('date', 25);  
    } else {
      fromDate = moment().set('month', moment().month()).set('date', 25);  
    }
  }
  const days = _.times(toDate.diff(fromDate, 'days'), (i) => {
    return toDate.subtract(1, 'days').format('YYYY-MM-DD');
  }).sort();

  client.mget(days, function (err, data) {
    if (err) return res.sendStatus(500);
    const result = _.pull(_.flatten(_.map(data, JSON.parse)), null);

    res.send({result, days});
  });
});


router.post('/budget/add/', function(req, res, next) {
  let map = []
  if (req.body.entries) {
    map = _(req.body.entries).split('\n')
    .map((r) => r.split('\t'))
    .map((r) => {
      return {
        date:     parseDate(r[0]), 
        purchase: r[1], 
        city:     r[2], 
        who:      r[3],
        price:    parseFloat(r[4].replace(',', '.').replace('−', '-').replace(' ', ''))
      }})
    .value();
    
    const dateGroup = _.groupBy(map, (r) => r.date);

    _.forEach(dateGroup, (arr, d) => {
      client.set(d, JSON.stringify(arr));
    });
  }

  client.set('budget', req.body.budget)
  res.send({added: map.length});
});

parseDate = (date) => {
  if (date === 'Igår') {
    return moment().subtract(1, 'days').format('YYYY-MM-DD');
  } else if (date === 'Idag') {
    return moment().format('YYYY-MM-DD');
  } else {
    return date;
  }
}

module.exports = router;
