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
				default: 50,
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
    // var height_px = Math.round($(window).height()/2);
    // var offset = height_px - Math.round(trial.stimulus_width*(1/3));
    // we need to add an offset depending on the user's monitor size to center the responds window properly
    var offsetx = Math.round(($(window).width()-trial.stimulus_width)/2);
    var offsety = Math.round(($(window).height()-trial.stimulus_width*(2/3))/2);


    // var html = '<div style="transform:translate(0px,'+offset+'px);">'
    var html = '<div style="position:absolute; top:'+ offsety +'px; left:'+ offsetx +'px;">'
      html +='<div id="allelements" style="margin: auto; width:'+trial.stimulus_width+'px; height:'+trial.stimulus_width+'px;">';
      html += '<div id="jspsych-image-slider-response-stimulus" style="margin: auto; width:'+trial.stimulus_width+'px; height:'+Math.round(trial.stimulus_width*(2/3))+'px;">';
        html += '<img src="' + trial.stimulus + '"style="margin: auto; width: 100%; height: 100%;"></img>';
      html += '</div>';

      html += '<div id="response-window" style="width: 100%; height: 33.333%; position: relative; padding-top: 5%;">';

        // we create a wrapper the radio buttons
        html += '<div id="jspsych-image-radiobutton-response-wrapper" style="width: 33%; height: 100%; float: left; position: relative;">';
          html += '<div id=radiobutton style="width: 100%; height: 30%; display: inline-block; position: relative;">';
            html += '<span style="text-align: center; font-size: 80%; color: #6699ff;"> <b>Which location<br>is farther?</b><br> </span>';
            html += '<input type="radio" id="btnLeft" name="binaryresponse" value="Left">';
            html += '<label for="Left" style="color: white; padding:10px;">Left   </label>';
            html += '<input type="radio" id="btnRight" name="binaryresponse" value="Right">';
            html += '<label for="Right" style="color: white; padding:10px;">Right</label>';
          html += '</div>';
        html += '</div>';

        // put slider beside the radio buttons
        html += '<div id="jspsych-image-slider-response-wrapper" style="width: 33%; height: 100%; float:left; position: relative; display: none;">';
          html += '<span style="text-align: center; font-size: 80%; color: #6699ff; height: 20%;"> <b>How much closer is<br> the <i><span id="closerloc"></span> location?</i></b><br> </span>';
          html += '<div style="height:10%; width:100%; display:table;"><span id="toplabel" style="text-align: center; font-size: 80%; color: white; height: 10%;"> top</b><br> </span></div>';
            html += '<div class="jspsych-image-slider-response-container" style="height: 60%; width: 100%; position: relative;"';
              if(trial.slider_width !== null){
              html += 'width:'+trial.slider_width+'px;';
              }
              html += '">';
              html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+
              '" orient="vertical" style="height: 100%; width: 100%; -webkit-appearance: slider-vertical;" id="jspsych-image-slider-response-response"></input>';
            html += "</div>";
            html += '<div style="height:10%; width:100%; display:table;"><span id="bottomlabel" style="text-align: center; font-size: 80%; color: white; height: 10%;"> You</b><br> </span></div>';
          html += '</div>';

          // and wrapper for right-side feedback/UI components
        html += '<div id="jspsych-image-UIstuff-response-wrapper" style="width: 33%; height: 100%; float:right; position: relative;">';
          html += '<div style="width:100%;height:50%;">'
            html += '<div id="responsetext" style="color: #ffd633; font-size:80%;">';
            if (trial.prompt !== null){
              html += trial.prompt;
            }
            html += '</div>';
          html += '</div>';

          html += '<div style="width:100%;height:50%;">'
            // add submit button
            html += '<br><button id="jspsych-image-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';
            // add help button
            html += '<br><br><button id="jspsych-image-slider-response-help" class="jspsych-btn">Help</button>';
          html += '</div>';
        html += '</div>'; 
      html += '</div>';
    html += '</div>';
  html += '</div>';


  // add help-related instructions window
  var instructionimages = {
      schematic1: 'InstructionFiles/Example_Silhouette.png',
      schematic2: 'InstructionFiles/Example_Silhouette_4.png',

      exampleim1: 'DotProbeStimuli/Same_Elevation/above_hrzn/distbins1-5_VS_distbins16-20/stimuli/Scene7_View11.jpg',
      exampleim1_answer: 'The <i>Right</i> location is <b>21%</b> closer to you than the <i>Left</i> location',
      exampleim2: 'DotProbeStimuli/Variable_Elevation/mixed_hrzn/distbins11-15_VS_distbins11-15/stimuli/Scene21_View10.jpg',
      exampleim2_answer:'The <i>Left</i> and <i>Right</i> locations are equidistant',
      exampleim3: 'DotProbeStimuli/Variable_Elevation/mixed_hrzn/distbins1-5_VS_distbins6-10/stimuli/Scene15_View6.jpg',
      exampleim3_answer: 'The <i>Left</i> location is <b>35%</b> closer to you than the <i>Right</i> location',

      exampleprobes: 'DotProbeStimuli/Same_Elevation/above_hrzn/distbins1-5_VS_distbins16-20/probes/Scene7_View11.png',
      examplefixation: 'fixationCross_prompt.png',
      examplemask: 'DotProbeStimuli/Same_Elevation/above_hrzn/distbins1-5_VS_distbins16-20/masks/Scene7_View11.jpg',
    }
  var taskinstructionshtml = GenerateTaskInstructionsHTML(instructionimages);
  var taskinstructionshtml_short = taskinstructionshtml[1]+taskinstructionshtml[7];

  html += '<div id="myModal" class="modal" style="display:none; cursor: pointer; position:fixed; z-index:1; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgb(0,0,0); background-color:rgba(0,0,0,0.4);">';
  html += '<div class="modal-content" style="background-color: rgb(75,75,75); margin: 15% auto; width: 805px;">';
  html += '<span class="close" style="color: #aaa; float:right; font-size:28px;font-weight:bold; close=">&times;</span>';
  html += taskinstructionshtml_short;
  html += '</div>';
  html += '</div>';
    

    display_element.innerHTML = html;

    var response = {
      rt: null,
      response: null
    };

    // establish slider behaviour
    var currval;
    var slider_listen = display_element.querySelector('#jspsych-image-slider-response-response');
    var next_listen = display_element.querySelector('#jspsych-image-slider-response-next');
    var radiobutton_listen = display_element.querySelector('#radiobutton');
    var radios = document.getElementsByName('binaryresponse');

    // slider is disabled until radio button is clicked
    var btn_pressed;
    var btn_not_pressed;
    radiobutton_listen.addEventListener('change', function(){
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          btn_pressed = radios[i].value;
        } else {
          btn_not_pressed = radios[i].value;
        }
      }
      document.querySelector('#toplabel').innerHTML = btn_pressed + ' location';
      document.getElementById('jspsych-image-slider-response-wrapper').style.display = 'block';
      display_element.querySelector('#closerloc').innerHTML = btn_not_pressed;
      UpdateResponseText(slider_listen.value);
    });

    // behaviour of slider
    if(trial.require_movement){
      slider_listen.addEventListener('mousedown', function(){
        next_listen.disabled = false;
        UpdateResponseText(slider_listen.value);
        slider_listen.addEventListener('mousemove', function(){
          UpdateResponseText(slider_listen.value);
        });
      });
      slider_listen.addEventListener('mouseup', function(){
        UpdateResponseText(slider_listen.value);
      });
    }

    // save data at end of trial (once button is clicked)
    next_listen.addEventListener('click', function() {

      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.response = slider_listen.value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        next_listen.disabled = true;
      }
    });

    function UpdateResponseText(currval){
      // var distancepercentage = Math.round(currval/trial.max*100);
      var distancepercentage = Math.round((currval)/trial.max*100);
      distancepercentage = Math.max(1,distancepercentage);
      if (distancepercentage >= 100){
        responsetext.innerHTML = 'Your response:<br>The left and right locations are equidistant';
      } else {
        responsetext.innerHTML = 'Your response:<br>The <i>' + btn_not_pressed + '</i> location is <b>' + distancepercentage + '</b>% closer to you than the <i>' + btn_pressed + '</i> location';
      }
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

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "slider_response": response.response,
        "btn_response": btn_pressed
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