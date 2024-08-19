// @flow
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { withStyles } from '@material-ui/core/';
import { spacers, IconFileDocument24, Button, IconMore16, FlyoutMenu, MenuItem } from '@dhis2/ui';
import { useQueryClient } from 'react-query';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { ViewEventSection } from '../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../Section/ViewEventSectionHeader.component';
import { EditEventDataEntry } from '../../../WidgetEventEdit/EditEventDataEntry/EditEventDataEntry.container';
import { ViewEventDataEntry } from '../../../WidgetEventEdit/ViewEventDataEntry/ViewEventDataEntry.container';
import type { ProgramStage } from '../../../../metaData';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { NoticeBox } from '../../../NoticeBox';
import { FEATURES, useFeature } from '../../../../../capture-core-utils';
import { EventChangelogWrapper } from '../../../WidgetEventEdit/EventChangelogWrapper';
import { OverflowButton } from '../../../Buttons';
import { ReactQueryAppNamespace } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES } from '../../../WidgetsChangelog';
import { useCategoryCombinations } from '../../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import type { ProgramCategory } from '../../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';
import { useMetadataForProgramStage } from '../../../DataEntries/common/ProgramStage/useMetadataForProgramStage';

const getStyles = () => ({
    container: {
        flexGrow: 2,
        flexBasis: 0,
    },
    dataEntryContent: {
        display: 'flex',
        gap: spacers.dp8,
    },
    dataEntryContainer: {
        flexGrow: 1,
    },
    headerContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionsContainer: {
        flexShrink: 0,
        display: 'flex',
        gap: spacers.dp4,
    },
    button: {
        whiteSpace: 'nowrap',
    },
    editButtonContainer: {
    },
});

type Props = {
    showEditEvent: ?boolean,
    eventId: string,
    onOpenEditEvent: (orgUnit: Object, programCategory: ?ProgramCategory) => void,
    programStage: ProgramStage,
    eventAccess: { read: boolean, write: boolean },
    programId: string,
    onBackToAllEvents: () => {},
    classes: {
        container: string,
        headerContainer: string,
        dataEntryContent: string,
        dataEntryContainer: string,
        actionsContainer: string,
        button: string,
        editButtonContainer: string,
    },
};

const EventDetailsSectionPlain = (props: Props) => {
    const {
        classes,
        eventId,
        onOpenEditEvent,
        showEditEvent,
        programStage,
        eventAccess,
        onBackToAllEvents,
        programId,
        ...passOnProps
    } = props;
    const orgUnitId = useSelector(({ viewEventPage }) => viewEventPage.loadedValues?.orgUnit?.id);
    const { formFoundation } = useMetadataForProgramStage({ programId });
    const { orgUnit, error } = useCoreOrgUnit(orgUnitId);
    const { programCategory, isLoading } = useCategoryCombinations(programId);
    const queryClient = useQueryClient();
    const supportsChangelog = useFeature(FEATURES.changelogs);
    const [changeLogIsOpen, setChangeLogIsOpen] = useState(false);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const onSaveExternal = () => {
        const queryKey = [ReactQueryAppNamespace, 'changelog', CHANGELOG_ENTITY_TYPES.EVENT, eventId];
        queryClient.removeQueries(queryKey);
        onBackToAllEvents();
    };

    if (error) {
        return error.errorComponent;
    }

    const renderDataEntryContainer = () => (
        <div className={classes.dataEntryContainer}>
            {showEditEvent ?
            // $FlowFixMe[cannot-spread-inexact] automated comment
                <EditEventDataEntry
                    dataEntryId={dataEntryIds.SINGLE_EVENT}
                    formFoundation={formFoundation}
                    orgUnit={orgUnit}
                    onSaveExternal={onSaveExternal}
                    programId={programId}
                    {...passOnProps}
                /> :
            // $FlowFixMe[cannot-spread-inexact] automated comment
                <ViewEventDataEntry
                    dataEntryId={dataEntryIds.SINGLE_EVENT}
                    formFoundation={formFoundation}
                    programId={programId}
                    {...passOnProps}
                />
            }
        </div>
    );

    const renderActionsContainer = () => {
        const canEdit = eventAccess.write;
        return (
            <div className={classes.actionsContainer}>
                {!showEditEvent && !isLoading &&
                <div
                    className={classes.editButtonContainer}
                >
                    <ConditionalTooltip
                        content={i18n.t('You don\'t have access to edit this event')}
                        enabled={!canEdit}
                    >
                        <Button
                            className={classes.button}
                            onClick={() => onOpenEditEvent(orgUnit, programCategory)}
                            disabled={!canEdit}
                            secondary
                            small
                        >
                            {i18n.t('Edit event')}
                        </Button>
                    </ConditionalTooltip>
                </div>}
                {supportsChangelog && (
                    <OverflowButton
                        open={actionsIsOpen}
                        onClick={() => setActionsIsOpen(prev => !prev)}
                        secondary
                        small
                        icon={<IconMore16 />}
                        component={(
                            <FlyoutMenu dense>
                                <MenuItem
                                    label={i18n.t('View changelog')}
                                    onClick={() => {
                                        setChangeLogIsOpen(true);
                                        setActionsIsOpen(false);
                                    }}
                                />
                            </FlyoutMenu>
                        )}
                    />
                )}
            </div>
        );
    };

    if (!orgUnit || !formFoundation || isLoading) {
        return null;
    }

    return (
        <div className={classes.container}>
            <ViewEventSection
                header={(
                    <div className={classes.headerContainer}>
                        <ViewEventSectionHeader text={i18n.t('Event details')} icon={IconFileDocument24} />
                        {renderActionsContainer()}
                    </div>
                )}
            >
                <div className={classes.dataEntryContainer}>
                    {renderDataEntryContainer()}
                </div>
                {showEditEvent && (
                    <NoticeBox
                        formId={`${dataEntryIds.SINGLE_EVENT}-${dataEntryKeys.EDIT}`}
                    />
                )}
            </ViewEventSection>
            {supportsChangelog && changeLogIsOpen && (
                <EventChangelogWrapper
                    isOpen
                    setIsOpen={setChangeLogIsOpen}
                    eventId={eventId}
                    formFoundation={programStage.stageForm}
                />
            )}
        </div>
    );
};


export const EventDetailsSection = withStyles(getStyles)(EventDetailsSectionPlain);
