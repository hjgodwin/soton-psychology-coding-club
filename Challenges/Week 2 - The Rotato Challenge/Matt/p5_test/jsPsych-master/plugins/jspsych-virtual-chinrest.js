/**
 * jspsych-image-slider-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['virtual-chinrest'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-slider-response', 'stimulus', 'image');

  plugin.info = {
    name: 'virtual-chinrest',
    description: '',
    parameters: {
      img_horzpx: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Horizontal image pixels',
        default: 750,
        description: 'This is the resolution of the image stored on the server'
      },
      img_VA: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'degrees of visual angle',
        default: 10.0,
        description: 'Image size in degrees of visual angle'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // create image. dimensions of response window allows for probe image at 2/3rds scale, and two sliders that occupy 25% of the width
    var html = `<div id="content" style="color:white;text-align: left; width:100%; height:75%;">
            <div id="page-size" style="position:absolute;top:5%;left:5%;">
                <h3> Let’s find out how large your monitor is.</h2>
                
                <p>Please use any credit card that you have available (or anything the same size), place it on the screen, and adjust the slider below to match its size.</p>
                
                <p>(If you don't have access to a real card, you can use a ruler to adjust the image width to 3.37inch or 85.6mm)</p>
                <b style="font-style: italic">Make sure you put the card onto your screen.</b>
                <br>
                
                <div id="container">
                    <br><br>
                    <div id="slider" style="width: 50%;"></div>
                    <br>
                    <img id="card" src="card.png" style="width: 50%">
                    <br><br>
                    <button id="btn1" class="btn btn-primary" onclick="configureBlindSpot()">Click here when you are done!</button>
                </div>
            </div>


            <div id="blind-spot" style="display: none;">
              <div>
                  <!-- <h2 class="bolded-blue">Task 2: Where’s your blind spot?</h2> -->
                  <h3>Now, let’s quickly test how far away you are sitting.<br></h3>
                  <p>1. Sit close to your computer screen - but not so close that you are uncomfortable and/or straining your eyes (the screen should <i>not</i> appear blurry). You should be able to touch the screen with your hand. Adjust your chair/computer so the center of the screen is at eye-height. Make yourself comfortable. Once we determine how far you are sitting from the monitor, we ask you to maintain that distance throughout the experiment.</b></p>
                  <p>2. When you click the 'start' button below, you will see a<b style="color:#FFD700;"> yellow </b>square, and a <b style="color: red">red</b> ball.
                  <p>3. Close your right eye. <em>(Tip: it might be easier to cover your right eye by hand!)</em></p>
                  <p>3. Using your left eye, focus on the<b style="color:#FFD700;"> yellow </b>square.</p>
                  <p>4. The <b style="color: red">red</b> ball will disappear as it moves from right to left. Click the left mouse button as soon as the ball disappears from sight. Note that this will only work if you focus on the yellow square!</p>
                  <br>
                  <p>Please do this <b>five</b> times. Keep your right eye closed and click the left mouse button (anywhere in the window) the moment the ball disappears! Press 'Start' when you are ready.</p>
                  <p><em>(Tip: If the ball never disappears, try again and sit a little closer to the screen. You can do as many tries as you like.)</em></p>
                  <button class="btn btn-primary" id="start" onclick="animateBall(); startAnimation();">Start</button>
                  <br>
              </div>

              <div id="svgContainer" style="display:none; cursor: pointer; position:fixed; z-index:1; top:0; left:0; width:100%; height:100%; overflow:auto; background-color:rgb(0,0,0); background-color:rgba(0,0,0,0.7);">
                <div id="svgDiv" style="position:relative; top:50%; height:100px;">
                </div>
                <div id='clickcontainer' style="position:relative; top:50%; display:table; margin: 0 auto;">
                  Click <div id="click" style='display:inline; color: red; font-weight: bold'>5</div> more times!
                </div>
              </div>

              
            
              <div id='postonsetwindow' style='visibility:hidden;'>

                <div id="info">
                    <h3 id="info-h">Estimated viewing distance (cm): <span id = "estviewdist"></span></h3>
                </div>

                <br>
                <div id="retrybuttoncontainer">
                    <button id="retrybutton" class="jspsych-btn">Retry</button>
                </div>
                <br>
                <div id="continuebuttoncontainer">
                    <button id="continuebutton" class="jspsych-btn">This seems correct</button>
                </div>

                <br>
                <div id="giveupbuttoncontainer" style="display:none;">
                    <button id="giveupbutton" class="jspsych-btn" style="background-color: #f44336; color: white;">This isn't working</button>
                </div> 

                <div id="gaveup" style="display:none; position:fixed; z-index:1; top:0; left:0; width:100%; height:100%; overflow:auto; background-color:rgb(0,0,0); background-color:rgba(0,0,0,0.7);">
                  <div id='clickcontainer' style="position:relative; top:50%; display:table; margin: 0 auto; text-align:center;">
                    Since we cannot estimate your viewing distance, please stretch your arm out in front of you,<br> and adjust your seat backwards/forwards so that you can touch the screen with the tips of your fingers. <br> Please complete the whole experiment at this distance. Press 'Continue' when you are ready.
                  </div>
                  <br>
                  <div id="continuebuttoncontainer2" style="position:relative; top:50%; margin:0 auto; display:table;">
                    <button id="continuebutton2" class="jspsych-btn">Continue</button>
                  </div>
                </div>

            </div>
            
        </div>`;

    display_element.innerHTML = html;

    // virtual chinrest things
    StartVirtualChinrest();
    
    var cardWidth;
    var ContinueButtonPressed = document.getElementById('continuebutton');
    ContinueButtonPressed.addEventListener('click',function(){
      data['UsedArmSpan'] = false;
      end_trial();
    })

    var ContinueButtonPressed2 = document.getElementById('continuebutton2');
    ContinueButtonPressed2.addEventListener('click',function(){
      // use average arm span to estimate distance
      data['UsedArmSpan'] = true;
      data['viewDistance_mm'] = 678.5;
      end_trial();
    })

    var RetryButtonPressed = document.getElementById('retrybutton');
    var GiveUpButton = document.getElementById('giveupbutton');
    RetryButtonPressed.addEventListener('click',function(){
      responseWindow = true;
      data["ballPosition"] = [];
      startAnimation();
      $('#postonsetwindow').css("visibility", "hidden");
      $('#click').text(5);
      animateBall();
    });

    $('#giveupbutton').on('click', function(){
      $('#gaveup').css('display','block');
    })

    
    function end_trial(){

      // convert angle to pixels. we know we want the stimuli to be 31 DVA
      var stimVA = trial.img_VA;
      var CardWidthcm = 8.56;
      var pixpercm = CardWidthcm/data.cardWidthPx;
      var stimVA_cm = 2*data.viewDistance_mm/10*Math.tan(Math.PI*stimVA/(2*180));
      var stimVA_px = Math.round(stimVA_cm/pixpercm);
      var scaleFactor = stimVA_px/trial.img_horzpx; // 750 pixels is the resolution of the images stored in the server database
      // document.getElementById("jspsych-content").style.transform = "scale(" + scaleFactor + ")";

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        'View Distance': data.viewDistance_mm,
        'Pix per cm': data.cardWidthPx,
        'Scaling Factor': scaleFactor,
        'Scaled Size': stimVA_px,
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    var startTime = performance.now();
  };

  return plugin;
})();
