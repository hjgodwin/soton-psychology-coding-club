# Psychology Coding Club - University of Southampton

On this page is a collection of code snippets, challenges, and other information gathered by the Psychology Coding Club. We work together to learn new ways to improve and enhance our coding skills, help people out, and give ourselves new and interesting challenges.

## Coding Club Members

-   Matt Anderson [[Scholar Link]](https://scholar.google.com/citations?user=xybZSF8AAAAJ&hl=en)
-   Philippa Broadbent [[Scholar Link]](https://scholar.google.com/citations?user=oZPy3EYAAAAJ&hl=en&oi=ao)
-   Ovidiu-Ionut Brudan
-   Hayward Godwin [[Scholar Link]](https://scholar.google.com/citations?user=sqGW95kAAAAJ&hl=en)
-   Veronica Pisu
-   Michaela Trescackova
-   Greta Vilidaite [[Scholar Link]](https://scholar.google.com/citations?user=KSeCnWMAAAAJ&hl=en&oi=ao)

## Coding Club Challenges

### Challenge \#1: The Broadbent Challenge

In the first challenge, **Philippa** challenged us with the following:

> The goal is the have a button on every page of the experiment which, when clicked, redirects the participant to the debrief page and deletes their data (like the addAbortButton jatos function that doesn't seem to work when the jsPsych experiment is exported to external jatos). A bonus challenge is to left-align the text in the consent and debrief forms but keep the text in the main experiment centre-aligned.

We did what we could.

-   **Matt:** Submission [here](https://github.com/hjgodwin/soton-psychology-coding-club/tree/main/Challenges/Week%201%20-%20The%20Broadbent%20Challenge/Matt). To create the quit button, I used the existing jspsych plugin 'survey-likert', to create a new, custom plugin, 'survery-likert-withquitbutton'. In the plugin itself, I added a button element, and an event listener which invokes the jatos function 'startNextComponent()' when the button is clicked. To left-align the text, I wrapped a html div around the to-be-formatted text, and used some inline css

-   **Veronica:** To overcome the problem with the 'jatos.addAbortButton' not working on jsPsych, I created a html button which calls the 'jatos.abortStudy' function as the JATOS abort button would do. This should assure data are automatically deleted on click. To display the button on top of each response screen, I exploited the 'preamble' argument in the jsPsych 'survey-likert' plugin, but better solutions are possible. To left-align the text, I enclosed it into a div and used inline css. You can find the code [here](https://github.com/hjgodwin/soton-psychology-coding-club/tree/main/Challenges/Week%201%20-%20The%20Broadbent%20Challenge/Veronica/Broadbent%20Challenge).

-   **Hayward:** I put a version together that you can see the code for by [clicking here](https://github.com/hjgodwin/soton-psychology-coding-club/tree/main/Challenges/Week%201%20-%20The%20Broadbent%20Challenge/Hayward). There's a live version of the study that you can find by [clicking here](https://studies.psychology.soton.ac.uk/publix/88/start?batchId=95&generalMultiple).

### Challenge \#2: :potato: The Rotato Challenge

**The challenge from Greta:** To create a simple rotating 3D object that can be somehow adjusted by the participant (e.g. moving the mouse would change the size or shape of it) and display this during a trial alongside a static image stimulus, ideally in jsPsych. For example, the previous version of the experiment (written in Matlab) had two surfaces in the shape of an open book which could be adjusted by the participants (making the book more or less open). This was presented next to a circular image stimulus of a natural scene.

-   **Matt:** Submission [here](https://github.com/hjgodwin/soton-psychology-coding-club/tree/main/Challenges/Week%202%20-%20The%20Rotato%20Challenge/Matt/p5_test). I used the p5.js library to rotate a torus around its x and y axes based on the mouse movements of the user. To make p5 and jspsych work together, I set up a javascript p5 object in the main html script. In the documentation, this is referred to as p5 'instance mode'. Here I set other relevant properties like the background, and the shape that the user sees before they've interacted with anything. I do not create an instance of this object until the user begins a trial. I set up a specific trial type/plugin called 'jspsych-animate-primitive.js'. At this point, an instance is created, and the instance is assigned to a html div (defined in the plugin) so that its position in the window can be adjusted using css. An event listener moves the torus whenever the user presses the mouse down and moves the mouse. The x and y rotation in radians are saved when the user presses any of the buttons (and finishes the trial). Finishing the trial deletes the p5 instance.
-   **Veronica:** Displaying multiple stimuli using the basic jsPsych plugins can be a bit complicated. My contribution to the rotato challenge was to create a simple demo using the 'jspsych-psychophysics' plugin (which you can find [here](https://jspsychophysics.hes.kyushu-u.ac.jp)) to show how you can create a html canvas and to draw and present multiple stimuli using xy coordinates. I also used some of the 'jspsych-psychophysics' demos to show how you can create objects via JS. I didn't add any interactive objects to the demo, but that is also feasible. You can find the demo [here](https://github.com/hjgodwin/soton-psychology-coding-club/tree/main/Challenges/Week%202%20-%20The%20Rotato%20Challenge/Veronica/rotato%20challenge).

### Weeks 3 and 4: Cleaning Data from jsPsych and Jatos

For these two weeks, we looked at cleaning data downloaded from Jatos that's been generated by experiments made using jsPsych.

Now, Jatos allows you to have two options when uploading participant data to the server:

-   JSON format data. This is great but the downside is that it's not easily thrown into excel when you want to check to see how things are going, and/or to debug experiments when writing them.

-   CSV format data. This is also great but the downside is that the server downloads this to you in a weird format. The download you get consists of the headers of the datafile along with each dataset from each participant, with a gap between each participant before the headers start again. As such, it needs to be cleaned before it can be useful.

Both have their pros and cons, and we discussed them during the session. During week 3, we noted that the code we collectively had for doing this in Matlab or R was quite clunky and wouldn't really translate well to other studies without extensive work. With that in mind, we set ourselves the challenge for week 4 to streamline the code and turn it into a set of functions that could be used for any study. Here's how we got on:

-   Matt:

-   Veronica:

-   Phillipa:

-   **Hayward:** My approach involved streamlining the code I used before and turning it into just two lines of code. I previously read the CSV file generated by the server line by line and cleaned out the gaps between datasets and removed the headers. When you have 10,000s of rows, this takes a very long time. My new version uses the R package data.table to do this rapidly and effectively for me. It can be found [here].
