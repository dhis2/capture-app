// @flow
import * as React from 'react';

type Props = {
    open: boolean,
    children: React.Node,
};

const defaultStyle = {
    position: 'absolute',
    zIndex: 201,
};

const containerStyle = {
    position: 'relative',
};

const D2DatePopup = (props: Props) => {
    const { open, children } = props;
    if (!open) {
        return null;
    }

    const style = { ...defaultStyle, top: 0, left: 0 };
    return (
        <div
            style={containerStyle}
        >
            <div
                style={style}
            >
                {children}
            </div>
        </div>
    );
};

export default D2DatePopup;
