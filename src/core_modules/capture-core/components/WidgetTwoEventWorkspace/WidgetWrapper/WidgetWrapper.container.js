// @flow
import React from 'react';
import { colors, spacersNum, IconLink16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/';
import type { Props } from './WidgetWrapper.types';
import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';

const styles = {
    container: {
        width: 'fit-content',
        marginBottom: '16px',
        margin: '16px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: spacersNum.dp16,
        fontWeight: 500,
        fontSize: 16,
        color: colors.grey800,
    },
    referalResponse: {
        padding: spacersNum.dp16,
        backgroundColor: colors.blue100,
        borderRadius: '3px',
    },
    linkedEvent: {
        color: colors.blue900,
        verticalAlign: 'middle',
        display: 'flex',
        fontSize: '16px',
        fontWeight: '500',
    },
    icon: {
        marginRight: spacersNum.dp8,
    },
    decription: {
        margin: `${spacersNum.dp8}px 0`,
    },
};

const WidgetWrapperPlain = ({ widget, type, stage, linkedStage, classes }: Props) => {
    if (type === WidgetTwoEventWorkspaceWrapperTypes.EDIT_EVENT) {
        return (
            <div className={classes.container}>
                <div className={classes.header}> {stage?.name} </div>
                <div className={classes.referalResponse}>
                    <div className={classes.linkedEvent}>
                        <span className={classes.icon}>
                            <IconLink16 color={colors.blue800} />
                        </span>
                        <div>{i18n.t('Linked event')}</div>
                    </div>
                    <div className={classes.decription}>
                        {i18n.t(
                            'This {{stageName}} event is linked to a {{linkedStageName}} event. Review the linked event details before entering data below',
                            {
                                linkedStageName: linkedStage?.name,
                                stageName: stage?.name,
                                interpolation: { escapeValue: false },
                            },
                        )}
                    </div>
                    {widget}
                </div>
            </div>
        );
    }

    return <>{widget}</>;
};

export const WidgetWrapper = withStyles(styles)(WidgetWrapperPlain);
