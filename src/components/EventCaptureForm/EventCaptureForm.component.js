// @flow
import React, { Component } from 'react';
import DataEntry from 'capture-core/components/DataEntry/DataEntry.container';
import withCompleteButton from 'capture-core/components/DataEntry/withCompleteButton';
import withSaveButton from 'capture-core/components/DataEntry/withSaveButton';

const getCompleteOptions = () => ({
    color: 'primary',
});

const getSaveOptions = () => ({
    color: 'accent',
});

const CompletableDataEntry = withCompleteButton(getCompleteOptions)(DataEntry);
const SaveableAndCompleableDataEntry = withSaveButton(getSaveOptions)(CompletableDataEntry);

export default () => (
    <SaveableAndCompleableDataEntry
        id={'main'}
    />
);
