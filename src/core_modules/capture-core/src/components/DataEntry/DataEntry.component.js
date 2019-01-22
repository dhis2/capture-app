// @flow
/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import D2Form from '../D2Form/D2Form.component';
import placements from './constants/placements.const';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import getDataEntryKey from './common/getDataEntryKey';
import StickyOnScroll from '../Sticky/StickyOnScroll.component';
import Section from '../Section/Section.component';
import SectionHeaderSimple from '../Section/SectionHeaderSimple.component';

const styles = theme => ({
    footerBar: {
        display: 'flex',
        paddingTop: theme.typography.pxToRem(10),
    },
    button: {
        paddingRight: theme.spacing.unit * 2,
    },
    horizontalFormContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    verticalFormContainer: {
        flexGrow: 10,
        maxWidth: '100%',
        paddingTop: theme.typography.pxToRem(10),
    },
    verticalDataEntryContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    verticalContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    stickyOnScroll: {
        position: 'relative',
        flexGrow: 1,
        width: theme.typography.pxToRem(300),
        margin: theme.typography.pxToRem(10),
        marginTop: 0,
    },
    verticalOutputsContainer: {
        marginBottom: theme.typography.pxToRem(10),
    },
    dataEntryFieldSectionContainer: {
        paddingTop: theme.typography.pxToRem(10),
        paddingBottom: theme.typography.pxToRem(10),
    },
    dataEntryFieldSection: {
        padding: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(880),
    },
});

type FieldContainer = {
    field: React.Element<any>,
    placement: $Values<typeof placements>,
    section?: ?string,
};

type DirectionClasses = {
    container?: ?string,
    dataEntryContainer?: ?string,
    outputsContainer?: ?string,
    outputsInnerContainer?: ?string,
    formContainer?: ?string,
}

type Props = {
    id: string,
    itemId: string,
    formFoundation: ?RenderFoundation,
    completeButton?: ?React.Element<any>,
    mainButton?: ?React.Element<any>,
    cancelButton?: ?React.Element<any>,
    notes?: ?React.Element<any>,
    fields?: ?Array<FieldContainer>,
    dataEntryOutputs?: ?Array<any>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    classes: Object,
    formHorizontal: ?boolean,
    onUpdateFieldInner: (
        action: ReduxAction<any, any>,
    ) => void,
    onUpdateFormField?: ?(
        innerAction: ReduxAction<any, any>,
    ) => void,
    onUpdateFormFieldAsync: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: Function,
        dataEntryId: string,
        itemId: string,
    ) => void,
    dataEntrySections?: { [string]: {name: string, placement: $Values<typeof placements>}},
    dataEntryFieldRef: any,
    onAddNote?: ?Function,
    onAddRelationship?: ?Function,
};

const fieldHorizontalFilter = (placement: $Values<typeof placements>) =>
    (fieldContainer: FieldContainer) =>
        fieldContainer.placement === placement;

const fieldVerticalFilter = (placement: $Values<typeof placements>) =>
    (fieldContainer: FieldContainer) =>
        fieldContainer.placement === placement && !fieldContainer.section;

class DataEntry extends React.Component<Props> {
    static errorMessages = {
        NO_ITEM_SELECTED: 'No item selected',
        FORM_FOUNDATION_MISSING: 'form foundation missing. see log for details',
    };

    formInstance: ?any;

    getWrappedInstance() {
        return this.formInstance;
    }

    handleUpdateField = (...args) => {
        this.props.onUpdateFieldInner(this.props.id, this.props.itemId, this.props.onUpdateFormField, ...args);
    }

    getClasses = (): DirectionClasses => {
        const { classes, formHorizontal } = this.props;
        if (formHorizontal) {
            return {
                formContainer: classes.horizontalFormContainer,
            };
        }
        return {
            dataEntryContainer: classes.verticalDataEntryContainer,
            formContainer: classes.verticalFormContainer,
        };
    }

    handleUpdateFieldAsync = (...args) => {
        this.props.onUpdateFormFieldAsync(...args, this.props.id, this.props.itemId);
    }

    getFieldWithPlacement(placement: $Values<typeof placements>) {
        const fields = this.props.fields;

        return fields ?
            fields
                .filter(fieldContainer => fieldContainer.placement === placement && !fieldContainer.section)
                .map(fieldContainer => fieldContainer.field)
            : null;
    }

