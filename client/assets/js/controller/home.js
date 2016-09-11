app.controller('StartController', function($scope, $http) {

    $scope.data ={admin:{}, driver:{}};

    var me = $scope;
    me.showAll = true;
    me.putDown = false;

    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

    if(getQueryVariable('x') == 1) {
        me.showAll = false;
    }


    if(getQueryVariable('v') == 1) {
        me.putDown = true;
    }


    me.i = 0;
    me.isDriving = true;
    me.data.driver.scoreicon = '/assets/images/full.png';

    $http.get('/api/data/route').then(
        function(res){
            me.routezoom = res.data;
        },
        function(res){
            console.error('Error loading route zoomed');
        }
    );


    me.startSimulation = function(){
        if(me.simulationStarted)
            return;
        console.log('simulation started');
        me.simulationStarted = true;

        me.simulationInterval = setInterval(function() {
            me.data = me.routezoom[me.i++];

            me.data.driver.scoreicon = me.getIconURL(me.data.driver.score) ;
            me.$apply();
            if(me.i>= me.routezoom.length-100) {
                console.log('simulation terminated');
               // me.stopSimulation();
                me.isDriving = false;
            }

        }, 50);
    }



    me.getIconURL = function(value){
        var base = '/assets/images/';
        if(value<60){
            return base + 'pussy.png';
        }else if(value<80){
            return base + 'half.png';
        }else {
            return base + 'full.png';
        }
    }

    me.stopSimulation = function(){
        console.log('simulation stopped');
        clearInterval(me.simulationInterval);
        me.simulationStarted = false;
        //me.isDriving = false;
    }


});