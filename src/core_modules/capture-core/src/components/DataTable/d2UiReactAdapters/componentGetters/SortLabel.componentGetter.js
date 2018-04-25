// @flow
import * as React from 'react';
import classNames from 'classnames';

import { directions, placements } from './sortLabel.const';

type Props = {
    children?: ?React.Node,
    initialDirection?: ?$Values<typeof directions>,
    isActive: boolean,
    direction?: ?$Values<typeof directions>,
    placement?: ?$Values<typeof placements>,
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
        const { children, isActive, direction, onSort, onGetIcons, placement } = this.props;
        const icons = onGetIcons && onGetIcons(isActive, direction, onSort);
        const classes = classNames(
            'd2-sort-label-default',
            {
                'd2-sort-label-right-default': placement === placements.RIGHT,
            },
        );

        return (
            <div
                className={classes}
                onClick={this.handleSort}
                role="button"
                tabIndex={0}
            >
                {
                    (() => {
                        if (placement === placements.RIGHT) {
                            return (
                                <div>
                                    {icons}
                                    <div
                                        className="d2-sort-label-last-element-default"
                                    >
                                        {children}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div>
                                {children}
                                <div
                                    className="d2-sort-label-last-element-default"
                                >
                                    {icons}
                                </div>
                            </div>
                        );
                    })()
                }
            </div>
        );
    }
}

export default () => SortLabel;
