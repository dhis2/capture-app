// @flow
import { useSelector } from 'react-redux';
import React from 'react';
import type { ComponentType } from 'react';
import { NewPageComponent } from './NewPage.component';


export const NewPage: ComponentType<{||}> = () => {
    const error: boolean =
    useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);
    const ready: boolean =
    useSelector(({ activePage }) => !activePage.isLoading);


    return (
        <NewPageComponent
            error={error}
            ready={ready}
        />);
};
