// @flow
import * as React from 'react';
import { directions } from './sortLabel.const';

type Props = {
    children?: ?React.Node,
    initialDirection?: ?$Values<typeof directions>,
    isActive: boolean,
    direction?: ?$Values<typeof directions>,
    onSort: (direction: $Values<typeof directions>) => void,
    onGetIcons?: ?(isActive: boolean, direction?: ?$Values<typeof directions>, onSort: (direction: $Values<typeof directions>) => void) => void,
};

class SortLabel extends React.Component<Props> {
    handleSort = () => {
        const isActive = this.props.isActive;
        const direction = this.props.direction;

        if (isActive) {
            this.props.onSort(direction === directions.ASC ? directions.DESC : directions.ASC);
        } else {
            this.props.onSort(this.props.initialDirection || directions.DESC);
        }
    }

    render() {
        const { children, isActive, direction, onSort, onGetIcons } = this.props;
        const icons = onGetIcons && onGetIcons(isActive, direction, onSort);
        return (
            <div
                className={'d2-sort-label-container'}
                onClick={this.handleSort}
                role="button"
                tabIndex={0}
            >
                {children}
                {icons}
            </div>
        );
    }
}

export default () => SortLabel;
