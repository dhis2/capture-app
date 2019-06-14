// @flow
import { createSelector } from 'reselect';

type Data = {
    messagesContainer: Object,
    containerPropNameMain: string,
    containerPropNameOnComplete: string,
    showOnComplete: boolean,
};

const containerSelector = (data: Data) => data.messagesContainer;
const mainPropNameSelector = (data: Data) => data.containerPropNameMain;
const onCompletePropNameSelector = (data: Data) => data.containerPropNameOnComplete;
const showOnCompleteSelector = (data: Data) => data.showOnComplete;

// $FlowFixMe
export const makeGetVisibleMessages = () => createSelector(
    containerSelector,
    showOnCompleteSelector,
    mainPropNameSelector,
    onCompletePropNameSelector,
    (container, showOnComplete, mainPropName, onCompletePropName) => {
        container = container || {};
        if (!showOnComplete) {
            return container[mainPropName];
        }

        const main = container[mainPropName] || [];
        const onComplete = container[onCompletePropName] || [];

        return [
            ...main,
            ...onComplete,
        ];
    },
);
