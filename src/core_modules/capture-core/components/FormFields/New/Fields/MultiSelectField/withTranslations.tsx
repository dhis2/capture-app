import * as React from 'react';
import i18n from '@dhis2/d2-i18n';

function buildTranslations() {
    return {
        filterPlaceholder: i18n.t('Type to filter options'),
        noMatchText: i18n.t('No match found'),
    };
}

export const withSelectMultiTranslations = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class TranslationBuilder extends React.Component<any> {
            translations: any;
            constructor(props) {
                super(props);
                this.translations = buildTranslations();
            }

            render() {
                const { ...passOnProps } = this.props;

                return (
                    <InnerComponent
                        translations={this.translations}
                        {...passOnProps}
                    />
                );
            }
        };
