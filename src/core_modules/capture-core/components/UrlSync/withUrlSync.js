// @flow
/**
 * @namespace UrlSync
 */
import * as React from 'react';

type Props = {
    urlPage: string,
    statePage: string,
    urlParams?: ?string,
    stateParams: ?Object,
    onUpdate: (selections: Object) => void,
    onNoUpdateRequired?: ?() => void,
};

type SyncSpecification = {
    urlKey: string,
    propKey: string,
};
type SyncSpecificationGetter = (props: Props) => Array<SyncSpecification>;

export type UpdateDataContainer = {
    nextProps: Object,
    prevProps: Object,
    nextPage: ?string,
    prevPage: ?string,
};

export const reservedUrlKeys = {
    ENTIRE_PARAM_STRING: 'ENTIRE_PARAM_STRING',
};

const getUrlSyncer = (
    InnerComponent: React.ComponentType<any>,
    onGetSyncSpecification: SyncSpecificationGetter) =>
    class UrlSyncer extends React.Component<Props> {
        static getValueFromParam(param: ?Array<string>, id: string) {
            let value = null;
            if (param && param.length > 0) {
                const regExp = new RegExp(`${id}=`, 'i');
                value = param[param.length - 1].replace(regExp, '').trim() || null;
            }
            return value;
        }

        static getNextProps(locationParams: Object, syncSpecification: Array<SyncSpecification>) {
            const nextParams = Object
                .keys(locationParams)
                .reduce((accNextParams, locationKey) => {
                    const syncSpec = syncSpecification.find(s => s.urlKey === locationKey) || {};
                    accNextParams[syncSpec.propKey || locationKey] = locationParams[locationKey];
                    return accNextParams;
                }, {});

            return nextParams;
        }

        queuedUpdate: ?Object;
        componentDidMount() {
            this.triggerSyncCallback();
        }

        componentDidUpdate() {
            this.triggerSyncCallback();
        }

        update(updateData: UpdateDataContainer) {
            this.props.onUpdate(updateData);
        }

        noUpdateRequired() {
            this.props.onNoUpdateRequired && this.props.onNoUpdateRequired();
        }

        triggerSyncCallback() {
            if (this.queuedUpdate) {
                this.update({
                    nextProps: this.queuedUpdate.nextProps,
                    prevProps: this.props.stateParams || {},
                    nextPage: this.props.urlPage,
                    prevPage: this.props.statePage,
                });
                this.queuedUpdate = null;
            } else {
                this.noUpdateRequired();
            }
        }

        getLocationParams(syncSpecifications: Array<SyncSpecification>) {
            const urlParams = this.props.urlParams;
            return syncSpecifications
                .map((spec) => {
                    const key = spec.urlKey;
                    let value;
                    if (!urlParams) {
                        value = null;
                    } else if (key === reservedUrlKeys.ENTIRE_PARAM_STRING) {
                        value = urlParams;
                    } else {
                        const regExp = new RegExp(`${key}[^&]+`, 'i');
                        const keyParams = urlParams.match(regExp);
                        value = UrlSyncer.getValueFromParam(keyParams, key);
                    }
                    return {
                        key,
                        value,
                    };
                })
                .reduce((accParams, param) => {
                    accParams[param.key] = param.value;
                    return accParams;
                }, {});
        }

        paramsNeedsUpdate(syncSpecifications: Array<SyncSpecification>, locationParams: { [key: string]: string}) {
            return syncSpecifications
                .some((spec) => {
                    const locationValue = locationParams[spec.urlKey];
                    const propValue = (this.props.stateParams && this.props.stateParams[spec.propKey]) || null;
                    return locationValue !== propValue;
                });
        }

        isOutOfSync() {
            const syncSpecification = onGetSyncSpecification(this.props);
            const locationParams = this.getLocationParams(syncSpecification);
            if (this.props.urlPage !== this.props.statePage ||
                this.paramsNeedsUpdate(syncSpecification, locationParams)) {
                const nextProps = UrlSyncer.getNextProps(locationParams, syncSpecification);
                this.queuedUpdate = {
                    nextProps,
                };
                return true;
            }
            return false;
        }

        render() {
            const { onUpdate, urlParams, stateParams, urlPage, statePage, ...passOnProps } = this.props;

            const urlOutOfSync = this.isOutOfSync();
            if (urlOutOfSync) {
                return (
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <InnerComponent
                        urlOutOfSync
                        {...passOnProps}
                    />
                );
            }

            return (
                <InnerComponent
                    {...passOnProps}
                />
            );
        }
    };

/**
 * Compare values from the url params and the props (usually from the state) based on the sync specification. Calls onUpdate or onNoUpdateRequired accordingly. Additionally checks if the page has changed.
 * @alias withUrlSync
 * @memberof UrlSync
 * @example withUrlSync(props => [{ urlKey: 'programId', propKey: 'programId' }])([InnerComponent])
 */
export const withUrlSync = (onGetSyncSpecification: SyncSpecificationGetter) =>
    (InnerComponent: React.ComponentType<any>) =>
        getUrlSyncer(InnerComponent, onGetSyncSpecification);
