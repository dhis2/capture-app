// @flow
import React, { type ComponentType, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FlyoutMenu, IconMore16, MenuItem, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/';
import { OverflowButton } from '../../Buttons';
import { buildUrlQueryString } from '../../../utils/routing';
import { EnrollmentPageKeys }
    from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import type { PlainProps, Props } from './WidgetHeader.types';
import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';

const styles = {
    menu: {
        marginLeft: 'auto',
    },
    icon: {
        marginRight: spacersNum.dp8,
    },
};

const getTitle = ({ type, stage }) => {
    if (type === WidgetTwoEventWorkspaceWrapperTypes.EDIT_EVENT) {
        return i18n.t('Referral details');
    }

    return stage.name;
};

const WidgetHeaderPlain = ({ stage, linkedEvent, orgUnitId, currentPage, type, classes }: Props) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const { push } = useHistory();
    const { icon } = stage;
    const title = getTitle({ type, stage });

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
            <span> {title} </span>
            {currentPage === EnrollmentPageKeys.VIEW_EVENT && (
                <div className={classes.menu}>
                    <OverflowButton
                        open={actionsIsOpen}
                        onClick={() => setActionsIsOpen(prev => !prev)}
                        icon={<IconMore16 />}
                        small
                        secondary
                        dataTest={'widget-event-navigate-to-linked-event'}
                        component={
                            <FlyoutMenu dense maxWidth="250px">
                                <MenuItem
                                    label={i18n.t('View linked event')}
                                    dataTest={'event-overflow-view-linked-event'}
                                    onClick={() => {
                                        push(
                                            `/enrollmentEventEdit?${buildUrlQueryString({
                                                eventId: linkedEvent.event,
                                                orgUnitId,
                                            })}`,
                                        );
                                        setActionsIsOpen(false);
                                    }}
                                />
                            </FlyoutMenu>
                        }
                    />
                </div>
            )}
        </>
    );
};

export const WidgetHeader: ComponentType<PlainProps> = withStyles(styles)(WidgetHeaderPlain);

