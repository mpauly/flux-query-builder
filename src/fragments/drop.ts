import { flux, fluxExpression, FluxParameterLike, fluxString, FluxTableColumn } from "@influxdata/influxdb-client";
import { fluxListOfStrings } from "../base/utils";
import { FieldName, QueryLine } from "../types/base";
import { QueryFragment } from "./queryFragment";

export class DropFragment extends QueryFragment implements QueryFragment {
    protected functionName = 'drop';

    constructor(protected columns: FieldName[]) {
        super()
    }

    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        return [
            ['columns', fluxListOfStrings(this.columns)]
        ]
    }
}