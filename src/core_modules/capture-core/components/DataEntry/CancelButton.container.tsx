import React, { forwardRef } from 'react';
import i18n from '@dhis2/d2-i18n';
import { connect } from 'react-redux';
import { CancelButtonComponent } from './CancelButton.component';
import { getDataEntryKey } from './common/getDataEntryKey';
import { dataEntryHasChanges } from './common/dataEntryHasChanges';
import { useStageLabel } from '../../metaData';

const mapStateToProps = (state: any, props: {id: string}) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        dataEntryHasChanges: !!dataEntryHasChanges(state, key),
    };
};

const mapDispatchToProps = () => ({
});

const ConnectedCancelButton = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true },
)(CancelButtonComponent);

export const CancelButton = forwardRef((props: any, ref) => {
    const eventLabel = useStageLabel('event') ?? i18n.t('event');
    return <ConnectedCancelButton ref={ref} eventLabel={eventLabel} {...props} />;
});
