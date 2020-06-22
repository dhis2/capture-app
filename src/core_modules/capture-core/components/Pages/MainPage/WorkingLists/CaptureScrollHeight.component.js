// @flow
import * as React from 'react';

type Props = {
    captureEl: Object,
    children: (height: number) => React.Node,
    extraTriggers: Array<any>,
};

const CaptureScrollHeight = (props: Props) => {
    const { captureEl, extraTriggers } = props;
    const [height, setHeight] = React.useState(0);

    const updateHeight = React.useCallback(() => {
        setHeight(captureEl.current.scrollHeight);
    }, [captureEl]);

    React.useLayoutEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () =>
            window.removeEventListener('resize', updateHeight);
    }, [...extraTriggers, updateHeight]);

    return props.children(height);
};

export default CaptureScrollHeight;
