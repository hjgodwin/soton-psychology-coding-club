library(data.table)
library(stringr)
library(ggplot2)

# SCRIPT TAKES IN DATA FROM JSPSYCH/JATOS COMBO AND CLEANS IT

# OLD APPROACH ################################################################################################################################################################################

# BREAK UP FILE LINE BY LINE
fileName <- 'jsPsychJatosData.txt'
collatedFile <- ''

conn <- file(fileName,open="r")
linn <-readLines(conn)
addedHeader <- FALSE

for (i in 1:length(linn)){
  #print(linn[i])
  
  # SAVE HEADER ACROSS
  if (str_detect(linn[i], 'rt')==T & str_detect(linn[i], 'internal_node_id')==T  & addedHeader == F){
    print('Detected first header, adding')
    collatedFile <- c(collatedFile, linn[i])
    addedHeader <- TRUE}
  
  if (linn[i]!='' & (str_detect(linn[i], 'rt')==T & str_detect(linn[i], 'internal_node_id')==T )==F){
    collatedFile <- c(collatedFile, linn[i])
  }
  
}

writeLines(collatedFile, "collatedFile.txt")

# FASTER APPROACH ################################################################################################################################################################################

# THIS WORKS BETTER
xDT <- fread('jsPsychJatosData.txt', fill=T)
xDT <- xDT[subject!='subject' & subject!='',,]
fwrite(xDT, 'cleaned.txt')
xDT <- fread('cleaned.txt')

# TO DO:
# BREAK UP SURVEYS DONE WITH JSON DATA
# SET UP FUNCTION FOR JSON MORE GENERALLY


