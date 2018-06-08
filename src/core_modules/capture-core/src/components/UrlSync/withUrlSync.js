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

export const reservedUrlKeys = {
    ENTIRE_PARAM_STRING: 'ENTIRE_PARAM_STRING',
};

const getUrlSyncer = (
    InnerComponent: React.ComponentType<any>,
    onGetSyncSpecification: SyncSpecificationGetter,
    runOnlyOnCreate?: ?boolean) =>
    class UrlSyncer extends React.Component<Props> {
        static getValueFromParam(param: ?Array<string>, id: string) {
            let value = null;
            if (param && param.length > 0) {
                const regExp = new RegExp(`${id}=`, 'i');
                value = param[param.length - 1].replace(regExp, '').trim() || null;
            }
            return value;
        }

        constructor(props: Props) {
            super(props);
            if (runOnlyOnCreate) {
                this.updateIfOutOfSync();
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

        update(locationParams: { [key: string]: string}) {
            this.props.onUpdate(locationParams);
        }

        noUpdateRequired() {
            this.props.onNoUpdateRequired && this.props.onNoUpdateRequired();
        }

        updateIfOutOfSync() {
            const syncSpecification = onGetSyncSpecification(this.props);
            const locationParams = this.getLocationParams(syncSpecification);
            if (this.props.urlPage !== this.props.statePage ||
                this.paramsNeedsUpdate(syncSpecification, locationParams)) {
                this.update({ ...locationParams, page: this.props.urlPage });
                return true;
            }

            this.noUpdateRequired();
            return false;
        }

        render() {
            const { onUpdate, urlParams, stateParams, urlPage, statePage, ...passOnProps } = this.props;

            if (!runOnlyOnCreate) {
                const urlOutOfSync = this.updateIfOutOfSync();
                if (urlOutOfSync) {
                    return (
                        <InnerComponent
                            urlOutOfSync
                            {...passOnProps}
                        />
                    );
                }
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
export default (onGetSyncSpecification: SyncSpecificationGetter, runOnlyOnCreate?: ?boolean) =>
    (InnerComponent: React.ComponentType<any>) =>
        getUrlSyncer(InnerComponent, onGetSyncSpecification, runOnlyOnCreate);
