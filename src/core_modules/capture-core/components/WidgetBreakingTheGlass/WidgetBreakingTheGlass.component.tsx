import React, { useMemo, useState, useCallback, type ComponentType } from 'react';
import {
    NoticeBox,
    TextAreaField,
    Button,
    ButtonStrip,
    spacersNum,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { PlainProps } from './WidgetBreakingTheGlass.types';
import { Widget } from '../Widget';
import { useTermLabel } from '../../metaData';

const styles: Readonly<any> = ({ typography }: any) => ({
    title: {
        ...typography.title,
    },
    background: {
        maxWidth: '1000px',
    },
    wrapper: {
        padding: `0 ${spacersNum.dp12}px ${spacersNum.dp16}px ${spacersNum.dp12}px`,
    },
});

type Props = PlainProps & WithStyles<typeof styles>;

const WidgetBreakingTheGlassPlain = ({
    onBreakingTheGlass,
    onCancel,
    classes,
}: Props) => {
    const [reason, setReason] = useState('');
    const reasonChangeHandler = useCallback(({ value }: any) => {
        setReason(value);
    }, [setReason]);
    const disabled = useMemo(() => reason.length === 0, [reason]);
    const enrollmentsLabel = useTermLabel('enrollment', { plural: true });

    return (
        <div data-test="breaking-the-glass-widget" className={classes.background}>
            <Widget
                noncollapsible
                borderless
                header={<></>}
            >
                <div className={classes.wrapper}>
                    <div className={classes.title}>
                        {i18n.t('Check for {{enrollmentsLabel}}', { enrollmentsLabel })}
                    </div>
                    <br />
                    <NoticeBox title={i18n.t('This program is protected')} warning>
                        {i18n.t(
                            'You must provide a reason to check for {{enrollmentsLabel}} in this protected program.',
                            { enrollmentsLabel },
                        )}
                        {' '}
                        {i18n.t('All activity will be logged.')}
                    </NoticeBox>
                    <br />
                    <TextAreaField
                        label={i18n.t('Reason to check for {{enrollmentsLabel}}', { enrollmentsLabel })}
                        placeholder={
                            i18n.t(
                                'Describe the reason you are checking for {{enrollmentsLabel}} in this protected program',
                                { enrollmentsLabel },
                            )
                        }
                        onChange={reasonChangeHandler}
                        value={reason}
                        inputWidth="680px"
                        error={disabled}
                        required
                    />
                    <br />
                    <ButtonStrip>
                        <Button onClick={() => onBreakingTheGlass(reason)} disabled={disabled} primary>
                            {i18n.t('Check for {{enrollmentsLabel}}', { enrollmentsLabel })}
                        </Button>
                        <Button secondary onClick={onCancel}>
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                </div>
            </Widget>
        </div>
    );
};

export const WidgetBreakingTheGlassComponent = withStyles(styles)(WidgetBreakingTheGlassPlain) as ComponentType<PlainProps>;
