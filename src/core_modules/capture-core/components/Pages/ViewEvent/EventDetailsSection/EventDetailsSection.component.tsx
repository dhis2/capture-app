import React, { useState, useMemo } from 'react';
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
import { useQueryClient } from 'react-query';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../../../Tooltips/ConditionalTooltip';
import { ViewEventSection } from '../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../Section/ViewEventSectionHeader.component';
import { EditEventDataEntry } from '../../../WidgetEventEdit/EditEventDataEntry/EditEventDataEntry.container';
import { ViewEventDataEntry } from '../../../WidgetEventEdit/ViewEventDataEntry/ViewEventDataEntry.container';
import { dataElementTypes } from '../../../../metaData';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { NoticeBox } from '../../../NoticeBox';
import { EventChangelogWrapper } from '../../../WidgetEventEdit/EventChangelogWrapper';
import { OverflowButton } from '../../../Buttons';
import { ReactQueryAppNamespace } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES } from '../../../WidgetsChangelog';
import { useCategoryCombinations } from '../../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { useMetadataForProgramStage } from '../../../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { isValidPeriod } from '../../../../utils/validation/validators/form/expiredPeriod';
import { useProgramExpiryForUser } from '../../../../hooks';
import { convertFormToClient } from '../../../../converters';
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
    },
    actionsContainer: {
        flexShrink: 0,
        display: 'flex',
        gap: spacers.dp4,
    },
    button: {
        whiteSpace: 'nowrap',
    },
    editButtonContainer: {},
});

const EventDetailsSectionPlain = (props: PlainProps & { classes: any }) => {
    const {
        classes,
        eventId,
        eventData,
        onOpenEditEvent,
        showEditEvent,
        programStage,
        eventAccess,
        onBackToAllEvents,
        programId,
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

    const onSaveExternal = () => {
        const queryKey = [ReactQueryAppNamespace, 'changelog', CHANGELOG_ENTITY_TYPES.EVENT, eventId];
        queryClient.removeQueries(queryKey);
        onBackToAllEvents();
    };

    const occurredAtClient = convertFormToClient(eventData?.dataEntryValues?.occurredAt, dataElementTypes.DATE) as string;
    const { isWithinValidPeriod } = isValidPeriod(occurredAtClient, expiryPeriod ?? null);
    const isDisabled = !eventAccess.write || !isWithinValidPeriod;

    const occurredAtValue = eventData?.dataEntryValues?.occurredAt;
    const tooltipContent = useMemo(() => {
        if (!eventAccess.write) {
            return i18n.t("You don't have access to edit this event");
        }
        if (!isWithinValidPeriod) {
            return i18n.t(
                '{{occurredAt}} belongs to an expired period. Event cannot be edited',
                {
                    occurredAt: occurredAtValue,
                    interpolation: { escapeValue: false },
                },
            );
        }
        return undefined;
    }, [
        eventAccess.write,
        isWithinValidPeriod,
        occurredAtValue,
    ]);

    if (error) {
        return error.errorComponent;
    }

    const renderDataEntryContainer = () => (
        <div className={classes.dataEntryContainer}>
            {showEditEvent ?
                <EditEventDataEntry
                    dataEntryId={dataEntryIds.SINGLE_EVENT}
                    formFoundation={formFoundation}
                    orgUnit={orgUnit}
                    onSaveExternal={onSaveExternal}
                    expiryPeriod={expiryPeriod}
                    programId={programId}
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
            {!showEditEvent && !isLoading &&
                <div className={classes.editButtonContainer}>
                    <ConditionalTooltip
                        content={tooltipContent}
                        enabled={isDisabled}
                    >
                        <Button
                            className={classes.button}
                            onClick={() => onOpenEditEvent(orgUnit, programCategory)}
                            disabled={isDisabled}
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
                    eventData={eventData?.eventContainer?.values}
                    eventId={eventId}
                    formFoundation={programStage.stageForm}
                />
            )}
        </div>
    );
};

export const EventDetailsSection = withStyles(getStyles)(EventDetailsSectionPlain);
