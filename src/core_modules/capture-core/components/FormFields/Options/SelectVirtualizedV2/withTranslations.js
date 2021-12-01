// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';

type Props = {

};

function buildTranslations() {
    return {
        clearText: i18n.t('Clear'),
        noResults: i18n.t('No results'),
    };
}

export const withTranslations = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class TranslationBuilder extends React.Component<Props> {
            translations: Object;
            constructor(props: Props) {
                super(props);
                this.translations = buildTranslations();
            }

            render() {
                const { ...passOnProps } = this.props;

                return (
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <InnerComponent
                        translations={this.translations}
                        {...passOnProps}
                    />
                );
            }
        };
