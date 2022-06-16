// @flow
import React from 'react';
import css from 'styled-jsx/css';
import { colors, spacers } from '@dhis2/ui';
import type { Props } from './errorHandler.types';

const style = css`
div {
    color: ${colors.red500};
    margin: ${spacers.dp16};
}
`;

export const ErrorHandler = ({ error, children }: Props) => {
    if (error) {
        return (
            <div>
                {error}
                <style jsx>{style}</style>
            </div>
        );
    }

    return children;
};
