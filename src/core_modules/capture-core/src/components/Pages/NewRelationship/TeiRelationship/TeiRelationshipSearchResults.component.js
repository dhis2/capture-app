// @flow

import * as React from 'react';

type Props = {
    results: Array<any>,
}

class TeiRelationshipSearchResults extends React.Component<Props> {
    renderItem = (tei: any) => (
        <div
            key={tei.id}
        />
    )
    render() {
        const { results } = this.props;
        return (
            <div>
                {results.map(r => this.renderItem(r)) }
            </div>
        );
    }
}

export default TeiRelationshipSearchResults;
