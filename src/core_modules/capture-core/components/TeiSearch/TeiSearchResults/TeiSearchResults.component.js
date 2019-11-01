// @flow

import * as React from 'react';
import LoadingMask from '../../LoadingMasks/LoadingMask.component';

type Props = {
    results: Array<any>,
    resultsLoading: ?boolean,
    getResultsView?: ?(props: Object) => React.Element<any>,
}

class TeiSearchResultsWrapper extends React.Component<Props> {
    renderDefaultResultsView = () => (
        <div>
            {this.props.resultsLoading && <LoadingMask />}
        </div>
    );

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
