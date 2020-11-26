# Psychology Coding Club - University of Southampton

On this page is a collection of code snippets, challenges, and other information gathered by the Psychology Coding Club. We work together to learn new ways to improve and enhance our coding skills, help people out, and give ourselves new and interesting challenges.

## Coding Club Members

- Matt Anderson *https://scholar.google.com/citations?user=xybZSF8AAAAJ&hl=en*
- Philippa Broadbent *[add link/social/scholar]*
- Ovidiu-Ionut Brudan *[add link/social/scholar]*
- Hayward Godwin *[add link/social/scholar]*
- Veronica Pisu *[add link/social/scholar]*
- Michaela Trescackova *[add link/social/scholar]*
- Greta Vilidaite (https://scholar.google.com/citations?user=KSeCnWMAAAAJ&hl=en&oi=ao)

## Coding Club Challenges

### Challenge #1: The Broadbent Challenge

In the first challenge, Philippa challenged us with the following:

>The goal is the have a button on every page of the experiment which, when clicked, redirects the participant to the debrief page and deletes their data (like the addAbortButton jatos function that doesn't seem to work when the jsPsych experiment is exported to external jatos).  A bonus challenge is to left-align the text in the consent and debrief forms but keep the text in the main experiment centre-aligned.

We did what we could.

- *Matt: To create the quit button, I used the existing jspsych plugin 'survey-likert', to create a new, custom plugin, 'survery-likert-withquitbutton'. In the plugin itself, I added a button element, and an event listener which invokes the jatos function 'startNextComponent()' when the button is clicked. To left-align the text, I wrapped a html div around the to-be-formatted text, and used some inline css*
- *[Veronica's response]*

- Hayward put a version together that you can see the code for by [clicking here](https://github.com/hjgodwin/soton-psychology-coding-club/tree/main/Challenges/Week%201%20-%20The%20Broadbent%20Challenge/Hayward). There's a live version of the study that you can find by [clicking here](https://studies.psychology.soton.ac.uk/publix/88/start?batchId=95&generalMultiple).

### Challenge #2: :potato: The Rotato Challenge


The challenge:
To create a simple rotating 3D object that can be somehow adjusted by the participant (e.g. moving the mouse would change the size or shape of it) and display this during a trial alongside a static image stimulus, ideally in jsPsych. For example, the previous version of the experiment (written in Matlab) had two surfaces in the shape of an open book which could be adjusted by the participants (making the book more or less open). This was presented next to a circular image stimulus of a natural scene.

- *Matt: I used the p5.js library to rotate a torus around its x and y axes based on the mouse movements of the user. To make p5 and jspsych work together, I set up a javascript p5 object in the main html script. In the documentation, this is referred to as p5 'instance mode'. Here I set other relevant properties like the background, and the shape that the user sees before they've interacted with anything. I do not create an instance of this object until the user begins a trial. I set up a specific trial type/plugin called 'jspsych-animate-primitive.js'. At this point, an instance is created, and the instance is assigned to a html div (defined in the plugin) so that its position in the window can be adjusted using css. An event listener moves the torus whenever the user presses the mouse down and moves the mouse. The x and y rotation in radians are saved when the user presses any of the buttons (and finishes the trial). Finishing the trial deletes the p5 instance.*
- *[Veronica's response]*
