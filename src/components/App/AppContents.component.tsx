import React, { memo, type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { FeedbackBar } from 'capture-core/components/FeedbackBar';
import { AppPagesLoader } from './AppPagesLoader.component';

const getStyles = (theme: any) => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
});

type PlainProps = Record<string, never>;

type Props = PlainProps & WithStyles<typeof getStyles>;

const Index = ({ classes }: Props) => (
    <div
        className={classes.app}
        dir={systemSettingsStore.get().dir}
    >
        <AppPagesLoader />
        <FeedbackBar />
    </div>
);
Index.displayName = 'AppContents';

export const AppContents = withStyles(getStyles)(memo(Index)) as ComponentType<PlainProps>;
