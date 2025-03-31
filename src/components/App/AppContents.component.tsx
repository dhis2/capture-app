import React, { memo } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { FeedbackBar } from 'capture-core/components/FeedbackBar';
import { AppPagesLoader } from './AppPagesLoader.component';
import { Theme } from '../../types/global.types';

const getStyles = (theme: any) => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
});

type Props = WithStyles<typeof getStyles>;

const Index = ({ classes }: Props): JSX.Element => (
    <div
        className={classes.app}
        dir={systemSettingsStore.get().dir}
    >
        <AppPagesLoader />
        <FeedbackBar />
    </div>
);
Index.displayName = 'AppContents';

export const AppContents = withStyles(getStyles)(memo(Index));
