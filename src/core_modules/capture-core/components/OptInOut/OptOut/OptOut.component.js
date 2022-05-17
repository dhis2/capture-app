// @flow
import React, { type ComponentType } from 'react';
import { NoticeBox, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import type { PlainProps } from './optOut.types';

const styles = {
    container: {
        width: '80%',
        margin: '0 auto',
    },
};

export const OptOutPlain = ({ classes, programName, handleOptOut, loading }: PlainProps) => {
    const title = i18n.t('Stop using new Enrollment dashboard for {{programName}}', {
        programName,
        interpolation: { escapeValue: false },
    });
    const button = i18n.t('Opt out for {{programName}}', {
        programName,
        interpolation: { escapeValue: false },
    });

    return (
        <div data-test="opt-out">
            <br />
            <NoticeBox title={title} className={classes.container}>
                <p>
                    {i18n.t(
                        'This program uses the new enrollment dashboard functionality ' +
                            'in the Capture app (beta). Click this button to opt-out and direct ' +
                            'all users to the Tracker capture app for this program.',
                    )}
                </p>
                <Button onClick={handleOptOut} loading={loading} disabled={loading} data-test="opt-out-button">
                    {button}
                </Button>
            </NoticeBox>
        </div>
    );
};

export const OptOut: ComponentType<$Diff<PlainProps, CssClasses>> = withStyles(styles)(OptOutPlain);
