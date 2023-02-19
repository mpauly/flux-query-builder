import { flux, fluxBool, fluxExpression, FluxParameterLike, fluxString, FluxTableColumn } from "@influxdata/influxdb-client";
import { fluxListOfStrings } from "../base/utils";
import { FieldName, QueryLine } from "../types/base";
import { QueryFragment } from "./queryFragment";

export class SortFragment extends QueryFragment implements QueryFragment {
    protected functionName = 'sort';

    constructor(protected optionalArgs: { columns?: FieldName[], desc?: boolean }) {
        super()
    }

    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        const cols = (this.optionalArgs.columns === undefined) ? undefined : fluxListOfStrings(this.optionalArgs.columns)
        return [
            ['columns', cols],
            ['desc', (this.optionalArgs.desc === undefined) ? undefined : fluxBool(this.optionalArgs.desc)]
        ]
    }
}