// @flow
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { colors, FlyoutMenu, IconMore16, MenuItem, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/';
import type { Props } from './WidgetTwoEventWorkspace.types';
import { useMetadataForProgramStage } from '../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { Widget } from '../Widget';
import { useLinkedEventByOriginId } from './hooks/useLinkedEventByOriginId';
import { WidgetTwoEventWorkspaceComponent } from './WidgetTwoEventWorkspace.component';
import { OverflowButton } from '../Buttons';
import { buildUrlQueryString } from '../../utils/routing';
import {
    EnrollmentPageKeys,
} from '../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import { useClientDataValues } from './hooks/useClientDataValues';

const styles = {
    menu: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
        justifyContent: 'end',
        background: colors.white,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        marginRight: spacersNum.dp8,
    },
};

const WidgetTwoEventWorkspacePlain = ({
    eventId,
    programId,
    orgUnitId,
    currentPage,
    classes,
}: Props) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const { push } = useHistory();
    const {
        linkedEvent,
        dataValues,
        isError: isLinkedEventError,
        isLoading: isLinkedEventLoading,
    } = useLinkedEventByOriginId({ originEventId: eventId });

    const {
        formFoundation,
        stage,
        isLoading: isLoadingMetadata,
        isError: isMetadataError,
    } = useMetadataForProgramStage({
        programId,
        stageId: linkedEvent?.programStage,
    });

    const {
        clientValuesWithSubValues,
        isLoading: isLoadingClientValues,
        isError: isClientValuesError,
    } = useClientDataValues({
        linkedEventId: linkedEvent?.event,
        dataValues,
        formFoundation,
    });

    if (isLinkedEventLoading || isLoadingMetadata || isLoadingClientValues) {
        return null;
    }

    if (isLinkedEventError || isMetadataError || isClientValuesError) {
        return (
            <div>
                {i18n.t('An error occurred while loading the widget.')}
            </div>
        );
    }

    if (!linkedEvent || !formFoundation || !stage) {
        return null;
    }

    return (
        <div>
            {currentPage === EnrollmentPageKeys.VIEW_EVENT && (
                <div className={classes.menu}>
                    <OverflowButton
                        open={actionsIsOpen}
                        onClick={() => setActionsIsOpen(prev => !prev)}
                        icon={<IconMore16 />}
                        small
                        secondary
                        dataTest={'widget-event-navigate-to-linked-event'}
                        component={(
                            <FlyoutMenu dense maxWidth="250px">
                                <MenuItem
                                    label={i18n.t('View linked event')}
                                    dataTest={'event-overflow-view-linked-event'}
                                    onClick={() => {
                                        push(`/enrollmentEventEdit?${buildUrlQueryString({
                                            eventId: linkedEvent.event,
                                            orgUnitId,
                                        })}`);
                                        setActionsIsOpen(false);
                                    }}
                                />
                            </FlyoutMenu>
                        )}
                    />
                </div>
            )}

            <Widget
                header={
                    <div className={classes.header}>
                        {stage.icon && (
                            <div className={classes.icon}>
                                <NonBundledDhis2Icon
                                    name={stage.icon?.name}
                                    color={stage.icon?.color}
                                    width={30}
                                    height={30}
                                    cornerRadius={2}
                                />
                            </div>
                        )}
                        <span> {stage.name} </span>
                    </div>
                }
                noncollapsible
            >
                <WidgetTwoEventWorkspaceComponent
                    linkedEvent={linkedEvent}
                    formFoundation={formFoundation}
                    dataValues={clientValuesWithSubValues}
                />
            </Widget>
        </div>
    );
};

export const WidgetTwoEventWorkspace = withStyles(
    styles,
)(WidgetTwoEventWorkspacePlain);
