// @flow

import * as React from 'react';

type Props = {
    results: Array<any>,
    getResultsView?: ?(props: Object) => React.Element<any>,
}

class TeiSearchResultsWrapper extends React.Component<Props> {
    renderDefaultResultsView = () => (<div />);

    renderCustomResultsView = () => {
        const { getResultsView, ...passOnProps } = this.props;
        // $FlowFixMe
        return getResultsView(passOnProps);
    }
    render() {
        const { getResultsView } = this.props;
        return (
            <div>
                <div>
                    { getResultsView ? this.renderDefaultResultsView() : this.renderDefaultResultsView() }
                </div>
            </div>
        );
    }
}

export default TeiSearchResultsWrapper;
