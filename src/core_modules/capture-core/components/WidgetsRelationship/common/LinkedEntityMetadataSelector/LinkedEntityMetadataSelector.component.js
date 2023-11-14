// @flow
import React from 'react';
import { Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { PlainProps, LinkedEntityMetadata, Side } from './linkedEntityMetadataSelector.types';

const styles = {
    container: {
        padding: spacers.dp16,
        paddingTop: 0,
    },
    typeSelector: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp8,
        marginBottom: spacers.dp16,
    },
    selectorButton: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp4,
        marginBottom: spacers.dp8,
    },
    title: {
        fontWeight: 500,
        marginBottom: spacers.dp4,
    },
    buttonContainer: {
        display: 'flex',
        gap: spacers.dp8,
    },
};

export const LinkedEntityMetadataSelectorPlain = <TLinkedEntityMetadata: LinkedEntityMetadata, TSide: Side>({
    applicableTypesInfo,
    onSelectLinkedEntityMetadata,
    classes }: PlainProps<TLinkedEntityMetadata, TSide>) => (
        <div className={classes.container}>
            <div className={classes.typeSelector}>
                {applicableTypesInfo.map(({ id, name, sides }) => (
                    <div
                        key={id}
                        className={classes.selectorButton}
                    >
                        <div className={classes.title}>
                            {name}
                        </div>
                        <div>
                            <div className={classes.buttonContainer}>
                                {sides.map((side: TSide) => (
                                    <Button
                                        key={`${id}-${side.targetSide}`}
                                        // $FlowFixMe
                                        onClick={() => onSelectLinkedEntityMetadata({
                                            ...side,
                                            relationshipId: id,
                                        })}
                                        secondary
                                    >
                                        {side.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );


export const LinkedEntityMetadataSelector =
    withStyles(styles)(LinkedEntityMetadataSelectorPlain);
