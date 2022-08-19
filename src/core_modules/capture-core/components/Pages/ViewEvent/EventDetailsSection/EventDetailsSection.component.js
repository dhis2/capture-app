// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/';
import { IconFileDocument24, Tooltip } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons/Button.component';
import { ViewEventSection } from '../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../Section/ViewEventSectionHeader.component';
import { EditEventDataEntry } from '../../../WidgetEventEdit/EditEventDataEntry/EditEventDataEntry.container';
import { ViewEventDataEntry } from '../../../WidgetEventEdit/ViewEventDataEntry/ViewEventDataEntry.container';
import type { ProgramStage } from '../../../../metaData';
import { useRulesEngineOrgUnit } from '../../../../hooks/useRulesEngineOrgUnit';


const getStyles = (theme: Theme) => ({
    container: {
        flexGrow: 2,
        flexBasis: 0,
    },
    content: {
        display: 'flex',
    },
    dataEntryContainer: {
        flexGrow: 1,
        padding: theme.typography.pxToRem(10),
    },
    actionsContainer: {
        minWidth: theme.typography.pxToRem(128),
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(30),
    },
    button: {
        whiteSpace: 'nowrap',
    },
    editButtonContainer: {
        display: 'inline-block',
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
                        formFoundation={formFoundation}
                        orgUnit={orgUnit}
                        {...passOnProps}
                    /> :
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <ViewEventDataEntry
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
                <Tooltip content={i18n.t('You dont have access to edit this event')}>
                    {({ onMouseOver, onMouseOut, ref }) => (
                        <div
                            className={classes.editButtonContainer}
                            ref={(divRef) => {
                                if (divRef && !canEdit) {
                                    divRef.onmouseover = onMouseOver;
                                    divRef.onmouseout = onMouseOut;
                                    ref.current = divRef;
                                }
                            }}
                        >
                            <Button
                                className={classes.button}
                                variant="raised"
                                onClick={() => onOpenEditEvent(orgUnit)}
                                disabled={!canEdit}
                            >
                                {i18n.t('Edit event')}
                            </Button>
                        </div>
                    )}
                </Tooltip>
                }
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
