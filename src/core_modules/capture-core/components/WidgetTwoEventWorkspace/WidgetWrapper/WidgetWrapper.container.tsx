import React from 'react';
import { colors, spacersNum, IconLink16 } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { PlainProps } from './WidgetWrapper.types';
import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';
import { useTermLabel } from '../../../metaData';
import { customTerms } from '../../../utils/customTerms';

export const styles: Readonly<any> = {
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
        marginInlineEnd: spacersNum.dp12,
    },
    decription: {
        margin: `${spacersNum.dp8}px 0`,
    },
};

const WidgetWrapperPlain = ({ widget, type, stage, linkedStage, classes }: PlainProps & WithStyles<typeof styles>) => {
    const eventLabel = useTermLabel('event', { stageId: stage?.id });
    if (type === WidgetTwoEventWorkspaceWrapperTypes.EDIT_EVENT) {
        return (
            <div className={classes.container}>
                <div className={classes.header}> {stage?.name} </div>
                <div className={classes.referalResponse}>
                    <div className={classes.linkedEvent}>
                        <span className={classes.icon}>
                            <IconLink16 color={colors.blue800} />
                        </span>
                        <div>{customTerms.i18n.t('Linked {{eventLabel}}', { eventLabel })}</div>
                    </div>
                    <div className={classes.decription}>
                        {linkedStage?.name && stage?.name ?
                            customTerms.i18n.t(
                                'This {{stageName}} {{eventLabel}} is linked to a {{linkedStageName}} {{eventLabel}}. '
                                + 'Review the linked {{eventLabel}} details before entering data below',
                                {
                                    linkedStageName: linkedStage.name,
                                    stageName: stage.name,
                                    eventLabel,
                                },
                            ) : ''}
                    </div>
                    {widget}
                </div>
            </div>
        );
    }

    return <>{widget}</>;
};

export const WidgetWrapper = withStyles(styles)(WidgetWrapperPlain);
