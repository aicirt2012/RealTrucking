var express = require('express');
var router = express.Router();
var async = require('async');
var fs = require('fs');
var csv = require('fast-csv');


router.get('/route', function(req, res) {
    res.send(JSON.parse(fs.readFileSync('server/routes/data/data.simulated.json', 'utf8')));
});

router.get('/route2', function(req, res) {
    //csvwrite('zoom2.csv',[long300.', lat300.', alt300.', speed300, cc300, ones(301,1)*weightmean, dist300.', speed300OS, dist300Cum.'])
    var stack = [];
    var stream = fs.createReadStream(__dirname+"/zoom2.csv");
    csv.fromStream(stream, {delimiter: ',', escape:'"'})
        .on("data", function(data){
            var s = {
                admin: {
                    log: data[0],
                    lat: data[1],
                    alt: data[2],
                    speed: data[3],
                    cc: data[4],
                    weight: data[5],
                    tdistance: data[6],
                    break: data[7]
                },
                driver:{
                    consumption: 0,
                    overspeed: data[8],
                    break: data[9],
                    score: 100,
                }
            };
            console.log(s);
            stack.push(s);
        })
        .on("end", function(){
            console.log("read done");
            res.send(stack);
        });

});



module.exports = router;
