// @flow
import React, { useEffect } from 'react';
import { batchActions } from 'redux-batched-actions';
import { useDispatch } from 'react-redux';
import type { Props } from './widgetEventEdit.types';
import { WidgetEventEdit as WidgetEventEditComponent } from './WidgetEventEdit.component';
import { getEvent } from '../../events/eventRequests';
import { getProgramAndStageFromEvent } from '../../metaData/helpers/getProgramAndStageFromEvent';
import { getCategoriesDataFromEventAsync } from '../Pages/ViewEvent/epics/getCategoriesDataFromEvent';
import {
    loadViewEventDataEntry,
    prerequisitesErrorLoadingViewEventDataEntry,
} from '../Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.actions';
import { openEventForEditInDataEntry } from '../Pages/EditEvent/DataEntry/editEventDataEntry.actions';
import { showEditEventDataEntry } from '../Pages/ViewEvent/EventDetailsSection/eventDetails.actions';
import {
    viewEventFromUrl,
    // eventFromUrlRetrieved,
    eventFromUrlCouldNotBeRetrieved,
} from '../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { eventFromUrlRetrieved } from './WidgetEventEdit.actions';
import { orgUnitRetrievedOnUrlUpdate } from '../Pages/EditEvent/editEvent.actions';
import { getApi } from '../../d2/d2Instance';

const getEventFromUrlEpic = async eventId => {
    const prevProgramId = undefined;
    return getEvent(eventId)
        .then(eventContainer => {
            console.log(eventContainer);
            if (!eventContainer) {
                return eventFromUrlCouldNotBeRetrieved(
                    'Event could not be loaded. Are you sure it exists?',
                );
            }
            return getCategoriesDataFromEventAsync(eventContainer.event).then(
                categoriesData =>
                    eventFromUrlRetrieved(
                        eventContainer,
                        prevProgramId,
                        categoriesData,
                    ),
            );
        })
        .catch(() =>
            eventFromUrlCouldNotBeRetrieved(
                'Event could not be loaded. Are you sure it exists?',
            ),
        );
};

export const WidgetEventEdit = ({
    mode,
    programStage,
    eventId,
    onEdit,
}: Props) => {
    const dispatch = useDispatch();

    const loadViewEvent = async () => {
        const eventContainer = await getEvent(eventId);
        const metadataContainer = getProgramAndStageFromEvent(
            eventContainer.event,
        );
        if (metadataContainer.error) {
            dispatch(
                prerequisitesErrorLoadingViewEventDataEntry(
                    metadataContainer.error,
                ),
            );
        }
        const foundation = metadataContainer.stage.stageForm;
        const program = metadataContainer.program;
        const orgUnit = {
            id: eventContainer.orgUnitId,
            name: eventContainer.orgUnitName,
        };
        const actions = await loadViewEventDataEntry(
            eventContainer,
            orgUnit,
            foundation,
            program,
        );

        const getOrgUnitAction = await getApi()
            .get(`organisationUnits/${eventContainer.event.orgUnitId}`)
            .then(orgUnitObject =>
                orgUnitRetrievedOnUrlUpdate(orgUnitObject, eventContainer),
            )
            .catch(error => {
                console.log(error);
            });

        dispatch(
            batchActions([
                // getEventFromUrlEpic(eventId),
                eventFromUrlRetrieved(eventContainer),
                getOrgUnitAction,
                viewEventFromUrl({
                    nextProps: { viewEventId: eventId },
                    nextPage: mode,
                }),
                ...actions,
            ]),
        );
    };

    const editViewEvent = async () => {
        const eventContainer = await getEvent(eventId);
        const dataEntryValues = {
            complete: 'true',
            eventDate: '2021-12-25',
            geometry: null,
        };
        const formValues = {
            GieVkTxp4HH: '100',
            K6uUAvq500H: 'W42',
            eMyVanycQSC: '2018-12-11',
            fWIAEtYVEGk: 'MODDISCH',
            msodh3rEMJa: '2018-12-25',
            oZg33kd9taw: 'Female',
            qrur9Dvnyt5: '72',
            vV9UWAZohSf: '75',
        };
        const loadedValues = { eventContainer, dataEntryValues, formValues };
        const metadataContainer = getProgramAndStageFromEvent(
            eventContainer.event,
        );
        if (metadataContainer.error) {
            dispatch(
                prerequisitesErrorLoadingViewEventDataEntry(
                    metadataContainer.error,
                ),
            );
        }
        const program = metadataContainer.program;
        const foundation = metadataContainer.stage.stageForm;
        const orgUnit = {
            id: eventContainer.orgUnitId,
            name: eventContainer.orgUnitName,
        };

        dispatch(
            batchActions([
                showEditEventDataEntry(),
                ...openEventForEditInDataEntry(
                    loadedValues,
                    orgUnit,
                    foundation,
                    program,
                ),
            ]),
        );
    };

    useEffect(() => {
        loadViewEvent();
    }, []);

    const handleonEdit = async () => {
        await editViewEvent();
        onEdit();
    };

    return (
        <WidgetEventEditComponent
            programStage={programStage}
            mode={mode}
            onEdit={handleOnEdit}
        />
    );
};
