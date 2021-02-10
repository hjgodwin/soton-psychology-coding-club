clear; clc; close all;

data = readtable('Results_3ppt.txt','PreserveVariableNames', true);

getColumns = {'stimulus','presentationTime','slider_response','btn_response'};

getRows = {{'stimulus','DotProbeStimuli'},...
           {'btn_response',{'Left','Right'}}};
       
splitColumn = {{'stimulus','/'}};

formatted_data = Format_JatosOutput(data,getColumns,getRows, splitColumn);