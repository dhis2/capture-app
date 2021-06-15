// @flow
import React from 'react';
// $FlowFixMe
import { connect, useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode } from './EnrollmentEventPage.const';
import { EnrollmentEventPageComponent } from './EnrollmentEventPage.component';
import { startShowEditEventDataEntry } from './EnrollmentEventPage.actions';
import type { Props } from './EnrollmentEventPage.types';

export const EnrollmentEventPagePlain = ({
    showEditEvent,
    onOpenEditEvent,
}: Props) => {
    const { programId, stageId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
        }),
        shallowEqual,
    );
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages?.values()].find(
        item => item.id === stageId,
    );

    return (
        <EnrollmentEventPageComponent
            mode={showEditEvent ? pageMode.EDIT : pageMode.VIEW}
            programStage={programStage}
            onEdit={() => onOpenEditEvent()}
        />
    );
};

const mapStateToProps = (state: ReduxState) => ({
    showEditEvent: state.viewEventPage?.eventDetailsSection?.showEditEvent,
});

const mapDispatchToProps = (dispatch: ReduxDispatch): any => ({
    onOpenEditEvent: () => {
        dispatch(startShowEditEventDataEntry());
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const EnrollmentEventPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EnrollmentEventPagePlain);
