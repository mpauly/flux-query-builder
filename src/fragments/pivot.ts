import { fluxExpression, FluxParameterLike, fluxString } from "@influxdata/influxdb-client";
import { FieldName } from "../types/base";
import { QueryFragment } from "./queryFragment";


export class PivotFragment extends QueryFragment {
    protected functionName = 'pivot';

    constructor(protected rowKeys: FieldName[], protected columnKeys: FieldName[], protected valueColumn: FieldName) {
        super()
    }
    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        return [
            ['rowKey', fluxExpression(this.rowKeys.map(fluxString).join(','))],
            ['columnKey', fluxExpression(this.columnKeys.map(fluxString).join(','))],
            ['valueColumn', fluxString(this.valueColumn)],
        ]
    }
}