
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { FeedbackBar } from 'capture-core/components/FeedbackBar';
import { AppPagesLoader } from './AppPagesLoader.component';

const getStyles = theme => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
});

type Props = {
    classes: {
        app: string,
    },
};

const AppContentsPlain = ({ classes }: Props) => (
    <div
        className={classes.app}
        dir={systemSettingsStore.get().dir}
    >
        <AppPagesLoader />
        <FeedbackBar />
    </div>
);

export const AppContents = withStyles(getStyles)(AppContentsPlain);
