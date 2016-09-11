var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var stack = [];
    var c = {
        admin: {
            log: -1,
            lat: -1,
            alt: 320,
            speed: 85,
            cc: true,
            weight: 38000,
            tdistance: 30000,
            break: 0
        },
        driver:{
            consumption: -1,
            overspeed: -1,
            break: -1,
            score: 15,
        }
    };

    for(var i=0; i<1000; i++){
        var sub_alti_factor = Math.random()*.8*Math.random() *( Math.random() *15 - 6);
        var consumption = 28 + Math.random() + (c.admin.speed - 85);

        if(c.admin.speed == 85) {
            consumption = 28 + Math.random();
        }

        // consumption = 25;

        var score = c.driver.score;

        if(Math.random() > 0.93) {
            if(Math.random() > 0.5) {
                score = score + Math.random() *2;
            } else {
                score++;
            }
        }

        if(score > 100) {
            score = 100;
        }

         var n = {
            admin: {
                log: c.admin.log,
                lat: c.admin.lat,
                alt: c.admin.alt + sub_alti_factor ,
                speed: 85 + (Math.random()>.8 ? (Math.random()*3)-1 : 0),
                cc: 1,
                weight: 38000,
                tdistance: c.admin.tdistance + Math.random()*80,
                break: 0
            },
            driver:{
                consumption: consumption,
                overspeed: (c.admin.speed > 85 && sub_alti_factor > 0) ? 1 : 0,
                break: 0,
                score: score,
            }
        };
        stack.push(n);
        c = JSON.parse(JSON.stringify(n));
    }



    for(var i=0; i<700; i++){
        var sub_alti_factor = Math.random()*.8*Math.random() *( Math.random() *15 - 6);


        var speed = c.admin.speed;
        var brk = c.driver.break;
        var service_breake = c.admin.break;
        if(c.driver.break == 0) {
            brk = 0.0023;
        }

        if(i < 150) {
            if(speed > 43) {
                speed = speed - Math.random();
                service_breake = 1;
            }

            if(c.admin.speed < speed) {
                service_breake = 0;
            }

        } else {
            if(speed < 91) {
                speed = speed + Math.random();
            } else {
                speed = 90 + (Math.random()>.8 ? (Math.random()*8)-4 : 0)
            }

            service_breake = 0;
        }

        var consumption = 0;

        if(speed > 85) {
            consumption = 32 + speed * 0.07;
        } else {
            consumption = 32 - (10/(Math.abs(speed - 40)));
        }

        switch(true) {
            case (speed == 85):
                consumption = 28.5 + Math.random();
                break;
            case (speed < 85 && speed > 65):
                consumption = 25.4 + Math.random();
                break;
            case (speed <= 65 && speed > 55):
                consumption = 23.5 + Math.random();
                break;
            case (speed <= 55):
                consumption = 20.3 + Math.random();
                break;

            default:
                consumption = 30 + Math.random();
                break;
        }


        if(c.admin.speed == 85) {
            consumption = 28 + Math.random();
        }

        // consumption = 25;
        var score = c.driver.score;

        if(Math.random() > 0.93) {
            if(Math.random() > 0.5) {
                score = score - Math.random() *2;
            } else {
                score--;
            }
        }

        if(score > 100) {
            score = 100;
        }

        if (score < 0) {
            score = 0;
        }

        var n = {
            admin: {
                log: c.admin.log,
                lat: c.admin.lat,
                alt: c.admin.alt + sub_alti_factor ,
                speed: speed,
                cc: 0,
                weight: 38000,
                tdistance: c.admin.tdistance + Math.random()*87,
                break: service_breake
            },
            driver:{
                consumption: consumption,
                overspeed: (c.admin.speed > 85) ? 1 : 0,
                break: brk,
                score: score,
            }
        };
        stack.push(n);
        c = JSON.parse(JSON.stringify(n));
    }
    res.send(stack);
});

module.exports = router;
