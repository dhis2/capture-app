import React, { type ComponentType } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { PlainProps } from './StageEventHeader.types';
import { useTermLabel } from '../../../../../metaData';
import { tCustomTerm } from '../../../../../utils/tCustomTerm';

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

const StageEventHeaderPlain = ({ icon, title, events, classes }: Props) => {
    const eventLabel = useTermLabel('event');
    const eventsLabel = useTermLabel('event', { plural: true });
    return (<>
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
                    {tCustomTerm('{{count}} {{eventLabel}}', {
                        count: events.length,
                        eventLabel,
                        eventsLabel,
                        defaultValue: '{{count}} {{eventLabel}}',
                        defaultValue_plural: '{{count}} {{eventsLabel}}',
                    })}
                </span>}
            </div>
        </div>
    </>);
};

export const StageEventHeader = withStyles(
    getStyles,
)(StageEventHeaderPlain) as ComponentType<PlainProps>;
