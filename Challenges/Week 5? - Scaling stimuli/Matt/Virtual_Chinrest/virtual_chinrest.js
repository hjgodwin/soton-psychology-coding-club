/**
 * Created by Qisheng Li in 11/2019.
 */

//Store all the configuration data in variable 'data'
var data = {"dataType":"configurationData"};
data["ballPosition"] = [];
data["fullScreenClicked"] = false;
data["sliderClicked"] = false;
data["attempts"] = 0;
var responseWindow = true;
var pausing = false;
var startpressed = false;

(function ( distanceSetup, $ ) {

    distanceSetup.round = function(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    };

    distanceSetup.px2mm = function(cardImageWidth) {
        const cardWidth = 85.6; //card dimension: 85.60 × 53.98 mm (3.370 × 2.125 in)
        var px2mm = cardImageWidth/cardWidth;
        data["px2mm"] = distanceSetup.round(px2mm, 2);
        return px2mm; 
    };

}( window.distanceSetup = window.distanceSetup || {}, jQuery));


function getCardWidth() {
    var cardWidthPx = $('#card').width();
    data["cardWidthPx"] = distanceSetup.round(cardWidthPx,2);
    return cardWidthPx
}


function configureBlindSpot() {

    data['cardWidthPx'] = getCardWidth();
    distanceSetup.px2mm(data['cardWidthPx']);

    $('#page-size').remove();
    $('#blind-spot').css('display','block');
    $('#clickcontainer').css('visibility','visible');

    var windowwidth = $(window).width()/2;
    drawBall(windowwidth);
    
    $(document).on('mousedown', function(){
        if (startpressed){
            recordPosition();
        }
    });

};

function StartVirtualChinrest(){
    $( function() {
        $( "#slider" ).slider({value:"50"});
    } );

    $(document).ready(function() {
        $( "#slider" ).on("slide", function (event, ui) {
            var cardWidth = ui.value + "%";
            $("#card").css({"width":cardWidth});
        });

        $('#slider').on('slidechange', function(event, ui){
            data["sliderClicked"] = true;
        });

    });
}

//=============================
//Ball Animation

function drawBall(pos=180){
    // pos: define where the fixation square should be.
    var mySVG = SVG("svgDiv");
    const rectX = pos; //distanceSetup.px2mm(cardWidthPx)*pos;
    
    
    const ballX = rectX*0.9 // define where the ball is
    var ball = mySVG.circle(30).move(ballX-15, 0).fill("#f00"); 
    window.ball = ball;
    var square = mySVG.rect(30, 30).move(rectX - 15, 0).fill('#FFD700'); //square position
    data["squarePosition"] = distanceSetup.round(square.cx(),2);
    data['rectX'] = rectX;
    data['ballX'] = ballX;
};


function animateBall(){
    pausing = false;
    ball.animate(14000).during(
        function(pos){
            moveX = - pos*data['ballX'];
            window.moveX = moveX;
            moveY = 0;
            ball.attr({transform:"translate("+moveX+","+moveY+")"});

        }
    ).loop(true, false).
    after(function(){
        animateBall();
    });

    //disbale the button after clicked once.
    $("#start").attr("disabled", true);
    startpressed = true;
};

function recordPosition(event, angle=13.5) {
    // angle: define horizontal blind spot entry point position in degrees.
    if (responseWindow & !pausing) { 

        data["ballPosition"].push(distanceSetup.round((ball.cx() + moveX),2));
        var sum = data["ballPosition"].reduce((a, b) => a + b, 0);
        var ballPosLen = data["ballPosition"].length;
        data["avgBallPos"] = distanceSetup.round(sum/ballPosLen, 2);
        var ball_sqr_distance = (data["squarePosition"]-data["avgBallPos"])/data["px2mm"];
        var viewDistance = ball_sqr_distance/Math.radians(angle)
        // console.log(Math.radians(angle))
        data["viewDistance_mm"] = distanceSetup.round(viewDistance, 2);

        //counter and stop
        var counter = Number($('#click').text());
        counter = counter - 1;
        $('#click').text(Math.max(counter, 0));
        if (counter <= 0) {

            ball.stop();
            endAnimation();

            // Disable response
            responseWindow = false;

            // show 'give-up' button after a minimum of two tries
            if (data["attempts"] >= 1){
                $('#giveupbuttoncontainer').css("display", "block");
            }

            // Display data
            data["attempts"]++;
            $('#postonsetwindow').css("visibility", "visible");
            $('#estviewdist').text((data["viewDistance_mm"]/10).toFixed(2));

            // You can then DO SOMETHING HERE TO PROCEED TO YOUR NEXT STEPS OF THE EXPERIMENT. For example, add a button to go to the next page.       
            // RescaleDisplay(data); 
            return;
        }

        ball.stop();
        pausing = true;
        setTimeout(function(){
            animateBall();
        },500);
    }
}

function startAnimation(){
  $('#svgContainer').css('display','block');
}

function endAnimation(){
  $('#svgContainer').css('display','none');
}


// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

