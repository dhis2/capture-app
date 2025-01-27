// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 200px)',
    },
    innerBox: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        marginTop: '24px',
        display: 'inline-block',
        fontSize: '20px',
        lineHeight: '24px',
        fontWeight: '500',
        color: colors.grey900,
    },
    content: {
        margin: '12px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '14px',
        color: colors.grey800,
        textAlign: 'left',
    },
    link: {
        display: 'inline-block',
        color: colors.grey800,
        fontSize: '14px',
        lineHeight: '24px',
    },
};

type Props = {|
    ...CssClasses,
|};

const EmptyStateIcon = () => (
    <svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#F3F5F7" d="M0 0h64v64H0z" />
        <path fill="#F3F5F7" stroke="#A0ADBA" strokeWidth="2" d="M4 13h36v48H4z" />
        <path fill="#F3F5F7" stroke="#A0ADBA" strokeWidth="2" d="M10 8h40v53H10z" />
        <path fill="#F3F5F7" stroke="#404B5A" strokeWidth="2" d="M16 3h44v58H16z" />
        <path fill="#F3F5F7" stroke="#404B5A" strokeWidth="2" d="M22 9h32v16H22z" />
        <path d="M26 14h21M26 19h11" stroke="#404B5A" strokeWidth="2" />
        <path fill="#F3F5F7" stroke="#A0ADBA" strokeWidth="2" d="M22 33h32v16H22z" />
        <path d="M26 38h21M26 43h11" stroke="#A0ADBA" strokeWidth="2" />
    </svg>
);

const documentationLink = 'https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master/tracking-individual-level-data/capture.html';

const NoSelectionsInfoBoxPlain = ({ classes }: Props) => (
    <div className={classes.container}>
        <div className={classes.innerBox}>
            <div className={classes.iconContainer}>
                <EmptyStateIcon />
            </div>
            <h1 className={classes.headingText}>
                {i18n.t('Get started with Capture app')}
            </h1>
            <div className={classes.content}>
                <span>
                    <strong>{i18n.t('Report data')}</strong>:{' '}
                    {i18n.t('Choose a program and organisation unit to see existing data and create new records.')}
                </span>
                <span>
                    <strong>{i18n.t('Search')}</strong>:{' '}
                    {i18n.t('Click \'Search\'. For program-specific results, choose a program first.')}
                </span>
            </div>

            <a
                className={classes.link}
                href={documentationLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                {i18n.t('Learn more about Capture app')}
            </a>
        </div>
    </div>
);

export const NoSelectionsInfoBox = withStyles(styles)(NoSelectionsInfoBoxPlain);
