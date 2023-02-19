import { flux, fluxExpression, FluxParameterLike, fluxString, FluxTableColumn } from "@influxdata/influxdb-client";
import { fluxListOfStrings } from "../base/utils";
import { FieldName, QueryLine } from "../types/base";
import { QueryFragment } from "./queryFragment";

type ModeChoices = 'by' | 'except'

export class GroupFragment extends QueryFragment implements QueryFragment {
    protected functionName = 'group';

    constructor(protected optionalArgs?: { columns?: FieldName[], mode?: ModeChoices }) {
        super()
    }

    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        const cols = (this.optionalArgs?.columns === undefined) ? undefined : fluxListOfStrings(this.optionalArgs.columns)
        return [
            ['columns', cols],
            ['mode', (this.optionalArgs?.mode === undefined) ? undefined : fluxString(this.optionalArgs.mode)]
        ]
    }
}