// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { paramsSelector } from './appSync.selectors';
import { LoadingMaskForPage } from '../LoadingMasks';
import { viewEventFromUrl } from '../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { updateSelectionsFromUrl } from '../LockedSelector';
import { reservedUrlKeys } from '../UrlSync/withUrlSync';
import type { UpdateDataContainer } from '../UrlSync/withUrlSync';
import { startFetchingEnrollmentPageInformationFromUrl } from '../Pages/Enrollment/EnrollmentPage.actions';

type Props = {
    location: {
        pathname: string,
    },
    onUpdateFromUrl: (page: ?string, data: UpdateDataContainer) => void,
    params: Object,
    page: ?string,
    locationSwitchInProgress: ?boolean,
};

export const pageKeys = {
    MAIN: '',
    NEW_EVENT: 'newEvent',
    VIEW_EVENT: 'viewEvent',
    SEARCH: 'search',
    NEW: 'new',
    ENROLLMENT: 'enrollment',
};

const programIdProperties = {
    urlKey: 'programId',
    propKey: 'programId',
};
const orgUnitIdProperties = {
    urlKey: 'orgUnitId',
    propKey: 'orgUnitId',
};
const trackedEntityTypeIdProperties = {
    urlKey: 'trackedEntityTypeId',
    propKey: 'trackedEntityTypeId',
};
const enrollmentIdProperties = {
    urlKey: 'enrollmentId',
    propKey: 'enrollmentId',
};
const teiIdProperties = {
    urlKey: 'teiId',
    propKey: 'teiId',
};

const specificationForPages = {
    [pageKeys.MAIN]: [
        programIdProperties,
        orgUnitIdProperties,
    ],
    [pageKeys.NEW_EVENT]: [
        programIdProperties,
        orgUnitIdProperties,
    ],
    [pageKeys.VIEW_EVENT]: [
        {
            urlKey: reservedUrlKeys.ENTIRE_PARAM_STRING,
            propKey: 'viewEventId',
        },
    ],
    [pageKeys.SEARCH]: [
        programIdProperties,
        orgUnitIdProperties,
    ],
    [pageKeys.NEW]: [
        programIdProperties,
        orgUnitIdProperties,
        trackedEntityTypeIdProperties,
    ],
    [pageKeys.ENROLLMENT]: [
        programIdProperties,
        orgUnitIdProperties,
        enrollmentIdProperties,
        teiIdProperties,
    ],
};

const updaterForPages = {
    [pageKeys.MAIN]: updateSelectionsFromUrl,
    [pageKeys.NEW_EVENT]: updateSelectionsFromUrl,
    [pageKeys.SEARCH]: updateSelectionsFromUrl,
    [pageKeys.NEW]: updateSelectionsFromUrl,
    [pageKeys.VIEW_EVENT]: viewEventFromUrl,
    [pageKeys.ENROLLMENT]: updateSelectionsFromUrl,
};

const getUrlParts = (pathName: string) => {
    const urlParts = pathName.match(/[/][^/]+/g);

    if (urlParts == null) {
        return [];
    }

    return urlParts
        .map(part => part.substring(1));
};

/**
 * Provides data for withUrlSync and calls an update action if not in sync (based on the page)
 * @alias withAppUrlSync
 * @memberof UrlSync
 * @function
 */
export const withAppUrlSync = () => (InnerComponent: React.ComponentType<any>) => {
    class AppUrlSyncer extends React.Component<Props> {
        params: ?string;
        page: string;

        handleUpdate = (updateData: UpdateDataContainer) => {
            this.props.onUpdateFromUrl(this.page, updateData);
        }

        getSyncSpecification() {
            const page = this.page || pageKeys.MAIN;
            return specificationForPages[page] || [];
        }

        setPageAndParams() {
            const urlParts = getUrlParts(this.props.location.pathname);

            if (urlParts.length === 0) {
                this.page = pageKeys.MAIN;
                this.params = null;
                return;
            }

            if (urlParts.length === 1) {
                const singlePart = urlParts[0];
                if (
                    Object
                        .keys(pageKeys)
                        .map(key => pageKeys[key])
                        .includes(singlePart)
                ) {
                    this.page = singlePart;
                    this.params = null;
                } else {
                    this.params = singlePart;
                    this.page = pageKeys.MAIN;
                }
            } else {
                this.page = urlParts[0];
                this.params = urlParts[1];
            }
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
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    statePage={page || pageKeys.MAIN}
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
        onUpdateFromUrl: (page: ?string, updateData: UpdateDataContainer) =>
            page != null && dispatch(updaterForPages[page](updateData)),
    });

    // $FlowFixMe[missing-annot] automated comment
    return connect(mapStateToProps, mapDispatchToProps)(AppUrlSyncer);
};
