
// @flow
import React, { memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { FeedbackBar } from 'capture-core/components/FeedbackBar';
import { AppPagesLoader } from './AppPagesLoader.component';

const getStyles = theme => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
    // See https://dhis2.atlassian.net/browse/DHIS2-20078
    iOSWorkaround: {
        '@supports (-webkit-touch-callout: none)': {
            height: 100,
        },
    },
});

type Props = {
    classes: {
        app: string,
        iOSWorkaround: string,
    },
};

const Index = ({ classes }: Props) => (
    <>
        <div
            className={classes.app}
            dir={systemSettingsStore.get().dir}
        >
            <AppPagesLoader />
            <FeedbackBar />
        </div>
        <div className={classes.iOSWorkaround} />
    </>
);
Index.displayName = 'AppContents';

export const AppContents = withStyles(getStyles)(memo(Index));
