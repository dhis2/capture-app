// @flow
import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/';
import { EnrollmentPageKeys }
    from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import type { PlainProps, Props } from './WidgetHeader.types';
import { OverflowMenuComponent } from '../OverflowMenu';

const styles = {
    menu: {
        marginLeft: 'auto',
    },
    icon: {
        marginRight: spacersNum.dp8,
    },
};

const WidgetHeaderPlain = ({
    linkedStage,
    linkedEvent,
    orgUnitId,
    currentPage,
    relationship,
    relationshipType,
    stage,
    eventId,
    classes,
    onDeleteEvent,
    onDeleteEventRelationship,
}: Props) => {
    const { icon } = linkedStage;
    return (
        <>
            {icon && (
                <div className={classes.icon}>
                    <NonBundledDhis2Icon
                        name={icon?.name}
                        color={icon?.color}
                        width={30}
                        height={30}
                        cornerRadius={2}
                    />
                </div>
            )}
            <span> {linkedStage.name} </span>
            {currentPage === EnrollmentPageKeys.VIEW_EVENT && (
                <div className={classes.menu}>
                    <OverflowMenuComponent
                        linkedEvent={linkedEvent}
                        relationshipId={relationship}
                        relationshipType={relationshipType}
                        orgUnitId={orgUnitId}
                        originEventId={eventId}
                        stageWriteAccess={stage?.access?.data?.write}
                        onDeleteEvent={onDeleteEvent}
                        onDeleteEventRelationship={onDeleteEventRelationship}
                    />
                </div>
            )}
        </>
    );
};

export const WidgetHeader: ComponentType<PlainProps> = withStyles(styles)(WidgetHeaderPlain);
