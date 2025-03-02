// @flow
import React from 'react';
import cx from 'classnames';
import { colors } from '@dhis2/ui';

type Props = {
    label: string,
    onClick: () => void,
    selected: boolean,
    dataTest: string,
};

export const BreadcrumbItem = ({ label, onClick, selected, dataTest }: Props) => (
    <button
        type="button"
        className={cx('button', { selected })}
        onClick={onClick}
        data-test={dataTest}
    >
        {label}
        <style jsx>{`
            .button {
                /* Reset button styles */
                background: none;
                border: none;
                cursor: pointer;
                font: inherit;

                /* Custom button styles */
                font-size: 14px;
                padding: 6px 4px;
                color: ${colors.grey800};
                border-radius: 3px;
            }
            
            .button:hover {
                text-decoration: underline;
                color: black;
            }
            
            .button.selected {
                color: black;
            }
        `}</style>
    </button>
);