    getFieldSectionsWithPlacement(placement: $Values<typeof placements>) {
        const fields = this.props.fields || [];
        const sections = this.props.dataEntrySections || {};

        return this.props.dataEntrySections ?
            Object.keys(this.props.dataEntrySections).reduce((accSections, sectionKey) => {
                const section = sections[sectionKey];
                if (section.placement === placement) {
                    const sectionFields = fields ?
                        fields
                            .filter(fieldContainer => fieldContainer.section === sectionKey)
                            .map(fieldContainer => fieldContainer.field)
                        : null;

                    if (sectionFields && sectionFields.length > 0) {
                        accSections.push(
                            <div
                                key={sectionKey}
                                className={this.props.classes.dataEntryFieldSectionContainer}
                            >
                                <Section
                                    className={this.props.classes.dataEntryFieldSection}
                                    header={
                                        <SectionHeaderSimple
                                            title={section.name}
                                        />
                                    }
                                >
                                    {sectionFields}
                                </Section>
                            </div>,
                        );
                    }
                }
                return accSections;
            }, [])
            : [];
    }

    renderDataEntryFieldsByPlacement = (placement: $Values<typeof placements>) => {
        const fields = this.props.fields || [];
        const fieldFilter = this.props.formHorizontal ? fieldHorizontalFilter(placement) : fieldVerticalFilter(placement);
        const fieldsByPlacement = fields ?
            fields
                .filter(fieldFilter)
                .map(fieldContainer => fieldContainer.field)
            : [];

        if (!this.props.formHorizontal) {
            return [...fieldsByPlacement, ...this.getFieldSectionsWithPlacement(placement)];
        }
        return fieldsByPlacement;
    }

    render() {
        const {
            id,
            classes,
            itemId,
            formFoundation,
            completeButton,
            mainButton,
            cancelButton,
            notes,
            completionAttempted,
            saveAttempted,
            fields,
            dataEntrySections,
            onUpdateFormField,
            onUpdateFieldInner,
            onUpdateFormFieldAsync,
            dataEntryOutputs,
            onAddNote,
            onAddRelationship,
            dataEntryFieldRef,
            ...passOnProps } = this.props;

        if (!itemId) {
            return (
                <div>
                    {DataEntry.errorMessages.NO_ITEM_SELECTED}
                </div>
            );
        }

        if (!formFoundation) {
            return (
                <div>
                    {DataEntry.errorMessages.FORM_FOUNDATION_MISSING}
                </div>
            );
        }
        const directionClasses = this.getClasses();
        return (
            <div className={directionClasses.container}>
                <div className={directionClasses.dataEntryContainer}>
                    <div className={directionClasses.formContainer}>
                        {this.renderDataEntryFieldsByPlacement(placements.TOP)}
                        <D2Form
                            innerRef={(formInstance) => { this.formInstance = formInstance; }}
                            formFoundation={formFoundation}
                            id={getDataEntryKey(id, itemId)}
                            validationAttempted={completionAttempted || saveAttempted}
                            onUpdateField={this.handleUpdateField}
                            onUpdateFieldAsync={this.handleUpdateFieldAsync}
                            {...passOnProps}
                        />
                        {this.renderDataEntryFieldsByPlacement(placements.BOTTOM)}
                        {notes &&
                            <div className={classes.notes}>
                                {notes}
                            </div>
                        }
                    </div>
                    {!this.props.formHorizontal ?
                        <StickyOnScroll
                            offsetTop={50}
                            minViewpointWidth={769}
                            containerClass={classes.stickyOnScroll}
                        >
                            <div>
                                {dataEntryOutputs}
                            </div>
                        </StickyOnScroll> :
                        <div className={classes.verticalOutputsContainer}>
                            {dataEntryOutputs}
                        </div>
                    }
                </div>
                <div
                    className={classes.footerBar}
                >
                    {
                        (() => {
                            if (completeButton) {
                                return (
                                    <div
                                        className={classes.button}
                                    >
                                        { completeButton }
                                    </div>
                                );
                            }
                            return null;
                        })()
                    }

                    {
                        (() => {
                            if (mainButton) {
                                return (
                                    <div
                                        className={classes.button}
                                    >
                                        { mainButton }
                                    </div>
                                );
                            }
                            return null;
                        })()
                    }

                    {
                        (() => {
                            if (cancelButton) {
                                return (
                                    <div
                                        className={classes.button}
                                    >
                                        { cancelButton }
                                    </div>
                                );
                            }
                            return null;
                        })()
                    }
                </div>
            </div>
        );
    }
}

// $FlowFixMe
const StylesHOC = withStyles(styles)(DataEntry);

type ContainerProps = {

};

class DataEntryContainer extends React.Component<ContainerProps> {
    dataEntryInstance: DataEntry;

    getWrappedInstance() {
        return this.dataEntryInstance;
    }

    render() {
        return (
            <StylesHOC
                innerRef={(dataEntryInstance) => {
                    this.dataEntryInstance = dataEntryInstance;
                }}
                {...this.props}
            />
        );
    }
}

export default DataEntryContainer;
