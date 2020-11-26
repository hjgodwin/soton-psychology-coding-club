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
        pretty_name: 'Primitive width',
        default: null,
        description: 'Set the primitive width in pixels'
      },
      image_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Primitive height',
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
    }
  }

  plugin.trial = function(display_element, trial) {

    // wrap container around image/webgl stuff
    if (trial.primitive_height > trial.image_height){
      var containerheight = trial.primitive_height;
    } else {
      var containerheight = trial.image_height;
    }
    var html = "<div id='stimulusContainer' style='width: "+(trial.primitive_width+trial.image_width)+"px; height: "+containerheight+"px;'>";
    
    // display image
    html += "<div id='imgContainer' style='width: "+trial.image_width+"px; height: "+trial.image_height+"px; float:left;'>";
      html += "<img src='"+trial.image+"' style='width: "+trial.image_width+"px; height: "+trial.image_height+"px;'>";
    html += '</div>';

    // display primitive
    html += "<div id='primitiveContainer' style='width: "+trial.primitive_width+"px; height: "+trial.primitive_height+"px; float:left;'></div>";
    html += '</div>';
    html += '<br>';


    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-image-button-response-btngroup">';

    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-image-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    // create new instance of animation object
    let primitive = document.getElementById('primitiveContainer');
    let myp5 = new p5(s, primitive);
    let x;
    let y;
    primitive.addEventListener('mousemove',e => {
      if (myp5.mouseIsPressed) {
        x = e.offsetX * 0.01;
        y = e.offsetY * 0.01;
        myp5.background(255);
        myp5.push();
        myp5.rotateX(y);
        myp5.rotateY(x);
        myp5.torus(ts[0], ts[1]);
        myp5.pop();
        myp5.redraw();
      }
      
    });

    // start timing
    var start_time = performance.now();

    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-image-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null,
      shapeang: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      // display_element.querySelector('#jspsych-image-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-image-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

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
        "shape_angle_rad": [x,y]
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
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
