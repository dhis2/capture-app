// @flow
import React, { useCallback } from 'react';
import { buildUrl } from 'capture-core-utils';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import i18n from '@dhis2/d2-i18n';
import { useConfig } from '@dhis2/app-runtime';
import { systemSettingsStore } from '../../metaDataMemoryStores';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../metaData';

const getStyles = () => ({
    container: {
        padding: 24,
    },
    contents: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    linkContainer: {
        paddingLeft: 5,
    },
});

type Props = {
    programId: string,
    orgUnitId: string,
    classes: Object,
    children: React$Node,
};

const TrackerProgramHandler = ({ programId, orgUnitId, classes, children }: Props) => {
    const { baseUrl } = useConfig();
    const getUrl = useCallback(() => {
        const trackerBaseUrl = buildUrl(baseUrl, systemSettingsStore.get().trackerAppRelativePath, '/#/?');
        const params = `program=${programId}&ou=${orgUnitId}`;
        return trackerBaseUrl + params;
    }, [
        baseUrl,
        programId,
        orgUnitId,
    ]);

    const program = getProgramFromProgramIdThrowIfNotFound(programId);
    if (program instanceof TrackerProgram) {
        return (
            <div className={classes.container}>
                <Paper
                    elevation={0}
                >
                    <div
                        className={classes.contents}
                    >
                        {i18n.t('To work with the selected program,')}
                        <span
                            className={classes.linkContainer}
                        >
                            <a
                                href={getUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {i18n.t('open the Tracker Capture app')}
                            </a>
                        </span>
                    </div>
                </Paper>
            </div>
        );
    }

    return children;
};

export const TrackerProgramHandlerComponent = withStyles(getStyles)(TrackerProgramHandler);
