// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { TrackedEntityType } from '../../../../../../metaData';
import LinkButton from '../../../../../Buttons/LinkButton.component';
import type { ErrorData } from './uniqueTEADuplicate.types';

const getStyles = () => ({
    linkButton: {
        fontSize: 'inherit',
        paddingLeft: 0,
        paddingRight: 3,
        backgroundColor: 'inherit',
        textDecoration: 'underline',
        cursor: 'pointer',
        outline: 'none',
    },
    container: {
        padding: 2,
    },
});

type Props = {
    errorData: ErrorData,
    trackedEntityType: ?TrackedEntityType,
    attributeName: ?string,
    classes: Object,
    onShowExisting: () => void,
};

class UniqueTEADuplicateErrorMessageCreator extends React.Component<Props> {
    static renderPrerequisitesError() {
        return (
            <div>
                {i18n.t('A duplicate exists (but there were some errors, see log for details')}
            </div>
        );
    }

    static renderNoAccess(attributeName: string) {
        const attributeNameLC = attributeName.toLowerCase();
        return (
            <div>
                {i18n.t(
                    'An item with this {{attributeName}} is already registered, but you don\'t have access to it',
                    { attributeName: attributeNameLC },
                )}
            </div>
        );
    }

    static renderTypeDifference(attributeName: string, trackedEntityTypeName: string) {
        const trackedEntityTypeNameLC = trackedEntityTypeName.toLowerCase();
        const attributeNameLC = attributeName.toLowerCase();
        return (
            <div>
                {i18n.t(
                    'A {{trackedEntityTypeName}} with this {{attributeName}} is already registered',
                    { trackedEntityTypeName: trackedEntityTypeNameLC, attributeName: attributeNameLC },
                )}
            </div>
        );
    }

    handleShowExisting = () => {
        this.props.onShowExisting();
    }

    renderDefault(attributeName: string, trackedEntityTypeName: string, linkButtonClass: string) {
        const trackedEntityTypeNameLC = trackedEntityTypeName.toLowerCase();
        const attributeNameLC = attributeName.toLowerCase();
        return (
            <React.Fragment>
                <div>
                    {i18n.t(
                        'A {{trackedEntityTypeName}} with this {{attributeName}} is already registered',
                        { trackedEntityTypeName: trackedEntityTypeNameLC, attributeName: attributeNameLC },
                    )}
                </div>
                <div>
                    <LinkButton
                        onClick={this.handleShowExisting}
                        className={linkButtonClass}
                    >
                        {i18n.t(
                            'Show registered {{trackedEntityTypeName}}',
                            { trackedEntityTypeName: trackedEntityTypeNameLC },
                        )}
                    </LinkButton>
                </div>
            </React.Fragment>
        );
    }

    renderContents() {
        const { trackedEntityType, attributeName, errorData, classes } = this.props;

        if (!trackedEntityType || !attributeName) {
            return UniqueTEADuplicateErrorMessageCreator.renderPrerequisitesError();
        }

        if (!errorData) {
            return UniqueTEADuplicateErrorMessageCreator.renderNoAccess(attributeName);
        }

        if (errorData.tetId !== trackedEntityType.id) {
            return UniqueTEADuplicateErrorMessageCreator.renderTypeDifference(attributeName, trackedEntityType.name);
        }

        return this.renderDefault(attributeName, trackedEntityType.name, classes.linkButton);
    }

    render() {
        const { classes } = this.props;
        return (
            <div
                className={classes.container}
            >
                {this.renderContents()}
            </div>
        );
    }
}

// $FlowFixMe
export default withStyles(getStyles)(UniqueTEADuplicateErrorMessageCreator);
