import React, { memo, type ComponentType } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { FeedbackBar } from 'capture-core/components/FeedbackBar';
import { AppPagesLoader } from './AppPagesLoader.component';

const getStyles = (theme: any) => ({
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

type PlainProps = Record<string, never>;

type Props = PlainProps & WithStyles<typeof getStyles>;

const Index = ({ classes }: Props) => (
    <>
        <div
            css={classes.app}
            dir={systemSettingsStore.get().dir}
        >
            <AppPagesLoader />
            <FeedbackBar />
        </div>
        <div css={classes.iOSWorkaround} />
    </>
);
Index.displayName = 'AppContents';

export const AppContents = withStyles(getStyles)(memo(Index)) as ComponentType<PlainProps>;
