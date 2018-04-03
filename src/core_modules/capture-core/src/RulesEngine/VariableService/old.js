.service('VariableService', function(DateUtils,OptionSetService,OrgUnitFactory,$filter,$log,$q){
    var processSingleValue = function(processedValue,valueType){
        //First clean away single or double quotation marks at the start and end of the variable name.
        processedValue = $filter('trimquotes')(processedValue);

        //Append single quotation marks in case the variable is of text or date type:
        if(valueType === 'LONG_TEXT' || valueType === 'TEXT' || valueType === 'DATE' || valueType === 'OPTION_SET' ||
            valueType === 'URL' || valueType === 'DATETIME' || valueType === 'TIME' || valueType === 'PHONE_NUMBER' || 
            valueType === 'ORGANISATION_UNIT' || valueType === 'USERNAME') {
            if(processedValue) {
                processedValue = "'" + processedValue + "'";
            } else {
                processedValue = "''";
            }
        }
        else if(valueType === 'BOOLEAN' || valueType === 'TRUE_ONLY') {
            if(processedValue === "Yes") {
            processedValue = true;
            }
            else if(processedValue === "No") {
                processedValue = false;
            }
            else if(processedValue && eval(processedValue)) {
                processedValue = true;
            }
            else {
                processedValue = false;
            }
        }
        else if( valueType === "INTEGER" || valueType === "NUMBER" || valueType === "INTEGER_POSITIVE"
             ||  valueType === "INTEGER_NEGATIVE" || valueType === "INTEGER_ZERO_OR_POSITIVE" ||
                 valueType === "PERCENTAGE") {
            if(processedValue) {
                processedValue = Number(processedValue);
            } else {
                processedValue = 0;
            }
        }
        else{
            $log.warn("unknown datatype:" + valueType);
        }

        return processedValue;
    };

    var pushVariable = function(variables, variablename, varValue, allValues, varType, variablefound, variablePrefix, variableEventDate, useCodeForOptionSet) {

        var processedValues = [];

        angular.forEach(allValues, function(alternateValue) {
            processedValues.push(processSingleValue(alternateValue,varType));
        });

        variables[variablename] = {
            variableValue:processSingleValue(varValue, varType),
            useCodeForOptionSet:useCodeForOptionSet,
            variableType:varType,
            hasValue:variablefound,
            variableEventDate:variableEventDate,
            variablePrefix:variablePrefix,
            allValues:processedValues
        };
        return variables;
    };
    
    var getDataElementValueOrCodeForValueInternal = function(useCodeForOptionSet, value, dataElementId, allDes, optionSets) {
        return useCodeForOptionSet && allDes && allDes[dataElementId].dataElement.optionSet ? 
                                            OptionSetService.getCode(optionSets[allDes[dataElementId].dataElement.optionSet.id].options, value)
                                            : value;
    };
    
    var geTrackedEntityAttributeValueOrCodeForValueInternal = function(useCodeForOptionSet, value, trackedEntityAttributeId, allTeis, optionSets) {
        return useCodeForOptionSet && allTeis && allTeis[trackedEntityAttributeId].optionSet ? 
                                            OptionSetService.getCode(optionSets[allTeis[trackedEntityAttributeId].optionSet.id].options, value)
                                            : value;
    };

    return {
        processValue: function(value, type) {
            return processSingleValue(value,type);
        },
        getDataElementValueOrCode: function(useCodeForOptionSet, event, dataElementId, allDes, optionSets) {
            return getDataElementValueOrCodeForValueInternal(useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
        },
        getDataElementValueOrCodeForValue: function(useCodeForOptionSet, value, dataElementId, allDes, optionSets) {
            return getDataElementValueOrCodeForValueInternal(useCodeForOptionSet, value, dataElementId, allDes, optionSets);
        },
        getTrackedEntityValueOrCodeForValue: function(useCodeForOptionSet, value, trackedEntityAttributeId, allTeis, optionSets) {
            return geTrackedEntityAttributeValueOrCodeForValueInternal(useCodeForOptionSet, value, trackedEntityAttributeId, allTeis, optionSets);
        },
        getVariables: function(allProgramRules, executingEvent, evs, allDes, allTeis, selectedEntity, selectedEnrollment, optionSets) {

            var variables = {};

            var programVariables = allProgramRules.programVariables;

            programVariables = programVariables.concat(allProgramRules.programIndicators.variables);

            angular.forEach(programVariables, function(programVariable) {
                var dataElementId = programVariable.dataElement;
                if(programVariable.dataElement && programVariable.dataElement.id) {
                    dataElementId = programVariable.dataElement.id;
                }

                var trackedEntityAttributeId = programVariable.trackedEntityAttribute;
                if(programVariable.trackedEntityAttribute && programVariable.trackedEntityAttribute.id) {
                    trackedEntityAttributeId = programVariable.trackedEntityAttribute.id;
                }

                var programStageId = programVariable.programStage;
                if(programVariable.programStage && programVariable.programStage.id) {
                    programStageId = programVariable.programStage.id;
                }

                var valueFound = false;
                //If variable evs is not defined, it means the rules is run before any events is registered, skip the types that require an event
                if(programVariable.programRuleVariableSourceType === "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" && evs && evs.byStage){
                    if(programStageId) {
                        var allValues = [];
                        angular.forEach(evs.byStage[programStageId], function(event) {
                            if(event[dataElementId] !== null) {
                                if(angular.isDefined(event[dataElementId])
                                        && event[dataElementId] !== ""){
                                    var value = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
                                            
                                    allValues.push(value);
                                    valueFound = true;
                                    variables = pushVariable(variables, programVariable.displayName, value, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', event.eventDate, programVariable.useCodeForOptionSet);
                                }
                            }
                        });
                    } else {
                        $log.warn("Variable id:'" + programVariable.id + "' name:'" + programVariable.displayName
                            + "' does not have a programstage defined,"
                            + " despite that the variable has sourcetype DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" );
                    }
                }
                else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_NEWEST_EVENT_PROGRAM" && evs){
                    var allValues = [];
                    angular.forEach(evs.all, function(event) {
                        if(angular.isDefined(event[dataElementId])
                            && event[dataElementId] !== null 
                            && event[dataElementId] !== ""){
                            var value = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
                                    
                            allValues.push(value);
                            valueFound = true;
                            variables = pushVariable(variables, programVariable.displayName, value, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', event.eventDate, programVariable.useCodeForOptionSet);
                        }
                    });
                }
                else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_CURRENT_EVENT" && evs){
                    if(angular.isDefined(executingEvent[dataElementId])
                        && executingEvent[dataElementId] !== null 
                        && executingEvent[dataElementId] !== ""){
                        var value = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, executingEvent[dataElementId], dataElementId, allDes, optionSets);
                            
                        valueFound = true;
                        variables = pushVariable(variables, programVariable.displayName, value, null, allDes[dataElementId].dataElement.valueType, valueFound, '#', executingEvent.eventDate, programVariable.useCodeForOptionSet );
                    }
                }
                else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_PREVIOUS_EVENT" && evs){
                    //Only continue checking for a value if there is more than one event.
                    if(evs.all && evs.all.length > 1) {
                        var allValues = [];
                        var previousvalue = null;
                        var previousEventDate = null;
                        var currentEventPassed = false;
                        for(var i = 0; i < evs.all.length; i++) {
                            //Store the values as we iterate through the stages
                            //If the event[i] is not the current event, it is older(previous). Store the previous value if it exists
                            if(!currentEventPassed && evs.all[i] !== executingEvent &&
                                angular.isDefined(evs.all[i][dataElementId])
                                && evs.all[i][dataElementId] !== "") {
                                previousvalue = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, evs.all[i][dataElementId], dataElementId, allDes, optionSets);
                                previousEventDate = evs.all[i].eventDate;
                                allValues.push(value);
                                valueFound = true;
                            }
                            else if(evs.all[i] === executingEvent) {
                                //We have iterated to the newest event - store the last collected variable value - if any is found:
                                if(valueFound) {
                                    variables = pushVariable(variables, programVariable.displayName, previousvalue, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', previousEventDate, programVariable.useCodeForOptionSet);
                                }
                                //Set currentEventPassed, ending the iteration:
                                currentEventPassed = true;
                            }
                        }
                    }
                }
                else if(programVariable.programRuleVariableSourceType === "TEI_ATTRIBUTE"){
                    angular.forEach(selectedEntity.attributes , function(attribute) {
                        if(!valueFound) {
                            if(attribute.attribute === trackedEntityAttributeId
                                    && angular.isDefined(attribute.value)
                                    && attribute.value !== null
                                    && attribute.value !== "") {
                                valueFound = true;
                                //In registration, the attribute type is found in .type, while in data entry the same data is found in .valueType.
                                //Handling here, but planning refactor in registration so it will always be .valueType
                                variables = pushVariable(variables, 
                                    programVariable.displayName, 
                                    geTrackedEntityAttributeValueOrCodeForValueInternal(programVariable.useCodeForOptionSet,attribute.value, trackedEntityAttributeId, allTeis, optionSets),
                                    null, 
                                    attribute.type ? attribute.type : attribute.valueType, valueFound, 
                                    'A', 
                                    '',
                                    programVariable.useCodeForOptionSet);
                            }
                        }
                    });
                }
                else if(programVariable.programRuleVariableSourceType === "CALCULATED_VALUE"){
                    //We won't assign the calculated variables at this step. The rules execution will calculate and assign the variable.
                }
                else {
                    //If the rules was executed without events, we ended up in this else clause as expected, as most of the variables require an event to be mapped
                    if(evs)
                    {
                        //If the rules was executed and events was supplied, we should have found an if clause for the the source type, and not ended up in this dead end else.
                        $log.warn("Unknown programRuleVariableSourceType:" + programVariable.programRuleVariableSourceType);
                    }
                }


                if(!valueFound){
                    //If there is still no value found, assign default value:
                    if(dataElementId && allDes) {
                        var dataElement = allDes[dataElementId];
                        if( dataElement ) {
                            variables = pushVariable(variables, programVariable.displayName, "", null, dataElement.dataElement.valueType, false, '#', '', programVariable.useCodeForOptionSet );
                        }
                        else {
                            variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, '#', '', programVariable.useCodeForOptionSet );
                        }
                    }
                    else if (programVariable.trackedEntityAttribute) {
                        //The variable is an attribute, set correct prefix and a blank value
                        variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, 'A', '', programVariable.useCodeForOptionSet );
                    }
                    else {
                        //Fallback for calculated(assigned) values:
                        variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, '#', '', programVariable.useCodeForOptionSet );
                    }
                }
            });

            //add context variables:
            //last parameter "valuefound" is always true for event date
            variables = pushVariable(variables, 'current_date', DateUtils.getToday(), null, 'DATE', true, 'V', '', false );

            variables = pushVariable(variables, 'event_date', executingEvent.eventDate, null, 'DATE', true, 'V', '', false );
            variables = pushVariable(variables, 'due_date', executingEvent.dueDate, null, 'DATE', true, 'V', '' );
            variables = pushVariable(variables, 'event_count', evs ? evs.all.length : 0, null, 'INTEGER', true, 'V', '', false );

            variables = pushVariable(variables, 'enrollment_date', selectedEnrollment ? selectedEnrollment.enrollmentDate : '', null, 'DATE', selectedEnrollment ? true : false, 'V', '', false );
            variables = pushVariable(variables, 'enrollment_id', selectedEnrollment ? selectedEnrollment.enrollment : '', null, 'TEXT',  selectedEnrollment ? true : false, 'V', '', false );
            variables = pushVariable(variables, 'event_id', executingEvent ? executingEvent.event : '', null, 'TEXT',  executingEvent ? true : false, 'V', executingEvent ? executingEvent.eventDate : false, false);

            variables = pushVariable(variables, 'incident_date', selectedEnrollment ? selectedEnrollment.incidentDate : '', null, 'DATE',  selectedEnrollment ? true : false, 'V', '', false);
            variables = pushVariable(variables, 'enrollment_count', selectedEnrollment ? 1 : 0, null, 'INTEGER', true, 'V', '', false);
            variables = pushVariable(variables, 'tei_count', selectedEnrollment ? 1 : 0, null, 'INTEGER', true, 'V', '', false);
            
            //Push all constant values:
            angular.forEach(allProgramRules.constants, function(constant){
                variables = pushVariable(variables, constant.id, constant.value, null, 'INTEGER', true, 'C', '', false);
            });

            var orgUnitUid = selectedEnrollment ? selectedEnrollment.orgUnit : executingEvent.orgUnit;
            var orgUnitCode = '';
            var def = $q.defer();
            if(orgUnitUid){
                OrgUnitFactory.getFromStoreOrServer( orgUnitUid ).then(function (response) {
                    orgUnitCode = response.code;
                    variables = pushVariable(variables, 'orgunit_code', orgUnitCode, null, 'TEXT', orgUnitCode ? true : false, 'V', '', false);
                    def.resolve(variables);
                });
            }else{
                def.resolve(variables);
            }
            return def.promise;
        }
    };
})