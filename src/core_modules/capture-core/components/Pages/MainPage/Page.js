// @flow
import React from 'react';
import { LockedSelector } from '../components/LockedSelector/container';
import MainPageContainer from './MainPage.container';

export const MainPage = () => (<LockedSelector render={() => <MainPageContainer />} />);
