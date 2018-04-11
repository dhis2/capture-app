// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { updateMainSelections } from './mainSelections.actions';

type Props = {
    programId: ?string,
    orgUnitId: ?string,
    match: {
        params: {
            keys?: string,
        }
    },
    onUpdateSelections: (selections: Object) => void
};

const getMainPage = (InnerComponent: React.ComponentType<any>) =>
    class MainPage extends React.Component<Props> {
        static getValueFromParam(param: ?Array<string>, id: string) {
            let value = null;
            if (param && param.length > 0) {
                const regExp = new RegExp(`${id}=`, 'i');
                value = param[param.length - 1].replace(regExp, '').trim() || null;
            }
            return value;
        }

        getLocationParams() {
            let programId = null;
            let orgUnitId = null;

            const matchParams = this.props.match.params.keys;

            if (matchParams) {
                const programParam = matchParams.match(/programId[^&]+/i);
                const orgUnitParam = matchParams.match(/orgUnitId[^&]+/i);
                programId = MainPage.getValueFromParam(programParam, 'programId');
                orgUnitId = MainPage.getValueFromParam(orgUnitParam, 'orgUnitId');
            }

            return { programId, orgUnitId };
        }

        needsUpdate(paramProgramId: ?string, paramOrgUnitId: ?string) {
            const stateProgramId = this.props.programId || null;
            const stateOrgUnitId = this.props.orgUnitId || null;

            return stateProgramId !== paramProgramId || stateOrgUnitId !== paramOrgUnitId;
        }

        update(paramProgramId: ?string, paramOrgUnitId: ?string) {
            this.props.onUpdateSelections({
                programId: paramProgramId,
                orgUnitId: paramOrgUnitId,
            });
        }

        render() {
            const { programId: paramProgramId, orgUnitId: paramOrgUnitId } = this.getLocationParams();
            if (this.needsUpdate(paramProgramId, paramOrgUnitId)) {
                this.update(paramProgramId, paramOrgUnitId);
                return null;
            }

            const { match, onUpdateSelections, ...passOnProps } = this.props;

            return (
                <InnerComponent
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState) => ({
    programId: state.currentSelections.programId,
    orgUnitId: state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateSelections: (selections: Object) => {
        dispatch(updateMainSelections(selections));
    },
});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(mapStateToProps, mapDispatchToProps)(getMainPage(InnerComponent));
