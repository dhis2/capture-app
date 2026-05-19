import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { withStyles } from 'capture-core-utils/styles';
import { FEATURES, useFeature } from 'capture-core-utils';
import {
    spacers,
    IconFileDocument24,
    Button,
    IconMore16,
    FlyoutMenu,
    MenuItem,
} from '@dhis2/ui';
import { useQueryClient } from '@tanstack/react-query';
import i18n from '@dhis2/d2-i18n';
import { ViewEventSection } from '../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../Section/ViewEventSectionHeader.component';
import { EditEventDataEntry } from '../../../WidgetEventEdit/EditEventDataEntry/EditEventDataEntry.container';
import { ViewEventDataEntry } from '../../../WidgetEventEdit/ViewEventDataEntry/ViewEventDataEntry.container';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { NoticeBox } from '../../../NoticeBox';
import { EventChangelogWrapper } from '../../../WidgetEventEdit/EventChangelogWrapper';
import { OverflowButton } from '../../../Buttons';
import { ReactQueryAppNamespace } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES } from '../../../WidgetsChangelog';
import { useCategoryCombinations } from '../../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { useMetadataForProgramStage } from '../../../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { useProgramExpiryForUser } from '../../../../hooks';
import { useAuthorities } from '../../../../utils/authority/useAuthorities';
import type { PlainProps } from './EventDetailsSection.types';

const getStyles: any = () => ({
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
        gap: spacers.dp8,
    },
    actionsContainer: {
        flexShrink: 0,
        display: 'flex',
        gap: spacers.dp4,
    },
    button: {
        whiteSpace: 'nowrap',
        paddingInlineStart: spacers.dp8,
    },
    editButtonContainer: {},
});

const EventDetailsSectionPlain = (props: PlainProps & { classes: any }) => {
    const {
        classes,
        eventId,
        eventData,
        onOpenEditEvent,
        isEditEventPage,
        programStage,
        eventAccess,
        onBackToAllEvents,
        programId,
        showEditButton,
        ...passOnProps
    } = props;
    const orgUnitId = useSelector((state: any) => state.viewEventPage.loadedValues?.orgUnit?.id);
    const { formFoundation } = useMetadataForProgramStage({ programId });
    const { orgUnit, error } = useCoreOrgUnit(orgUnitId);
    const { programCategory, isLoading } = useCategoryCombinations(programId);
    const queryClient = useQueryClient();
    const supportsChangelog = useFeature(FEATURES.changelogs);
    const [changeLogIsOpen, setChangeLogIsOpen] = useState(false);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const expiryPeriod = useProgramExpiryForUser(programId);
    const { hasAuthority: canUncompleteEvent } = useAuthorities({ authorities: ['F_UNCOMPLETE_EVENT'] });

    const onSaveExternal = useCallback(() => {
        const queryKey = [ReactQueryAppNamespace, 'changelog', CHANGELOG_ENTITY_TYPES.EVENT, eventId];
        queryClient.removeQueries(queryKey);
        onBackToAllEvents();
    }, [eventId, queryClient, onBackToAllEvents]);

    if (error) {
        return error.errorComponent;
    }

    const renderDataEntryContainer = () => (
        <div className={classes.dataEntryContainer}>
            {isEditEventPage ?
                <EditEventDataEntry
                    dataEntryId={dataEntryIds.SINGLE_EVENT}
                    formFoundation={formFoundation}
                    orgUnit={orgUnit}
                    onSaveExternal={onSaveExternal}
                    expiryPeriod={expiryPeriod}
                    programId={programId}
                    canUncompleteEvent={canUncompleteEvent}
                    {...passOnProps}
                /> :
                <ViewEventDataEntry
                    dataEntryId={dataEntryIds.SINGLE_EVENT}
                    formFoundation={formFoundation}
                    programId={programId}
                    {...passOnProps}
                />
            }
        </div>
    );

    const renderActionsContainer = () => (
        <div className={classes.actionsContainer}>
            {showEditButton &&
                <div className={classes.editButtonContainer}>
                    <Button
                        className={classes.button}
                        onClick={() => onOpenEditEvent(orgUnit, programCategory)}
                        secondary
                        small
                    >
                        {i18n.t('Edit event')}
                    </Button>
                </div>}
            {supportsChangelog && (
                <OverflowButton
                    open={actionsIsOpen}
                    onClick={() => setActionsIsOpen(prev => !prev)}
                    secondary
                    small
                    icon={<IconMore16 />}
                    dataTest="event-program-event-overflow-button"
                    component={(
                        <FlyoutMenu
                            dense
                            maxWidth="250px"
                            dataTest="event-program-event-overflow-menu"
                        >
                            <MenuItem
                                label={i18n.t('View changelog')}
                                suffix={null}
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
                {isEditEventPage && (
                    <NoticeBox
                        formId={`${dataEntryIds.SINGLE_EVENT}-${dataEntryKeys.EDIT}`}
                    />
                )}
            </ViewEventSection>
            {supportsChangelog && changeLogIsOpen && (
                <EventChangelogWrapper
                    isOpen
                    setIsOpen={setChangeLogIsOpen}
                    eventData={eventData?.eventContainer?.values}
                    eventId={eventId}
                    formFoundation={programStage.stageForm}
                />
            )}
        </div>
    );
};

export const EventDetailsSection = withStyles(getStyles)(EventDetailsSectionPlain);
