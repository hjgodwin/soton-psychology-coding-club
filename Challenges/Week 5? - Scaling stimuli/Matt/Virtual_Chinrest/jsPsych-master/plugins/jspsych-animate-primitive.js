/**
 * jspsych-image-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["jspsych-animate-primitive"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'jspsych-animate-primitive',
    description: '',
    parameters: {
      image: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      image_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'image width',
        default: null,
        description: 'Set the primitive width in pixels'
      },
      image_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'image height',
        default: null,
        description: 'Set the primitive height in pixels'
      },
      primitive_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Primitive width',
        default: null,
        description: 'Set the primitive width in pixels'
      },
      primitive_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Primitive height',
        default: null,
        description: 'Set the primitive height in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // wrap container around image/webgl stuff
    if (trial.primitive_height > trial.image_height){
      var containerheight = trial.primitive_height;
    } else {
      var containerheight = trial.image_height;
    }
    var html = "<div id='stimulusContainer' style='width: "+(trial.primitive_width+trial.image_width+(trial.primitive_width/2))+"px; height: "+containerheight+"px;'>";
    
    // display image
    html += "<div id='imgContainer' style='width: "+trial.image_width+"px; height: "+trial.image_height+"px; float:left;'>";
      html += "<img src='"+trial.image+"' style='width: "+trial.image_width+"px; height: "+trial.image_height+"px;'>";
    html += '</div>';

    // display primitive
    html += "<div id='primitiveContainer' style='width: "+trial.primitive_width+"px; height: "+trial.primitive_height+"px; float:left;'></div>";

    // and slider off to the right
    html += "<div id='sliderContainer' style='width: "+(trial.primitive_width/2)+"px; height: "+trial.primitive_height+"px; float:left;'>";

    html += '<div id="toplabel" style="height: 20%; width: 100%; display:inline-block; text-align: center; font-size: 70%;">';
    html += '<span style="color: white; display:inline-block; padding:3%;"> Angle: </span>';
    html += '<span id="angtext" style="color: #ffd633; display:inline-block; padding:3%;">180</span>';
    html += '</div>';

    html += '<div style="height:80%; width:100%; display:flex;">'
    html += '<input id="slider" type="range" value="180" min="'+0+'" max="'+360+'" step="'+1+'" orient="vertical" style="-webkit-appearance: slider-vertical;"></input>';
    html += "</div>";

    html += "</div>";
    html += '</div>';
    html += '<br>';


    //display buttons
    // var buttons = [];
    // if (Array.isArray(trial.button_html)) {
    //   if (trial.button_html.length == trial.choices.length) {
    //     buttons = trial.button_html;
    //   } else {
    //     console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
    //   }
    // } else {
    //   for (var i = 0; i < trial.choices.length; i++) {
    //     buttons.push(trial.button_html);
    //   }
    // }
    html += '<div id="jspsych-image-button-response-btngroup">';

    // add submit button
    html += '<br><button id="jspsych-image-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>Continue</button>';
    // add help button
    html += '<br><br><button id="jspsych-image-slider-response-help" class="jspsych-btn">Help</button>';

    // for (var i = 0; i < trial.choices.length; i++) {
    //   var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
    //   html += '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-image-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    // }
    html += '</div>';

    // help page over the top
    html += '<div id="myModal" class="modal" style="display:none; cursor: pointer; position:fixed; z-index:1; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgb(0,0,0); background-color:rgba(1,1,1,0.4);">';
    html += '<div class="modal-content" style="background-color: rgb(75,75,75); margin: 15% auto; width: 805px;">';
    html += '<span class="close" style="color: #aaa; float:right; font-size:28px;font-weight:bold; close=">&times;</span>';
    html += 'Help Page';//taskinstructionshtml_short;
    html += '</div>';
    html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    // create new instance of animation object
    startrad = Math.PI/2*(Math.random()-.5);
    let startang_deg = Math.round(((Math.PI)-2*startrad)/(2*Math.PI)*360);
    let endang_deg;
    let bnd = .01;

    let primitive = document.getElementById('primitiveContainer');
    let myp5 = new p5(s, primitive);

    // set up slider behaviour
    var slider = display_element.querySelector('#slider');
    var angtext = display_element.querySelector('#angtext');
    var next_listen = display_element.querySelector('#jspsych-image-slider-response-next');

    slider.value = startang_deg; // starting position of slider
    UpdateResponseText(slider.value);

    slider.addEventListener('mousedown', function(){
      next_listen.disabled = false;
      UpdateUI(slider.value);
      slider.addEventListener('mousemove', function(){
        UpdateUI(slider.value);
      });
    });
    slider.addEventListener('mouseup', function(){
      UpdateUI(slider.value);
    });

    function UpdateUI(currval){
      UpdateResponseText(currval);
      UpdateAngleAnimation(currval);
    }

    function UpdateResponseText(currval){
      angtext.innerHTML = (currval) + String.fromCharCode(176);
    }

    function UpdateAngleAnimation(currval){
      // we need to convert the degrees to radians
      endang_deg = currval;
      var currrad = (((360-currval)/360)*(2*Math.PI)+Math.PI)/2-Math.PI;
      currrad = Math.min(currrad,Math.PI/2-bnd)
      currrad = Math.max(currrad,-Math.PI/2+bnd)

      let cx1 = r*Math.cos(Math.PI-currrad)+cx;
      let cy1 = r*Math.sin(Math.PI-currrad)+cy;

      let cx2 = r*Math.cos(currrad)+cx;
      let cy2 = r*Math.sin(currrad)+cy;

      myp5.background(50);
      myp5.push();

      // draw lines and arc
      myp5.line(cx,cy,cx1,cy1);
      myp5.line(cx,cy,cx2,cy2);
      myp5.arc(cx, cy, r/4, r/4, currrad, Math.PI-currrad);

      // draw eye image below
      myp5.image(eyeimg,imgx,imgy,imgxsz,imgysz);

      myp5.pop();
      myp5.redraw();
    }

    // display or hide task instructions reminder based on user behaviour
    display_element.querySelector('#jspsych-image-slider-response-help').addEventListener('click', function() {
      display_element.querySelector('#myModal').style.display = "block";
    });
    display_element.querySelector('.close').addEventListener('click', function() {
      display_element.querySelector('#myModal').style.display = "none";
    });
    window.onclick = function(event) {
      if (event.target == display_element.querySelector('#myModal')) {
        display_element.querySelector('#myModal').style.display = "none";
      }
    }

    // start timing
    var start_time = performance.now();

    // store response
    var response = {
      rt: null,
      button: null,
      shapeang: null
    };

    // function to handle responses by the subject
    next_listen.addEventListener('click', function() {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.rt = rt;

      if (trial.response_ends_trial) {
        end_trial();
      }
    });

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      myp5.remove();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.image,
        "button_pressed": response.button,
        "start_angle": startang_deg,
        "end_angle": endang_deg
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial, saving data every 5 trials
      if (nt%5==0) {
        jatos.submitResultData(jsPsych.data.get().csv());
      } 
      nt++;
      jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
