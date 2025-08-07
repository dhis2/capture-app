import * as React from 'react';
import i18n from '@dhis2/d2-i18n';

function buildTranslations() {
    return {
        clearText: i18n.t('Clear'),
        noResults: i18n.t('No results'),
    };
}

export const withSelectTranslations = () =>
    <P extends Record<string, unknown>>(InnerComponent: React.ComponentType<P>) =>
        class TranslationBuilder extends React.Component<P> {
            constructor(props: P) {
                super(props);
                this.translations = buildTranslations();
            }
            translations: any;

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
