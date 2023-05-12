// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconChevronLeft24, spacers } from '@dhis2/ui';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import type { Props, PlainProps } from './searchPage.types';
import { TopBar } from './TopBar.container';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';

const getStyles = () => ({
    backButton: {
        margin: `${spacers.dp12} 0 0 ${spacers.dp24}`,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
    },
    half: {
        flex: 1,
    },
    quarter: {
        flex: 0.4,
        padding: `${spacers.dp12} ${spacers.dp24} ${spacers.dp24} 0`,
    },
});

const SearchPagePlain = ({ programId, orgUnitId, onNavigateToMainPage, classes }: PlainProps) => (
    <>
        <TopBar programId={programId} orgUnitId={orgUnitId} />
        <Button dataTest="back-button" className={classes.backButton} onClick={onNavigateToMainPage}>
            <IconChevronLeft24 />
            {i18n.t('Back')}
        </Button>

        <div className={classes.container}>
            <div className={classes.half}>
                <SearchBox />
            </div>
            <div className={classes.quarter}>
                <TemplateSelector />
            </div>
        </div>
    </>
);

export const SearchPageComponent: ComponentType<$Diff<Props, CssClasses>> = compose(withStyles(getStyles))(
    SearchPagePlain,
);
