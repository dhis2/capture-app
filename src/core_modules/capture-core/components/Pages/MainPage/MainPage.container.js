// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { MainPageComponent } from './MainPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';

const WrappedMainPage = withLoadingIndicator()(withErrorMessageHandler()(MainPageComponent));

export const MainPage = (props) => {
    const currentSelectionsComplete = useSelector(({ currentSelections }) => !!currentSelections.complete);
    const programId = useSelector(({ currentSelections }) => currentSelections.programId);
    const error = useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);
    const ready = useSelector(({ activePage }) => !activePage.lockedSelectorLoads);

    return (
        <WrappedMainPage
            currentSelectionsComplete={currentSelectionsComplete}
            programId={programId}
            error={error}
            ready={ready}
            {...props}
        />
    );
};
