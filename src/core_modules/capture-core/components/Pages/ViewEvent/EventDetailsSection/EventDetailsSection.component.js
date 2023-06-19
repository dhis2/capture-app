// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { dataEntryIds } from 'capture-core/constants';
import { withStyles } from '@material-ui/core/';
import { spacers, IconFileDocument24, Tooltip } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons/Button.component';
import { ViewEventSection } from '../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../Section/ViewEventSectionHeader.component';
import { EditEventDataEntry } from '../../../WidgetEventEdit/EditEventDataEntry/EditEventDataEntry.container';
import { ViewEventDataEntry } from '../../../WidgetEventEdit/ViewEventDataEntry/ViewEventDataEntry.container';
import type { ProgramStage } from '../../../../metaData';
import { useRulesEngineOrgUnit } from '../../../../hooks/useRulesEngineOrgUnit';


const getStyles = () => ({
    container: {
        flexGrow: 2,
        flexBasis: 0,
    },
    content: {
        display: 'flex',
        gap: spacers.dp8,
    },
    dataEntryContainer: {
        flexGrow: 1,
    },
    actionsContainer: {
        flexShrink: 0,
    },
    button: {
        whiteSpace: 'nowrap',
    },
    editButtonContainer: {
    },
});

type Props = {
    showEditEvent: ?boolean,
    onOpenEditEvent: (orgUnit: Object) => void,
    programStage: ProgramStage,
    eventAccess: { read: boolean, write: boolean },
    classes: {
        container: string,
        content: string,
        dataEntryContainer: string,
        actionsContainer: string,
        button: string,
        editButtonContainer: string,
    },
};

const EventDetailsSectionPlain = (props: Props) => {
    const {
        classes,
        onOpenEditEvent,
        showEditEvent,
        programStage,
        eventAccess,
        ...passOnProps } = props;
    const orgUnitId = useSelector(({ viewEventPage }) => viewEventPage.loadedValues?.orgUnit?.id);
    const { orgUnit, error } = useRulesEngineOrgUnit(orgUnitId);

    if (error) {
        return error.errorComponent;
    }

    const renderDataEntryContainer = () => {
        const formFoundation = programStage.stageForm;
        return (
            <div className={classes.dataEntryContainer}>
                {showEditEvent ?
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <EditEventDataEntry
                        dataEntryId={dataEntryIds.SINGLE_EVENT}
                        formFoundation={formFoundation}
                        orgUnit={orgUnit}
                        {...passOnProps}
                    /> :
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <ViewEventDataEntry
                        dataEntryId={dataEntryIds.SINGLE_EVENT}
                        formFoundation={formFoundation}
                        {...passOnProps}
                    />
                }
            </div>
        );
    };

    const renderActionsContainer = () => {
        const canEdit = eventAccess.write;
        return (
            <div className={classes.actionsContainer}>
                {!showEditEvent &&
                <div
                    className={classes.editButtonContainer}
                >
                    <Button
                        className={classes.button}
                        onClick={() => onOpenEditEvent(orgUnit)}
                        disabled={!canEdit}
                        secondary
                        small
                    >
                        <Tooltip content={i18n.t('You don\'t have access to edit this event')}>
                            {({ onMouseOver, onMouseOut, ref }) => (<div ref={(divRef) => {
                                if (divRef && !canEdit) {
                                    divRef.onmouseover = onMouseOver;
                                    divRef.onmouseout = onMouseOut;
                                    ref.current = divRef;
                                }
                            }}
                            >
                                {i18n.t('Edit event')}
                            </div>)}
                        </Tooltip>
                    </Button>
                </div>}
            </div>
        );
    };


    return orgUnit ? (
        <div className={classes.container}>
            <ViewEventSection
                header={<ViewEventSectionHeader text={i18n.t('Event details')} icon={IconFileDocument24} />}
            >
                <div className={classes.content}>
                    {renderDataEntryContainer()}
                    {renderActionsContainer()}
                </div>
            </ViewEventSection>
        </div>
    ) : null;
};


export const EventDetailsSection = withStyles(getStyles)(EventDetailsSectionPlain);
