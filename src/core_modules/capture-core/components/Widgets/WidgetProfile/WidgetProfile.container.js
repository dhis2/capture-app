// @flow
import React, { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileInformation } from './WidgetProfile.actions';
import { ProfileWidget } from './WidgetProfile.component';

export const WidgetProfile: ComponentType<{||}> = () => {
    const dispatch = useDispatch();
    const selectedTeiId: string =
      useSelector(({ router: { location: { query } } }) => query.teiId);

    const initialAttributes = useSelector(({ profileWidget }) => profileWidget.attributes);
    const [attributes, setAttributes] = useState(initialAttributes);
    useEffect(() => {
        dispatch(fetchProfileInformation());
    },
    [
        selectedTeiId,
        dispatch,
    ]);
    useEffect(() => { setAttributes(initialAttributes); }, [attributes, initialAttributes]);

    return (
        <ProfileWidget attributes={attributes} />
    );
};
