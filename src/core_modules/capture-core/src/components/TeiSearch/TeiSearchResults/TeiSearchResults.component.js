// @flow

import * as React from 'react';

type Props = {
    results: Array<any>,
    getResultsView?: ?(props: Object) => React.Element<any>,
}

class TeiSearchResultsWrapper extends React.Component<Props> {
    renderDefaultResultsView = () => (<div />);

    render() {
        const { getResultsView, ...passOnProps } = this.props;
        return (
            <div>
                <div>
                    { getResultsView ? getResultsView(passOnProps) : this.renderDefaultResultsView() }
                </div>
            </div>
        );
    }
}

export default TeiSearchResultsWrapper;
