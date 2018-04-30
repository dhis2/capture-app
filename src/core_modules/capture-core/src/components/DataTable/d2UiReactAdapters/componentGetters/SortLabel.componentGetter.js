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

    renderChildrenContainer(classes?: ?Array<string>) {
        return (
            <div
                className={classNames('d2-sort-label-children-default', classes)}
                onClick={this.handleSort}
                role="button"
                tabIndex={0}
            >
                {this.props.children}
            </div>
        );
    }

    render() {
        const { children, isActive, direction, onSort, onGetIcons, placement } = this.props;
        const icons = onGetIcons && onGetIcons(isActive, direction, onSort);
        const containerClasses = classNames(
            'd2-sort-label-container-default',
            {
                'd2-sort-label-right-default': placement === placements.RIGHT,
            },
        );

        return (
            <div
                className={containerClasses}
            >
                {
                    (() => {
                        if (placement === placements.RIGHT) {
                            return (
                                <React.Fragment>
                                    <div
                                        className="d2-sort-label-icon-default"
                                    >
                                        {icons}
                                    </div>
                                    {
                                        this.renderChildrenContainer(['d2-sort-label-children-last-default'])
                                    }
                                </React.Fragment>
                            );
                        }

                        return (
                            <React.Fragment>
                                {
                                    this.renderChildrenContainer(['d2-sort-label-children-first-default'])
                                }
                                <div
                                    className="d2-sort-label-last-element-default d2-sort-label-icon-default"
                                >
                                    {icons}
                                </div>
                            </React.Fragment>
                        );
                    })()
                }
            </div>
        );
    }
}

export default () => SortLabel;
