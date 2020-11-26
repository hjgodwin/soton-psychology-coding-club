/**
 * jspsych-image-slider-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['image-slider-response'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-slider-response', 'stimulus', 'image');

  plugin.info = {
    name: 'image-slider-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: null,
        description: 'The image to be displayed'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 1,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 200,
        description: 'Sets the maximum value of the slider',
      },
      start: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Slider starting value',
				default: 100,
				description: 'Sets the starting value of the slider',
			},
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name:'Slider width',
        default: null,
        description: 'Width of the slider in pixels.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
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
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // create image. dimensions of response window allows for probe image at 2/3rds scale, and two sliders that occupy 25% of the width
    var html = '<div id="response-window" style="width: 600px; height: 300px;">';
      html += '<div id="jspsych-image-slider-response-stimulus" style="margin: auto; width: 75%; height: 100%; float: left;">';
        html += '<img src="' + trial.stimulus + '"style="margin: auto; width: 100%; height: 100%;"></img>';
      html += '</div>';

      // we create the first slider
      html += '<div id="jspsych-image-slider-response-wrapper" style="width: 5%; height: 100%; float: left;">';

        // create label above slider
        html += '<div id=sliderlabel1 style="width: 250%; height: 10%; display: inline-block; position: relative;">';
        html += '<span style="text-align: center; font-size: 80%; color: green;"> <b>LEFT</b> </span>';
        html += '</div>';

        // place slider below label
        html += '<div class="jspsych-image-slider-response-container" style="height: 90%; width: 100%;"';
          if(trial.slider_width !== null){
            html += 'width:'+trial.slider_width+'px;';
          }
          html += '">';
          html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+
          '" orient="vertical" style="height: 100%; width: 100%; -webkit-appearance: slider-vertical;" id="jspsych-image-slider-response-response1"></input>';
        html += '</div>';

      html += '</div>';

     

      html += '<div id="TextWrapper1" style="height: 90%; width: 7.5%; float:left;">'
        for(var j=0; j < trial.labels.length; j++){
          var vert_offset = (j * (80 /(trial.labels.length - 1)));
          html += '<div style="display: inline-block; position: relative; top:'+vert_offset+'%; text-align: left; transform: translate(0%,100%);">';
            html += '<span style="text-align: center; font-size: 80%; color: white;">'+trial.labels[j]+'</span>';
          html += '</div>';
        }
      html += '</div>';

      // now we create the second slider!
      html += '<div id="jspsych-image-slider-response-wrapper2" style="width: 5%; height: 100%; float: left;">';

        // create label above slider
        html += '<div id=sliderlabel2 style="width: 250%; height: 10%; display: inline-block; position: relative;">';
        html += '<span style="text-align: center; font-size: 80%; color: green;"> <b>RIGHT</b> </span>';
        html += '</div>';
        

        html += '<div class="jspsych-image-slider-response-container2" style="height: 90%; width: 100%;"';
          if(trial.slider_width !== null){
            html += 'width:'+trial.slider_width+'px;';
          }
          html += '">';
          html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+
          '" orient="vertical" style="height: 100%; width: 100%; -webkit-appearance: slider-vertical;" id="jspsych-image-slider-response-response2"></input>';
        html += '</div>';
      html += '</div>';

      html += '<div id="TextWrapper2" style="height: 90%; width: 7.5%; float:left;">'
        for(var j=0; j < trial.labels.length; j++){
          var vert_offset = (j * (80 /(trial.labels.length - 1)));
          html += '<div style="display: inline-block; position: relative; top:'+vert_offset+'%; text-align: left; transform: translate(0%,100%);">';
            html += '<span style="text-align: center; font-size: 80%; color: white;">'+trial.labels[j]+'</span>';
          html += '</div>';
        }
      html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<br><br><div id=responsetext style="color: white;">';

    if (trial.prompt !== null){
      html += trial.prompt;
    }
    html += '</div>';

    // add submit button
    html += '<br><br><button id="jspsych-image-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    // add help button
    html += '<br><br><button id="jspsych-image-slider-response-help" class="jspsych-btn">Help</button>';

    // add help-related instructions window
    html += '<div id="myModal" class="modal" style="display:none; cursor: pointer; position:fixed; z-index:1; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgb(0,0,0); background-color:rgba(0,0,0,0.4);">';
    html += '<div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">';
    html += '<span class="close" style="color: #aaa; float:right; font-size:28px;font-weight:bold; close=">&times;</span>';
    html += '<p> -- Reminder of task instructions -- </p>';
    html += '</div>';
    html += '</div>';

    display_element.innerHTML = html;

    var response = {
      rt: null,
      response: null
    };

    // establish slider behaviour
    if(trial.require_movement){

      var currval;
      var slider1_listen = display_element.querySelector('#jspsych-image-slider-response-response1');
      var slider2_listen = display_element.querySelector('#jspsych-image-slider-response-response2');
      var nextbutton = display_element.querySelector('#jspsych-image-slider-response-next');

      // behaviour of slider 1
      slider1_listen.addEventListener('mousedown', function(){
        nextbutton.disabled = false;
        currval = slider1_listen.value;
        slider2_listen.value = trial.max-currval;
        UpdateResponseText(currval);
        slider1_listen.addEventListener('mousemove', function(){
          currval = slider1_listen.value;
          slider2_listen.value = trial.max-currval;
          UpdateResponseText(currval);
        });
      });
      slider1_listen.addEventListener('mouseup', function(){
        currval = slider1_listen.value;
        slider2_listen.value = trial.max-currval;
        UpdateResponseText(currval);
      });

      // behaviour of slider 2 mirrors slider 1
      slider2_listen.addEventListener('mousedown', function(){
        nextbutton.disabled = false;
        slider2_listen.addEventListener('mousemove', function(){
          currval = slider2_listen.value;
          slider1_listen.value = trial.max-currval;
          UpdateResponseText(trial.max-currval);
        });
      });
      slider2_listen.addEventListener('mouseup', function(){
        currval = slider2_listen.value;
        slider1_listen.value = trial.max-currval;
        UpdateResponseText(trial.max-currval);
      });
    }

    // end trial and store data when subject presses 'submit'
    nextbutton.addEventListener('click', function() {
      // measure response time and slider value
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.response = display_element.querySelector('#jspsych-image-slider-response-response1').value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        nextbutton.disabled = true;
      }

    });

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


    function UpdateResponseText(currval){
      var distanceratio = (trial.max-currval)/currval;
      var responsetext = display_element.querySelector('#responsetext');
      distanceratio = Math.min(distanceratio,200);
      if (distanceratio.toFixed(2) == 1){
        responsetext.innerHTML = 'Your response: left and right locations are equidistant';
      }
      else if (distanceratio > 1){
        responsetext.innerHTML = 'Your response: <i>left</i> location is <b>' + distanceratio.toFixed(2) + '</b> times closer';
      }
      else if (distanceratio < 1){
        distanceratio = currval/(trial.max-currval);
        distanceratio = Math.min(distanceratio,200);
        responsetext.innerHTML = 'Your response: <i>right</i>  location is <b>' + distanceratio.toFixed(2) + '</b> times closer';
      }
    }

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-slider-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = performance.now();
  };

  return plugin;
})();