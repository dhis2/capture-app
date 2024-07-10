// @flow
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { colors, FlyoutMenu, IconMore16, MenuItem, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/';
import { useMetadataForProgramStage } from '../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { Widget } from '../Widget';
import { useLinkedEventByOriginId } from './hooks/useLinkedEventByOriginId';
import { WidgetTwoEventWorkspaceComponent } from './WidgetTwoEventWorkspace.component';
import { OverflowButton } from '../Buttons';
import { buildUrlQueryString } from '../../utils/routing';


type Props = {|
    programId: string,
    eventId: string,
    orgUnitId: string,
    stageId: string,
|}

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
};

const WidgetTwoEventWorkspacePlain = ({
    eventId,
    programId,
    orgUnitId,
    stageId,
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

    if (isLinkedEventLoading || isLoadingMetadata) {
        return null;
    }

    if (isLinkedEventError || isMetadataError) {
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

            <Widget
                header={stage.name}
                noncollapsible
            >
                <WidgetTwoEventWorkspaceComponent
                    linkedEvent={linkedEvent}
                    formFoundation={formFoundation}
                    dataValues={dataValues}
                />
            </Widget>
        </div>
    );
};

export const WidgetTwoEventWorkspace = withStyles(
    styles,
)(WidgetTwoEventWorkspacePlain);
