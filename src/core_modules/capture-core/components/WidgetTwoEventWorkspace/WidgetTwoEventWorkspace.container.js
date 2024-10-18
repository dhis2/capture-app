// @flow
import React from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/';
import type { Props } from './WidgetTwoEventWorkspace.types';
import { useMetadataForProgramStage } from '../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { Widget } from '../Widget';
import { useLinkedEventByOriginId } from './hooks/useLinkedEventByOriginId';
import { WidgetTwoEventWorkspaceComponent } from './WidgetTwoEventWorkspace.component';
import { OverflowMenuComponent } from './OverflowMenu';
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
    const {
        linkedEvent,
        relationship,
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
                    <OverflowMenuComponent
                        linkedEvent={linkedEvent}
                        relationshipId={relationship}
                        orgUnitId={orgUnitId}
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
