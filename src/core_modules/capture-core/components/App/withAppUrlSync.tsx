import * as React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import type { ParsedQuery } from 'query-string';
import { paramsSelector } from './appSync.selectors';
import { LoadingMaskForPage } from '../LoadingMasks';
import { viewEventFromUrl } from '../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { updateSelectionsFromUrl } from '../LockedSelector';
import type { UpdateDataContainer } from '../UrlSync/withUrlSync';
import { pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';
import type { Props, ReduxState, ReduxDispatch } from './withAppUrlSync.types';

export const pageKeys = {
    MAIN: '',
    VIEW_EVENT: 'viewEvent',
    SEARCH: 'search',
    NEW: 'new',
    ENROLLMENT_EVENT_NEW: 'enrollmentEventNew',
    ENROLLMENT_EVENT: 'enrollmentEventEdit',
};

const programIdParameter = {
    urlParameterName: 'programId',
};
const orgUnitIdParameter = {
    urlParameterName: 'orgUnitId',
};
const tetIdParameter = {
    urlParameterName: 'trackedEntityTypeId',
};
const eventIdParameter = {
    urlParameterName: 'viewEventId',
};

const specificationForPages = {
    [pageKeys.MAIN]: [programIdParameter, orgUnitIdParameter],
    [pageKeys.VIEW_EVENT]: [eventIdParameter],
    [pageKeys.SEARCH]: [programIdParameter, orgUnitIdParameter],
    [pageKeys.NEW]: [programIdParameter, orgUnitIdParameter, tetIdParameter],
};

const updaterForPages = {
    [pageKeys.MAIN]: updateSelectionsFromUrl,
    [pageKeys.SEARCH]: updateSelectionsFromUrl,
    [pageKeys.NEW]: updateSelectionsFromUrl,
    [pageKeys.VIEW_EVENT]: viewEventFromUrl,
    [pageKeys.ENROLLMENT_EVENT_NEW]: updateSelectionsFromUrl,
    [pageKeys.ENROLLMENT_EVENT]: viewEventFromUrl,
};

/**
 * Provides data for withUrlSync and calls an update action if not in sync (based on the page)
 * @alias withAppUrlSync
 * @memberof UrlSync
 * @function
 */
export const withAppUrlSync = () => (InnerComponent: React.ComponentType<any>) => {
    class AppUrlSyncer extends React.Component<Props> {
        params?: ParsedQuery;
        page = '';

        handleUpdate = (updateData: UpdateDataContainer) => {
            this.props.onUpdateFromUrl(this.page, updateData);
        }

        getSyncSpecification() {
            const page = this.page || pageKeys.MAIN;
            return specificationForPages[page] || [];
        }

        setPageAndParams() {
            const { location } = this.props;
            this.page = location.pathname.substring(1);
            this.params = queryString.parse(location?.search);
        }


        render() {
            const {
                location,
                onUpdateFromUrl,
                locationSwitchInProgress,
                params,
                page,
                ...passOnProps
            } = this.props;

            if (locationSwitchInProgress) {
                return (
                    <LoadingMaskForPage />
                );
            }

            this.setPageAndParams();

            return (
                <InnerComponent
                    statePage={page ?? pageKeys.MAIN}
                    urlPage={this.page}
                    urlParams={this.params}
                    onUpdate={this.handleUpdate}
                    syncSpecification={this.getSyncSpecification()}
                    stateParams={params}
                    {...passOnProps}
                />
            );
        }
    }

    const mapStateToProps = (state: ReduxState) => ({
        params: paramsSelector(state),
        page: state.app.page,
        locationSwitchInProgress: state.app.locationSwitchInProgress,
    });

    const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
        onUpdateFromUrl: (page: string | undefined, updateData: UpdateDataContainer) => {
            if (pageFetchesOrgUnitUsingTheOldWay(page) && page != null) {
                dispatch(updaterForPages[page](updateData));
            }
        },
    });

    const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(AppUrlSyncer);
    return ConnectedComponent as React.ComponentType<any>;
};
