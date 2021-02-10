function formatted_data = Format_JatosOutput(data, getColumns, getRows, splitColumn)
        
    %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%%
    % Function to format Jatos Output data for plotting/analyses
    
    % data = your data in MATLAB table format
    
    % getColumns = Cell array of strings. There must be corresponding
    % variable names in the data table
    
    % getRows = A cell array of cell arrays with the structure:
    % {{x1,y1},{x2,y2},...{xn,yn}}. Within the cell array are pairs of
    % string variables. x determines the column you would like to filter by, 
    % and y is the string that is searched for within this column, to determine
    % the rows that are included. y can be another cell array if it's necessary to
    % search for multiple matches. 
    
    % splitColumn = A cell array of cell arrays, with the same structure as
    % getRows: {{x1,y1},{x2,y2},...{xn,yn}}. x is the column in data that you
    % would like to separate into multiple columns in formatted_data. y is
    % the delimiter (e.g., ',' or '/')
    
    %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%% %%%
    
    % first check to see if we have data from multiple, or just one participant
    ppt_idxs = ismember(table2array(data),data.Properties.VariableNames);
    ppt_start = find(all(ppt_idxs,2));
    ppt_start = [0;ppt_start;height(data)];
    ppt_n = length(ppt_start)-1;
    
    % add ppt column if we have multiple ppts
    if ppt_n > 1
        for i = 1:ppt_n
            data.ppt_ID((ppt_start(i)+1):ppt_start(i+1)) = i;
        end
        getColumns = ['ppt_ID',getColumns];
    end

    if nargin == 3
        splitColumn = [];
    end
            
    % preallocate memory for row indices
    row_idxs = zeros(height(data),length(getRows));
    
    % Isolate column getRows{1,i} and check for values that match getRows{2,i}
    for i = 1:length(getRows)
        checkrow_i = getRows{i};
        row_idxs(:,i) = contains(data.(checkrow_i{1}),checkrow_i{2});
    end
    
    % Remove non-matches
    validrows = find(sum(row_idxs,2));
    data = data(validrows,:);
    
    % then extract only the columns given in getColumns, and split into
    % multiple columns if the column is also given in splitColumn
    formatted_data = table;
    for i = 1:length(getColumns)
        
        % we do an iterative search for whether a column in getColumns is also in splitColumn
        multcols = false;
        for j = 1:length(splitColumn)
            if isequal(getColumns{i},splitColumn{j}{1})
                
                % if found, store the index
                multcols = true;
                ncol = j;
            end
            
        end
        
        if multcols
            
            % we then split column ncol into however many separate string values there are
            split_col = split(data.(splitColumn{ncol}{1}),splitColumn{ncol}{2});
            for k = 1:size(split_col,2)
                
                % new columns are simply given a numerical identifier from 1:k
                formatted_data.([getColumns{i},'_',num2str(k)]) = split_col(:,k);
            end
        else
            % if no splitting is required, the whole column is copied over
            formatted_data.(getColumns{i}) = data.(getColumns{i});
        end
    end

end