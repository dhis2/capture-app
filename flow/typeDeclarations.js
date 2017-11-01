// @flow
/* eslint-disable */
import type { Store } from 'redux';

declare type TrackerStore = Store<any, Object>;
declare type TrackerStateContainer = Object;
declare type TrackerDispatch = (Object) => void;

declare type DhisDevConfig = {
    baseUrl: string
};
