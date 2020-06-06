// @flow
import React from 'react';
import IsSelectionsCompleteLevel from './IsSelectionsCompleteLevel/IsSelectionsCompleteLevel.container';
import { LockedSelector } from '../components/LockedSelector/container';

export const NewEventPage = () => (
    <div>
        <LockedSelector />
        <IsSelectionsCompleteLevel />
    </div>
);

