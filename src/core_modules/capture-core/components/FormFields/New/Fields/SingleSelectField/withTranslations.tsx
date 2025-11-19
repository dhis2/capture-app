import * as React from 'react';
import i18n from '@dhis2/d2-i18n';

type TranslationProps = {
    translations?: {
        clearText?: string;
        noResults?: string;
    };
};

export const withSelectSingleTranslations = () =>
    <P extends Record<string, unknown>>(InnerComponent: React.ComponentType<P & TranslationProps>) =>
        class TranslationBuilder extends React.Component<P & TranslationProps> {
            static defaultProps = {
                translations: {
                    clearText: '',
                    noResults: '',
                },
            };

            render() {
                const { translations, ...passOnProps } = this.props;
                const translationsWithDefaultValues = {
                    ...TranslationBuilder.defaultProps.translations,
                    ...translations,
                    clearText: translations?.clearText || i18n.t('Clear'),
                    noResults: translations?.noResults || i18n.t('No results found'),
                };

                return (
                    <InnerComponent
                        translations={translationsWithDefaultValues}
                        {...passOnProps as P & TranslationProps}
                    />
                );
            }
        };
