/* eslint-disable */
import log from 'loglevel';

import isDefined from 'd2-utilizr/lib/isDefined';
import isNumber from 'd2-utilizr/lib/isNumber';
import isObject from 'd2-utilizr/lib/isObject';
import isArray from 'd2-utilizr/lib/isArray';

import OptionSetHelper from '../OptionSetHelper/OptionSetHelper';

//.service('TrackerRulesExecutionService', function(NotificationService, DHIS2EventFactory, RulesFactory, CalendarService, $rootScope, $q, log, $filter, orderByFilter){

export default function getExecutionService(onTranslate, variableService, dateUtils) {
    var NUMBER_OF_EVENTS_IN_SCOPE = 10;

    //Variables for storing scope and rules in memory from rules execution to rules execution:
    var programRulesContainer = false; 
    var crossEventRulesExist = false;
    var lastEventId = null;
    var lastEventDate = null;
    var lastProgramId = null;
    var eventScopeExceptCurrent = false;

    var replaceVariables = function(expression, variablesHash){
        //replaces the variables in an expression with actual variable values.

        //Check if the expression contains program rule variables at all(any curly braces):
        if(expression.indexOf('{') !== -1) {
            //Find every variable name in the expression;
            var variablespresent = expression.match(/[A#CV]\{[\w -_.]+}/g);
            //Replace each matched variable:
            variablespresent.forEach(variablepresent => {
                //First strip away any prefix and postfix signs from the variable name:
                variablepresent = variablepresent.replace("#{","").replace("A{","").replace("C{","").replace("V{","").replace("}","");

                if(isDefined(variablesHash[variablepresent])) {
                    //Replace all occurrences of the variable name(hence using regex replacement):
                    expression = expression.replace(new RegExp( variablesHash[variablepresent].variablePrefix + "\\{" + variablepresent + "\\}", 'g'),
                        variablesHash[variablepresent].variableValue);
                }
                else {
                    log.warn("Expression " + expression + " contains variable " + variablepresent
                        + " - but this variable is not defined." );
                }
            });
        }

        //Check if the expression contains environment  variables
        if(expression.indexOf('V{') !== -1) {
            //Find every variable name in the expression;
            var variablespresent = expression.match(/V{\w+.?\w*}/g);
            //Replace each matched variable:
            variablespresent.forEach(variablepresent => {
                //First strip away any prefix and postfix signs from the variable name:
                variablepresent = variablepresent.replace("V{","").replace("}","");

                if(isDefined(variablesHash[variablepresent]) &&
                    variablesHash[variablepresent].variablePrefix === 'V') {
                    //Replace all occurrences of the variable name(hence using regex replacement):
                    expression = expression.replace(new RegExp("V{" + variablepresent + "}", 'g'),
                        variablesHash[variablepresent].variableValue);
                }
                else {
                    log.warn("Expression " + expression + " conains context variable " + variablepresent
                        + " - but this variable is not defined." );
                }
            });
        }

        //Check if the expression contains attribute variables:
        if(expression.indexOf('A{') !== -1) {
            //Find every attribute in the expression;
            var variablespresent = expression.match(/A{\w+.?\w*}/g);
            //Replace each matched variable:
            variablespresent.forEach(variablepresent => {
                //First strip away any prefix and postfix signs from the variable name:
                variablepresent = variablepresent.replace("A{","").replace("}","");

                if(isDefined(variablesHash[variablepresent]) &&
                    variablesHash[variablepresent].variablePrefix === 'A') {
                    //Replace all occurrences of the variable name(hence using regex replacement):
                    expression = expression.replace(new RegExp("A{" + variablepresent + "}", 'g'),
                        variablesHash[variablepresent].variableValue);
                }
                else {
                    log.warn("Expression " + expression + " conains attribute " + variablepresent
                        + " - but this attribute is not defined." );
                }
            });
        }

        //Check if the expression contains constants
        if(expression.indexOf('C{') !== -1) {
            //Find every constant in the expression;
            var variablespresent = expression.match(/C{\w+.?\w*}/g);
            //Replace each matched variable:
            variablespresent.forEach(variablepresent => {
                //First strip away any prefix and postfix signs from the variable name:
                variablepresent = variablepresent.replace("C{","").replace("}","");

                if(isDefined(variablesHash[variablepresent]) &&
                    variablesHash[variablepresent].variablePrefix === 'C') {
                    //Replace all occurrences of the variable name(hence using regex replacement):
                    expression = expression.replace(new RegExp("C{" + variablepresent + "}", 'g'),
                        variablesHash[variablepresent].variableValue);
                }
                else {
                    log.warn("Expression " + expression + " conains constant " + variablepresent
                        + " - but this constant is not defined." );
                }
            });
        }

        return expression;
    };

    var runDhisFunctions = function(expression, variablesHash, flag){
        //Called from "runExpression". Only proceed with this logic in case there seems to be dhis function calls: "d2:" is present.
        if(isDefined(expression) && expression.indexOf("d2:") !== -1){
            var dhisFunctions = [{name:"d2:daysBetween",parameters:2},
                {name:"d2:weeksBetween",parameters:2},
                {name:"d2:monthsBetween",parameters:2},
                {name:"d2:yearsBetween",parameters:2},
                {name:"d2:floor",parameters:1},
                {name:"d2:modulus",parameters:2},
                {name:"d2:concatenate"},
                {name:"d2:addDays",parameters:2},
                {name:"d2:zing",parameters:1},
                {name:"d2:oizp",parameters:1},
                {name:"d2:count",parameters:1},
                {name:"d2:countIfZeroPos",parameters:1},
                {name:"d2:countIfValue",parameters:2},
                {name:"d2:ceil",parameters:1},
                {name:"d2:round",parameters:1},
                {name:"d2:hasValue",parameters:1},
                {name:"d2:lastEventDate",parameters:1},
                {name:"d2:validatePattern",parameters:2},
                {name:"d2:addControlDigits",parameters:1},
                {name:"d2:checkControlDigits",parameters:1},
                {name:"d2:left",parameters:2},
                {name:"d2:right",parameters:2},
                {name:"d2:substring",parameters:3},
                {name:"d2:split",parameters:3},
                {name:"d2:length",parameters:1}];
            var continueLooping = true;
            //Safety harness on 10 loops, in case of unanticipated syntax causing unintencontinued looping
            for(var i = 0; i < 10 && continueLooping; i++ ) {
                var expressionUpdated = false;
                var brokenExecution = false;
                dhisFunctions.forEach(dhisFunction => {
                    //Select the function call, with any number of parameters inside single quotations, or number parameters witout quotations
                    var regularExFunctionCall = new RegExp(dhisFunction.name + "\\( *(([\\d/\\*\\+\\-%\.]+)|( *'[^']*'))*( *, *(([\\d/\\*\\+\\-%\.]+)|'[^']*'))* *\\)",'g');
                    var callsToThisFunction = expression.match(regularExFunctionCall);
                    callsToThisFunction.forEach(callToThisFunction => {
                        //Remove the function name and paranthesis:
                        var justparameters = callToThisFunction.replace(/(^[^\(]+\()|\)$/g,"");
                        //Remove white spaces before and after parameters:
                        justparameters = justparameters.trim();
                        //Then split into single parameters:
                        var parameters = justparameters.match(/(('[^']+')|([^,]+))/g);

                        //Show error if no parameters is given and the function requires parameters,
                        //or if the number of parameters is wrong.
                        if(isDefined(dhisFunction.parameters)){
                            //But we are only checking parameters where the dhisFunction actually has a defined set of parameters(concatenate, for example, does not have a fixed number);
                            var numParameters = parameters ? parameters.length : 0;
                            
                            if(numParameters !== dhisFunction.parameters){
                                log.warn(dhisFunction.name + " was called with the incorrect number of parameters");
                                
                                //Mark this function call as broken:
                                brokenExecution = true;
                            }
                        }

                        //In case the function call is nested, the parameter itself contains an expression, run the expression.
                        if(!brokenExecution && isDefined(parameters) && parameters !== null) {
                            for (var i = 0; i < parameters.length; i++) {
                                parameters[i] = runExpression(parameters[i],dhisFunction.name,"parameter:" + i, flag, variablesHash);
                            }
                        }

                        //Special block for d2:weeksBetween(*,*) - add such a block for all other dhis functions.
                        if(brokenExecution) {
                            //Function call is not possible to evaluate, remove the call:
                            expression = expression.replace(callToThisFunction, "false");
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:daysBetween") {
                            const daysBetween = dateUtils.daysBetween(parameters[0], parameters[1]);
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, daysBetween);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:weeksBetween") {
                            const weeksBetween = dateUtils.weeksBetween(parameters[0], parameters[1]);                          
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, weeksBetween);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:monthsBetween") {
                            const monthsBetween = dateUtils.monthsBetween(parameters[0], parameters[1]);
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, monthsBetween);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:yearsBetween") {
                            const yearsBetween = dateUtils.yearsBetween(parameters[0], parameters[1]);                          
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, yearsBetween);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:floor") {
                            var floored = Math.floor(parameters[0]);
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, floored);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:modulus") {
                            var dividend = Number(parameters[0]);
                            var divisor = Number(parameters[1]);
                            var rest = dividend % divisor;
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, rest);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:concatenate") {
                            var returnString = "'";
                            for (var i = 0; i < parameters.length; i++) {
                                returnString += parameters[i];
                            }
                            returnString += "'";
                            expression = expression.replace(callToThisFunction, returnString);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:addDays") {
                            const newDate = dateUtils.addDays(date, daysToAdd);
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, newDate);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:zing") {
                            var number = parameters[0];
                            if( number < 0 ) {
                                number = 0;
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, number);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:oizp") {
                            var number = parameters[0];
                            var output = 1;
                            if( number < 0 ) {
                                output = 0;
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, output);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:count") {
                            var variableName = parameters[0];
                            var variableObject = variablesHash[variableName];
                            var count = 0;
                            if(variableObject)
                            {
                                if(variableObject.hasValue){
                                    if(variableObject.allValues)
                                    {
                                        count = variableObject.allValues.length;
                                    } else {
                                        //If there is a value found for the variable, the count is 1 even if there is no list of alternate values
                                        //This happens for variables of "DATAELEMENT_CURRENT_STAGE" and "TEI_ATTRIBUTE"
                                        count = 1;
                                    }
                                }
                            }
                            else
                            {
                                log.warn("could not find variable to count: " + variableName);
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, count);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:countIfZeroPos") {
                            var variableName = $filter('trimvariablequalifiers') (parameters[0]);
                            var variableObject = variablesHash[variableName];

                            var count = 0;
                            if(variableObject)
                            {
                                if( variableObject.hasValue ) {
                                    if(variableObject.allValues && variableObject.allValues.length > 0)
                                    {
                                        for(var i = 0; i < variableObject.allValues.length; i++)
                                        {
                                            if(variableObject.allValues[i] >= 0) {
                                                count++;
                                            }
                                        }
                                    }
                                    else {
                                        //The variable has a value, but no list of alternates. This means we only compare the elements real value
                                        if(variableObject.variableValue >= 0) {
                                            count = 1;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                log.warn("could not find variable to countifzeropos: " + variableName);
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, count);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:countIfValue") {
                            var variableName = parameters[0];
                            var variableObject = variablesHash[variableName];

                            var valueToCompare = variableService.processValue(parameters[1],variableObject.variableType);

                            var count = 0;
                            if(variableObject)
                            {
                                if( variableObject.hasValue )
                                {
                                    if( variableObject.allValues )
                                    {
                                        for(var i = 0; i < variableObject.allValues.length; i++)
                                        {
                                            if(valueToCompare === variableObject.allValues[i]) {
                                                count++;
                                            }
                                        }
                                    } else {
                                        //The variable has a value, but no list of alternates. This means we compare the standard variablevalue
                                        if(valueToCompare === variableObject.variableValue) {
                                            count = 1;
                                        }
                                    }

                                }
                            }
                            else
                            {
                                log.warn("could not find variable to countifvalue: " + variableName);
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, count);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:ceil") {
                            var ceiled = Math.ceil(parameters[0]);
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, ceiled);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:round") {
                            var rounded = Math.round(parameters[0]);
                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, rounded);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:hasValue") {
                            var variableName = parameters[0];
                            var variableObject = variablesHash[variableName];
                            var valueFound = false;
                            if(variableObject)
                            {
                                if(variableObject.hasValue){
                                    valueFound = true;
                                }
                            }
                            else
                            {
                                log.warn("could not find variable to check if has value: " + variableName);
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, valueFound);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:lastEventDate") {
                            var variableName = parameters[0];
                            var variableObject = variablesHash[variableName];
                            var valueFound = "''";
                            if(variableObject)
                            {
                                if(variableObject.variableEventDate){
                                    valueFound = variableService.processValue(variableObject.variableEventDate, 'DATE');
                                }
                                else {
                                    log.warn("no last event date found for variable: " + variableName);
                                }
                            }
                            else
                            {
                                log.warn("could not find variable to check last event date: " + variableName);
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, valueFound);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:validatePattern") {
                            var inputToValidate = parameters[0].toString();
                            var pattern = parameters[1];
                            var regEx = new RegExp(pattern,'g');
                            var match = inputToValidate.match(regEx);
                            
                            var matchFound = false;
                            if(match !== null && inputToValidate === match[0]) {
                                matchFound = true;
                            }

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, matchFound);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:addControlDigits") {

                            var baseNumber = parameters[0];
                            var baseDigits = baseNumber.split('');
                            var error = false;

                            var firstDigit = 0;
                            var secondDigit = 0;

                            if(baseDigits && baseDigits.length < 10 ) {
                                var firstSum = 0;
                                var baseNumberLength = baseDigits.length;
                                //weights support up to 9 base digits:
                                var firstWeights = [3,7,6,1,8,9,4,5,2];
                                for(var i = 0; i < baseNumberLength && !error; i++) {
                                    firstSum += parseInt(baseDigits[i]) * firstWeights[i];
                                }
                                firstDigit = firstSum % 11;

                                //Push the first digit to the array before continuing, as the second digit is a result of the
                                //base digits and the first control digit.
                                baseDigits.push(firstDigit);
                                //Weights support up to 9 base digits plus first control digit:
                                var secondWeights = [5,4,3,2,7,6,5,4,3,2];
                                var secondSum = 0;
                                for(var i = 0; i < baseNumberLength + 1 && !error; i++) {
                                    secondSum += parseInt(baseDigits[i]) * secondWeights[i];
                                }
                                secondDigit = secondSum % 11;

                                if(firstDigit === 10) {
                                    log.warn("First control digit became 10, replacing with 0");
                                    firstDigit = 0;
                                }
                                if(secondDigit === 10) {
                                    log.warn("Second control digit became 10, replacing with 0");
                                    secondDigit = 0;
                                }
                            }
                            else
                            {
                                log.warn("Base nuber not well formed(" + baseNumberLength + " digits): " + baseNumber);
                            }

                            if(!error) {
                                //Replace the end evaluation of the dhis function:
                                expression = expression.replace(callToThisFunction, baseNumber + firstDigit + secondDigit);
                                expressionUpdated = true;
                            }
                            else
                            {
                                //Replace the end evaluation of the dhis function:
                                expression = expression.replace(callToThisFunction, baseNumber);
                                expressionUpdated = true;
                            }
                        }
                        else if(dhisFunction.name === "d2:checkControlDigits") {
                            log.warn("checkControlDigits not implemented yet");

                            //Replace the end evaluation of the dhis function:
                            expression = expression.replace(callToThisFunction, parameters[0]);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:left") {
                            var string = String(parameters[0]);
                            var numChars = string.length < parameters[1] ? string.length : parameters[1];
                            var returnString =  string.substring(0,numChars);
                            returnString = variableService.processValue(returnString, 'TEXT');
                            expression = expression.replace(callToThisFunction, returnString);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:right") {
                            var string = String(parameters[0]);
                            var numChars = string.length < parameters[1] ? string.length : parameters[1];
                            var returnString =  string.substring(string.length - numChars, string.length);
                            returnString = variableService.processValue(returnString, 'TEXT');
                            expression = expression.replace(callToThisFunction, returnString);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:substring") {
                            var string = String(parameters[0]);
                            var startChar = string.length < parameters[1] - 1 ? -1 : parameters[1];
                            var endChar = string.length < parameters[2] ? -1 : parameters[2];
                            if(startChar < 0 || endChar < 0) {
                                expression = expression.replace(callToThisFunction, "''");
                                expressionUpdated = true;
                            } else {
                                var returnString =  string.substring(startChar, endChar);
                                returnString = variableService.processValue(returnString, 'TEXT');
                                expression = expression.replace(callToThisFunction, returnString);
                                expressionUpdated = true;
                            }
                        }
                        else if(dhisFunction.name === "d2:split") {
                            var string = String(parameters[0]);
                            var splitArray = string.split(parameters[1]);
                            var returnPart = "";
                            if (splitArray.length >= parameters[2]) {
                                returnPart = splitArray[parameters[2]];
                            }
                            returnPart = variableService.processValue(returnPart, 'TEXT');
                            expression = expression.replace(callToThisFunction, returnPart);
                            expressionUpdated = true;
                        }
                        else if(dhisFunction.name === "d2:length") {
                            expression = expression.replace(callToThisFunction, String(parameters[0]).length);
                            expressionUpdated = true;
                        }
                    });
                });

                //We only want to continue looping until we made a successful replacement,
                //and there is still occurrences of "d2:" in the code. In cases where d2: occur outside
                //the expected d2: function calls, one unneccesary iteration will be done and the
                //successfulExecution will be false coming back here, ending the loop. The last iteration
                //should be zero to marginal performancewise.
                if(expressionUpdated && expression.indexOf("d2:") !== -1) {
                    continueLooping = true;
                } else {
                    continueLooping = false;
                }
            }
        }

        return expression;
    };

    var runExpression = function(expression, beforereplacement, identifier, flag, variablesHash ){
        //determine if expression is true, and actions should be effectuated
        //If DEBUG mode, use try catch and report errors. If not, omit the heavy try-catch loop.:
        var answer = false;
        if(flag && flag.debug) {
            try{

                var dhisfunctionsevaluated = runDhisFunctions(expression, variablesHash, flag);
                answer = eval(dhisfunctionsevaluated);

                if(flag.verbose)
                {
                    log.info("Expression with id " + identifier + " was successfully run. Original condition was: " + beforereplacement + " - Evaluation ended up as:" + expression + " - Result of evaluation was:" + answer);
                }
            }
            catch(e)
            {
                log.warn("Expression with id " + identifier + " could not be run. Original condition was: " + beforereplacement + " - Evaluation ended up as:" + expression + " - error message:" + e);
            }
        }
        else {
            //Just run the expression. This is much faster than the debug route: http://jsperf.com/try-catch-block-loop-performance-comparison
            var dhisfunctionsevaluated = runDhisFunctions(expression, variablesHash, flag);
            answer = eval(dhisfunctionsevaluated);
        }
        return answer;
    };

    var determineValueType = function(value) {
        var valueType = 'TEXT';
        if(value === 'true' || value === 'false') {
            valueType = 'BOOLEAN';
        }
        else if(isNumber(value) || !isNaN(value)) {
            if(value % 1 !== 0) {
                valueType = 'NUMBER';
            }
            else {
                valueType = 'INTEGER';
            }
        }
        return valueType;
    };

    /*
    var performCreateEventAction = function(effect, selectedEntity, selectedEnrollment, currentEvents,executingEvent, programStage){
        var valArray = [];
        if(effect.data) {
            valArray = effect.data.split(',');
            var newEventDataValues = [];
            var idList = {active:false};

            valArray.forEach(value => {
                var valParts = value.split(':');                
                if(valParts && valParts.length >= 1) {
                    var valId = valParts[0];

                    //Check wether one or more fields is marked as the id to use for comparison purposes:
                    if(valId.trim().substring(0, 4) === "[id]") {
                        valId = valId.substring(4,valId.length);
                        idList[valId] = true;
                        idList.active = true;
                    }

                    var valVal = "";
                    if(valParts.length > 1) {
                        valVal = valParts[1];
                    }
                    var valueType = determineValueType(valVal);

                    var processedValue = variableService.processValue(valVal, valueType);
                    processedValue = $filter('trimquotes')(processedValue);
                    newEventDataValues.push({dataElement:valId,value:processedValue});
                    newEventDataValues[valId] = processedValue;
                }
            });

            var valuesAlreadyExists = false;
            currentEvents.forEach(currentEvent => {
                var misMatch = false;
                newEventDataValues.forEach(value => {
                    var valueFound = false;
                    currentEvent.dataValues.forEach(currentDataValue => {
                        //Only count as mismatch if there is no particular ID to use, or the current field is part of the same ID
                        if(!idList.active || idList[currentDataValue.dataElement]){
                            if(currentDataValue.dataElement === value.dataElement) {
                                valueFound = true;
                                //Truthy comparison is needed to avoid false negatives for differing variable types:
                                if( currentDataValue.value != newEventDataValues[value.dataElement] ) {
                                    misMatch = true;
                                }
                            }
                        }
                    });
                    //Also treat no value found as a mismatch, but when ID fields is set, only concider ID fields
                    if((!idList.active || idList[value.dataElement] ) && !valueFound) {
                        misMatch = true;
                    }
                });
                if(!misMatch) {
                    //if no mismatches on this point, the exact same event already exists, and we dont create it.
                    valuesAlreadyExists = true;
                }
            });

            if(!valuesAlreadyExists) {
                var eventDate = dateUtils.getToday();
                var dueDate = dateUtils.getToday();

                var newEvent = {
                    trackedEntityInstance: selectedEnrollment.trackedEntityInstance,
                    program: selectedEnrollment.program,
                    programStage: effect.programStage.id,
                    enrollment: selectedEnrollment.enrollment,
                    orgUnit: selectedEnrollment.orgUnit,
                    dueDate: dueDate,
                    eventDate: eventDate,
                    notes: [],
                    dataValues: newEventDataValues,
                    status: 'ACTIVE',
                    event: dhis2.util.uid()
                };

                if(programStage && programStage.dontPersistOnCreate){
                    newEvent.notPersisted = true;
                    newEvent.executingEvent = executingEvent;
                    $rootScope.$broadcast("eventcreated", { event:newEvent });
                }
                else{
                    DHIS2EventFactory.create(newEvent).then(function(result){
                       $rootScope.$broadcast("eventcreated", { event:newEvent });
                    }); 
                }
                //1 event created
                return 1;
            }
            else
            {
                //no events created
                return 0;
            }
        } else {
            log.warn("Cannot create event with empty content.");
        }
    };
    */

    const getApplicableProgramRules = function(programRules, executingEvent) {
        const executingEventProgramStageId = executingEvent.programStageId;
        const mainRules = programRules.filter(rule => !rule.programStageId);
        const programStageRules = programRules.filter(rule => rule.programStageId === executingEventProgramStageId);
        return [...mainRules, ...programStageRules];
    }

    // lowest number first(priority null is last)
    const orderRulesByPriority = function(programRules) {
        const orderedRules = programRules.sort((a, b) => {
            if (!a.priority && !b.priority) {
                return 0;
            }

            if (!a.priority) {
                return 1;
            }

            if (!b.priority) {
                return -1;
            }

            return a.priority - b.priority;
        });
        return orderedRules;
    }

    const getRuleEffectData = function(action, variablesHash, flag) {
        const actionData = action.data;
        let ruleEffectData = actionData; 

        var nameWithoutBrackets = actionData.replace('#{','').replace('}','');
        if (variablesHash[nameWithoutBrackets])
        {
            // The variable exists, and is replaced with its corresponding value
            ruleEffectData = variablesHash[nameWithoutBrackets].variableValue;
        } else if(actionData.indexOf('{') !== -1 || actionData.indexOf('d2:') !== -1) {
            //Since the value couldnt be looked up directly, and contains a curly brace or a dhis function call,
            //the expression was more complex than replacing a single variable value.
            //Now we will have to make a thorough replacement and separate evaluation to find the correct value:
            ruleEffectData = replaceVariables(actionData, variablesHash);
            //In a scenario where the data contains a complex expression, evaluate the expression to compile(calculate) the result:
            ruleEffectData = runExpression(ruleEffectData, actionData, "action:" + action.id, flag, variablesHash);
        }
        return ruleEffectData;
    }

    const buildRuleEffect = function(action, variablesHash, flag) {
        const effect = {
            id: action.id,
            location: action.location,
            action:action.programRuleActionType,
            dataElementId: action.dataElementId,
            trackedEntityAttributeId: action.trackedEntityAttribute,
            programStageId: action.programStageId,
            programStageSectionId: action.programStageSectionId,
            content: action.content,
            data: action.data ? getRuleEffectData(action, variablesHash, flag) : action.data,
            ineffect: true,
        };
        
        if (effect.action === "ASSIGN") {
            //from earlier evaluation, the data portion of the ruleeffect now contains the value of the variable to be assigned.
            //the content portion of the ruleeffect defines the name for the variable, when the qualidisers are removed:
            var variableToAssign = effect.content ?
                effect.content.replace("#{","").replace("A{","").replace("}","") : null;

            if (variableToAssign && !isDefined(variablesHash[variableToAssign])) {
                //If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
                log.warn("Variable " + variableToAssign + " was not defined.");
            }

            if (variablesHash[variableToAssign]){
                var updatedValue = effect.data;

                var valueType = determineValueType(updatedValue);

                if($rootScope.ruleeffects[ruleEffectKey][action.id].dataElement) {
                    updatedValue = variableService.getDataElementValueOrCodeForValue(variablesHash[variabletoassign].useCodeForOptionSet, updatedValue, $rootScope.ruleeffects[ruleEffectKey][action.id].dataElement.id, allDataElements, optionSets);
                }
                updatedValue = variableService.processValue(updatedValue, valueType);

                variablesHash[variabletoassign] = {
                    variableValue:updatedValue,
                    variableType:valueType,
                    hasValue:true,
                    variableEventDate:'',
                    variablePrefix:variablesHash[variabletoassign].variablePrefix ? variablesHash[variabletoassign].variablePrefix : '#',
                    allValues:[updatedValue]
                };
            }
        }
        return effect;              
    }
    /**
     * 
     * @param {*} programRulesContainer all program rules for the program
     * @param {*} executingEvent the event context for the program
     * @param {*} evs all events in the enrollment
     * @param {*} allDataElements all data elements(metadata)
     * @param {*} allTrackedEntityAttributes all tracked entity attributes(metadata)
     * @param {*} selectedEntity the selected tracked entity instance
     * @param {*} selectedEnrollment the selected enrollment
     * @param {*} optionSets all optionsets(matedata)
     * @param {*} flag execution flags
     */
    var internalExecuteRules = function(programRulesContainer, executingEvent, evs, allDataElements, allTrackedEntityAttributes, selectedEntity, selectedEnrollment, selectedOrgUnit, optionSets, flag) {
        let rules = getApplicableProgramRules(programRulesContainer.programRules, executingEvent);
        if(rules.length === 0) {
            return null;
        }
        rules = orderRulesByPriority(rules);        
        const variablesHash = variableService.getVariables(programRulesContainer, executingEvent, evs, allDataElements, allTrackedEntityAttributes, selectedEntity, selectedEnrollment, selectedOrgUnit, optionSets);
        const ruleEffectKey = executingEvent.eventId;
        let updatedEffectsExits = false;
        let eventsCreated = 0;

        const effects = rules
            .map(rule => {
                let ruleEffects;

                let ruleEffective = false;
                let expression = rule.condition;
                if(expression) {
                    if(expression.indexOf('{') !== -1) {
                        expression = replaceVariables(expression, variablesHash);
                    }
                    //run expression:
                    ruleEffective = runExpression(expression, rule.condition, "rule:" + rule.id, flag, variablesHash);
                } else {
                    log.warn("Rule id:'" + rule.id + "'' and name:'" + rule.name + "' had no condition specified. Please check rule configuration.");
                }

                if (ruleEffective) {
                    ruleEffects = rule.programRuleActions.map(action => buildRuleEffect(action, variablesHash, flag))
                }
                return ruleEffects;
            })
            .filter(ruleEffectsForRule => ruleEffectsForRule)
            .reduce((accRuleEffects, effectsForRule) => {
                return [...accRuleEffects, ...effectsForRule];
            }, []);

            //In case the rule is of type CREATEEVENT, run event creation:
            /*
            if($rootScope.ruleeffects[ruleEffectKey][action.id].action === "CREATEEVENT" && $rootScope.ruleeffects[ruleEffectKey][action.id].ineffect){
                if(evs && evs.byStage){
                    if($rootScope.ruleeffects[ruleEffectKey][action.id].programStage) {
                        var createdNow = performCreateEventAction($rootScope.ruleeffects[ruleEffectKey][action.id], selectedEntity, selectedEnrollment, evs.byStage[$rootScope.ruleeffects[ruleEffectKey][action.id].programStage.id]);
                        eventsCreated += createdNow;
                    } else {
                        log.warn("No programstage defined for CREATEEVENT action: " + action.id);
                    }
                } else {
                    log.warn("Events to evaluate for CREATEEVENT action: " + action.id + ". Could it have been triggered at the wrong time or during registration?");
                }
            }
            */
        return effects;
    };

    /*
    var internalProcessEventGrid = function( eventGrid ){
    	var events = [];
    	if( eventGrid && eventGrid.rows && eventGrid.headers ){    		
    		eventGrid.rows.forEach(row => {
    			var ev = {};
    			var i = 0;
        		eventGrid.headers.forEach(h => {
        			ev[h] = row[i];
        			i++;
        		});                            
            });
    	}
    	return events;
    };

    var internalGetOrLoadScope = function(currentEvent,programStageId,orgUnitId) {        
        if(crossEventRulesExist) {
            //If crossEventRulesExist, we need to get a scope that contains more than the current event.
            if(lastEventId !== currentEvent.event 
                    || lastEventDate !== currentEvent.eventDate 
                    || !eventScopeExceptCurrent) {
                //The scope might need updates, as the parameters of the event has changed

                lastEventId = currentEvent.event;
                lastEventDate = currentEvent.eventDate;

                
                var pager = {pageSize: NUMBER_OF_EVENTS_IN_SCOPE};                
                var ordering = {id:"eventDate",direction:"desc"};
                
                return DHIS2EventFactory.getByStage(orgUnitId, programStageId, null, pager, true, null, null, ordering).then(function(events) {                	
                	var allEventsWithPossibleDuplicates = internalProcessEventGrid( events );                	
                    var filterUrl = '&dueDateStart=' + dateUtils.formatFromUserToApi(lastEventDate) + '&dueDateEnd=' + dateUtils.formatFromUserToApi(lastEventDate); 
                    return DHIS2EventFactory.getByStage(orgUnitId, programStageId, null, pager, true, null, filterUrl, ordering).then(function(events) {
                    	allEventsWithPossibleDuplicates = allEventsWithPossibleDuplicates.concat( internalProcessEventGrid( events ) );
                        eventScopeExceptCurrent = [];
                        var eventIdDictionary = {};
                        allEventsWithPossibleDuplicates.forEach(eventInScope => {
                            if(currentEvent.event !== eventInScope.event 
                                    && !eventIdDictionary[eventInScope.event]) {
                                //Add event and update dictionary to avoid duplicates:                                
                                eventIdDictionary[eventInScope.event] = true;
                            }
                        });

                        //make a sorted list of all events to pass to rules execution service:
                        var allEventsInScope = eventScopeExceptCurrent.concat([currentEvent]);
                        allEventsInScope = orderByFilter(allEventsInScope, '-eventDate').reverse();
                        var byStage = {};
                        byStage[currentEvent.programStage] = allEventsInScope;
                        return {all: allEventsInScope, byStage:byStage};
                    });
                });   
            }
            else
            {
                //make a sorted list of all events to pass to rules execution service:
                var allEvents = eventScopeExceptCurrent.concat([currentEvent]);
                allEvents = orderByFilter(allEvents, '-eventDate').reverse();
                var byStage = {};
                byStage[currentEvent.programStage] = allEvents;
                return $q.when({all: allEvents, byStage:byStage});
            }
        }
        else
        {
            //return a scope containing only the current event
            var byStage = {};
            byStage[currentEvent.programStage] = [currentEvent];
            return $q.when({all: [currentEvent], byStage:byStage});
        }
    };
    var internalGetOrLoadRules = function(programId) {
        //If no rules is stored in memory, or this service is being called in the context of a different program, get the rules again:
        if(allProgramRules === false || lastProgramId !== programId)
        {
            return RulesFactory.loadRules(programId).then(function(rules){                    
                allProgramRules = rules;
                lastProgramId = programId;

                //Check if any of the rules is using any source type thar requires a bigger event scope
                crossEventRulesExist = false;
                if(rules.programVariables && rules.programVariables.length) {
                    for(var i = 0; i < rules.programVariables.length; i ++) {
                        if( rules.programVariables[i].programRuleVariableSourceType ===
                                "DATAELEMENT_NEWEST_EVENT_PROGRAM" ||
                            rules.programVariables[i].programRuleVariableSourceType ===
                                "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" ||
                            rules.programVariables[i].programRuleVariableSourceType ===
                                "DATAELEMENT_PREVIOUS_EVENT")
                        {
                            crossEventRulesExist = true;
                        }
                    }
                }

                return rules;
            });  
        }
        else
        {
            return $q.when(allProgramRules);
        }
    };
    */
    return {
        executeRules: function(programRulesContainer, executingEvent, evs, allDataElements, allTrackedEntityAttributes, selectedEntity, selectedEnrollment, selectedOrgUnit, optionSets, flags) {
            if (!programRulesContainer.programRules) {
                return null;
            }
            return internalExecuteRules(programRulesContainer, executingEvent, evs, allDataElements, allTrackedEntityAttributes, selectedEntity, selectedEnrollment, selectedOrgUnit, optionSets, flags);
        },
        /*
        loadAndExecuteRulesScope: function(currentEvent, programId, programStageId, programStageDataElements, allTrackedEntityAttributes, optionSets, orgUnitId, flags){
            return internalGetOrLoadRules(programId).then(function(rules) {
                return internalGetOrLoadScope(currentEvent,programStageId,orgUnitId).then(function(scope) {
                    return internalExecuteRules(rules, currentEvent, scope, programStageDataElements, allTrackedEntityAttributes, null, null, optionSets, flags);
                });
            });
        },
        */
        processRuleEffectsForTrackedEntityAttributes: function(context, currentTei, teiOriginalValues, attributesById, optionSets ) {
            var hiddenFields = {};
            var assignedFields = {};
            var hiddenSections = {};
            var mandatoryFields = {};
            var warningMessages = [];
            
            $rootScope.ruleeffects[context].forEach(effect => {
                if (effect.ineffect) {
                    if (effect.action === "HIDEFIELD" && effect.trackedEntityAttribute) {
                        if (currentTei[effect.trackedEntityAttribute.id]) {
                            //If a field is going to be hidden, but contains a value, we need to take action;
                            if (effect.content) {
                                //TODO: Alerts is going to be replaced with a proper display mecanism.
                                alert(effect.content);
                            }
                            else {
                                //TODO: Alerts is going to be replaced with a proper display mecanism.
                                alert(attributesById[effect.trackedEntityAttribute.id].displayName + " - was blanked out and hidden by your last action");
                            }

                            //Blank out the value:
                            currentTei[effect.trackedEntityAttribute.id] = "";
                        }

                        hiddenFields[effect.trackedEntityAttribute.id] = true;
                    } else if (effect.action === "SHOWERROR" && effect.trackedEntityAttribute) {
                        if(effect.ineffect) {
                            var headerText =  onTranslate('validation_error');
                            var bodyText = effect.content + (effect.data ? effect.data : "");

                            NotificationService.showNotifcationDialog(headerText, bodyText);
                            if( effect.trackedEntityAttribute ) {
                                currentTei[effect.trackedEntityAttribute.id] = teiOriginalValues[effect.trackedEntityAttribute.id];
                            }
                        }
                    } else if (effect.action === "SHOWWARNING" && effect.trackedEntityAttribute) {
                        if(effect.ineffect) {
                            var message = effect.content + (isDefined(effect.data) ? effect.data : "");
                            
                            if( effect.trackedEntityAttribute ) {
                                warningMessages[effect.trackedEntityAttribute.id] = message;
                            }
                            else
                            {
                                warningMessages.push(message);
                            }
                        }
                    }
                    else if (effect.action === "ASSIGN" && effect.trackedEntityAttribute) {
                        var processedValue = $filter('trimquotes')(effect.data);

                        if(attributesById[effect.trackedEntityAttribute.id]
                                && attributesById[effect.trackedEntityAttribute.id].optionSet) {
                            processedValue = OptionSetHelper.getName(
                                    optionSets[attributesById[effect.trackedEntityAttribute.id].optionSet.id].options, processedValue)
                        }

                        processedValue = processedValue === "true" ? true : processedValue;
                        processedValue = processedValue === "false" ? false : processedValue;

                        //For "ASSIGN" actions where we have a dataelement, we save the calculated value to the dataelement:
                        currentTei[effect.trackedEntityAttribute.id] = processedValue;
                        assignedFields[effect.trackedEntityAttribute.id] = true;
                    }else if(effect.action === "SETMANDATORYFIELD" && effect.trackedEntityAttribute){
                        mandatoryFields[effect.trackedEntityAttribute.id] = effect.ineffect;
                    }
                }
            });
            return {currentTei: currentTei, hiddenFields: hiddenFields, hiddenSections: hiddenSections, warningMessages: warningMessages, assignedFields: assignedFields, mandatoryFields: mandatoryFields};
        },
        processRuleEffectsForEvent: function(eventId, currentEvent, currentEventOriginalValues, prStDes, optionSets ) {
            var hiddenFields = {};
            var assignedFields = {};
            var mandatoryFields = {};
            var hiddenSections = {};
            var warningMessages = [];
            
            $rootScope.ruleeffects[eventId].forEach(effect => {
                if (effect.ineffect) {
                    if (effect.action === "HIDEFIELD" && effect.dataElement) {
                        if(currentEvent[effect.dataElement.id]) {
                            //If a field is going to be hidden, but contains a value, we need to take action;
                            if(effect.content) {
                                //TODO: Alerts is going to be replaced with a proper display mecanism.
                                alert(effect.content);
                            }
                            else {
                                //TODO: Alerts is going to be replaced with a proper display mecanism.
                                alert(prStDes[effect.dataElement.id].dataElement.displayFormName + " - was blanked out and hidden by your last action");
                            }

                        }
                        currentEvent[effect.dataElement.id] = "";
                        hiddenFields[effect.dataElement.id] = true;
                    }
                    else if(effect.action === "HIDESECTION") {
                        if(effect.programStageSection){
                            hiddenSections[effect.programStageSection] = effect.programStageSection;
                        }
                    }
                    else if(effect.action === "SHOWERROR" && effect.dataElement.id){
                        var headerTxt =  onTranslate('validation_error');
                        var bodyTxt = effect.content + (effect.data ? effect.data : "");
                        NotificationService.showNotifcationDialog(headerTxt, bodyTxt);

                        currentEvent[effect.dataElement.id] = currentEventOriginalValues[effect.dataElement.id];
                    }
                    else if(effect.action === "SHOWWARNING"){
                        warningMessages.push(effect.content + (effect.data ? effect.data : ""));
                    }
                    else if (effect.action === "ASSIGN" && effect.dataElement) {
                        var processedValue = $filter('trimquotes')(effect.data);

                        if(prStDes[effect.dataElement.id] 
                                && prStDes[effect.dataElement.id].dataElement.optionSet) {
                            processedValue = OptionSetHelper.getName(
                                    optionSets[prStDes[effect.dataElement.id].dataElement.optionSet.id].options, processedValue)
                        }

                        processedValue = processedValue === "true" ? true : processedValue;
                        processedValue = processedValue === "false" ? false : processedValue;

                        currentEvent[effect.dataElement.id] = processedValue;
                        assignedFields[effect.dataElement.id] = true;
                    }
                    else if (effect.action === "SETMANDATORYFIELD" && effect.dataElement) {
                        mandatoryFields[effect.dataElement.id] = effect.ineffect;
                    }
                }
            });
        
            return {currentEvent: currentEvent, hiddenFields: hiddenFields, hiddenSections: hiddenSections, warningMessages: warningMessages, assignedFields: assignedFields, mandatoryFields: mandatoryFields};
        },
        processRuleEffectAttribute: function(context, selectedTei, tei, currentEvent, currentEventOriginialValue, affectedEvent, attributesById, prStDes, hiddenFields, hiddenSections, warningMessages, assignedFields, optionSets, mandatoryFields){
            //Function used from registration controller to process effects for the tracked entity instance and for the events in the same operation
            var teiAttributesEffects = this.processRuleEffectsForTrackedEntityAttributes(context, selectedTei, tei, attributesById, optionSets );
            teiAttributesEffects.selectedTei = teiAttributesEffects.currentTei;
            
            if(context === "SINGLE_EVENT" && currentEvent && prStDes ) {
                var eventEffects = this.processRuleEffectsForEvent("SINGLE_EVENT", currentEvent, currentEventOriginialValue, prStDes, optionSets);
                teiAttributesEffects.warningMessages =  { ...teiAttributesEffects.warningMessages, ...eventEffects.warningMessages };
                teiAttributesEffects.hiddenFields[context] = eventEffects.hiddenFields;
                teiAttributesEffects.hiddenSections[context] = eventEffects.hiddenSections;
                teiAttributesEffects.assignedFields[context] = eventEffects.assignedFields;
                teiAttributesEffects.mandatoryFields[context] = eventEffects.mandatoryFields;
                teiAttributesEffects.currentEvent = eventEffects.currentEvent;
            }
            
            return teiAttributesEffects;
        }
    };
}