// @flow
import React, { useState, useCallback } from 'react';
import {
    NoticeBox,
    TextAreaField,
    Button,
    ButtonStrip,
    spacersNum,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import type { PlainProps } from './WidgetBreakingTheGlass.types';
import { Widget } from '../Widget';

const styles = ({ typography }) => ({
    title: {
        ...typography.title,
    },
    background: {
        maxWidth: '1000px',
    },
    wrapper: {
        padding: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
});

const reasonHeader = i18n.t('Reason to check for enrollment');
const reasonPlaceholder = i18n.t('Describe the reason you are checking for enrollment in this protected program');

const WidgetBreakingTheGlassPlain = ({
    onBreakingTheGlass,
    classes,
}: PlainProps) => {
    const [reason, setReason] = useState('');
    const reasonChangeHandler = useCallback(({ value }) => {
        setReason(value);
    }, [setReason]);

    return (
        <div className={classes.background}>
            <Widget
                noncollapsible
                borderless
                header={<></>}
            >
                <div className={classes.wrapper}>
                    <div className={classes.title}>
                        {i18n.t('Check for enrollment')}
                    </div>
                    <br />
                    <NoticeBox title="This program is protected" warning>
                        {i18n.t('You must provide a reason to check for enrollment in this protected program. All activity will be logged.')}
                    </NoticeBox>
                    <br />
                    <TextAreaField
                        label={reasonHeader}
                        placeholder={reasonPlaceholder}
                        onChange={reasonChangeHandler}
                        value={reason}
                        inputWidth="680px"
                    />
                    <br />
                    <ButtonStrip>
                        <Button onClick={() => onBreakingTheGlass(reason)}>
                            {i18n.t('Check for enrollment')}
                        </Button>
                        <Button secondary>
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                </div>
            </Widget>
        </div>
    );
};

export const WidgetBreakingTheGlassComponent = withStyles(styles)(WidgetBreakingTheGlassPlain);
