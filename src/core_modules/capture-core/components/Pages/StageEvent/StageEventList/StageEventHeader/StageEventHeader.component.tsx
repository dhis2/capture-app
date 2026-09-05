import React, { type ComponentType } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { PlainProps } from './StageEventHeader.types';

const getStyles = () => ({
    wrapper: {
        display: 'flex',
    },
    icon: {
        paddingInlineEnd: spacersNum.dp8,
    },
    title: {
        color: colors.grey900,
        fontSize: spacersNum.dp16,
        fontWeight: 500,
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

const StageEventHeaderPlain = ({ icon, title, events, classes }: Props) => (<>
    <div data-test="stage-event-header" className={classes.wrapper}>
        <div className={classes.icon}>{
            icon && (
                <div className={classes.icon}>
                    <NonBundledDhis2Icon
                        name={icon.name}
                        color={icon.color}
                        width={20}
                        height={20}
                        cornerRadius={2}
                    />
                </div>
            )
        }</div>
        <div className={classes.title}>{title}
            {events.length > 0 && <span> :
                {events.length} {events.length > 1 ? i18n.t('events') : i18n.t('event')}
            </span>}
        </div>
    </div>
</>);

export const StageEventHeader = withStyles(
    getStyles,
)(StageEventHeaderPlain) as ComponentType<PlainProps>;
