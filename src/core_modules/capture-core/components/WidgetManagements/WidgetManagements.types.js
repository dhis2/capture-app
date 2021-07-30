// @flow

export type Props = {|
    enrollmentId: string,
|}

type Notes = {|
    id: string,
    message: string,
|}

export type Management = {|
    id: string,
    status: string,
    displayName: string,
    reason?: ?string,
    performed: string,
    generationdate: string,
    priority: string,
    notes?: ?Array<Notes>
|}

