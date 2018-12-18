// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../Buttons/Button.component';

type Props = {
    results: Array<any>,
    onAddRelationship: (teiId: string) => void,
}

class TeiRelationshipSearchResults extends React.Component<Props> {

    renderValues = (values: Object) => {
        return Object.keys(values).map(valueKey => (
            <div key={valueKey}>
                {values[valueKey]}
            </div>
        ));
    }
    renderItem = (tei: any) => (
        <div
            key={tei.id}
        >
            <div>
                {this.renderValues(tei.values)}
            </div>
            <Button onClick={() => this.props.onAddRelationship(tei.id)}>{i18n.t('Link')}</Button>
        </div>
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
