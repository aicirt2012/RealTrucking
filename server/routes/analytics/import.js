var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var csv = require('fast-csv');

router.get('/zoom', function(req, res) {
    // long', lat', altu, speed', rpm, accu, resKons, resAcc, resBrems
    var stack = [];
    var stream = fs.createReadStream(__dirname+"/zoom.csv");
    csv.fromStream(stream, {delimiter: ',', escape:'"'})
        .on("data", function(data){
            stack.push({
                admin: {
                    log: data[0],
                    lat: data[1],
                    alt: data[2],
                    speed: data[3],
                    rpm: data[4],
                    accu: data[5]
                },
                driver:{
                    consist: data[6],
                    acc: data[7],
                    brea: data[8]
                }
            });
        })
        .on("end", function(){
            console.log("read done");
            res.send(stack);
        });
});


router.get('/filter', function(req, res) {
    
    var stack = [];
    var stream = fs.createReadStream(__dirname+"/CAN_with_gps.csv");
    csv.fromStream(stream, {delimiter: ';', escape:'"'})
        .on("data", function(data){
            var d = data[1];
            if(d == 'driverDemandEnginePercentTorque_BASIS' ||
                d == 'actualEnginePercentTorque_BASIS' ||
                d == 'engineSpeed_BASIS' ||
                d == 'tachographVehicleSpeed_BASIS' ||
                d == 'roadCurvature_BASIS' ||
                d == 'GPS_altitude' ||
                d == 'GPS_Longitude' ||
                d == 'GPS_Latitude')
                stack.push(data);
        })
        .on("end", function(){

            console.log("read done");

            var csvStream = csv.format({headers: true}),
                writableStream = fs.createWriteStream(__dirname+"/CAN_with_gps_filtered.csv");

            writableStream.on("finish", function(){
                console.log("DONE!");
            });

            csvStream.pipe(writableStream);
            for(i=0; i<stack.length; i++)
                csvStream.write(stack[i]);
            csvStream.end();

            res.send();
        });
});

router.get('/filter2', function(req, res) {

    var stack = [];
    var stream = fs.createReadStream(__dirname+"/CAN_with_gps.csv");
    csv.fromStream(stream, {delimiter: ';', escape:'"'})
        .on("data", function(data){
            var d = data[1];
            if(d == 'driverDemandEnginePercentTorque_BASIS' ||
                d == 'actualEnginePercentTorque_BASIS' ||
                d == 'engineSpeed_BASIS' ||
                d == 'tachographVehicleSpeed_BASIS' ||
                d == 'roadCurvature_BASIS' ||
                d == 'GPS_altitude' ||
                d == 'GPS_Longitude' ||
                d == 'GPS_Latitude' ||
                d == 'overspeed_BASIS' ||
                d == 'CCactive_BASIS' ||
                d == 'brakePressHRfrontAxleLeftW_VAR1' ||
                d == 'highResolutionTripDistance_BASIS' ||
                d == 'HRengineTotalFuelUsed_BASE' ||
                d == 'grossCombinationVehicleWeight_VAR1_BRAKE'
            )
                stack.push(data);
        })
        .on("end", function(){

            console.log("read done");

            var csvStream = csv.format({headers: true}),
                writableStream = fs.createWriteStream(__dirname+"/CAN_with_gps_filtered2.csv");

            writableStream.on("finish", function(){
                console.log("DONE!");
            });

            csvStream.pipe(writableStream);
            for(i=0; i<stack.length; i++)
                csvStream.write(stack[i]);
            csvStream.end();

            res.send();
        });
});

module.exports = router;
