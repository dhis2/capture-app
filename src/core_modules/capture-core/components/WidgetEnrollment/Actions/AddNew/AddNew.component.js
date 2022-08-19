// @flow
import { IconAdd16, MenuItem, Tooltip } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './addNew.types';

const AddNewItem = ({ onClick, ...passOnProps }: Object) => (<MenuItem
    dense
    dataTest="widget-enrollment-actions-add-new"
    onClick={onClick}
    icon={<IconAdd16 />}
    label={i18n.t('Add new')}
    {...passOnProps}
/>);

export const AddNew = ({ canAddNew, onlyEnrollOnce, tetName, onAddNew }: Props) => {
    if (!canAddNew) {
        return null;
    }

    return (<Tooltip
        content={i18n.t('Only one enrollment per {{tetName}} is allowed in this program', { tetName })}
    >
        {({ onMouseOver, onMouseOut, ref }) => (
            <div ref={(divRef) => {
                if (divRef && onlyEnrollOnce) {
                    divRef.onmouseover = onMouseOver;
                    divRef.onmouseout = onMouseOut;
                    ref.current = divRef;
                }
            }}
            >
                <AddNewItem
                    disabled={onlyEnrollOnce}
                    onClick={onAddNew}
                />
            </div>
        )}
    </Tooltip>);
};
