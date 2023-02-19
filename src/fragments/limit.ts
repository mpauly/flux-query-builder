import { flux, fluxBool, fluxExpression, fluxInteger, FluxParameterLike, fluxString, FluxTableColumn } from "@influxdata/influxdb-client";
import { fluxListOfStrings } from "../base/utils";
import { FieldName, QueryLine } from "../types/base";
import { QueryFragment } from "./queryFragment";

export class LimitFragment extends QueryFragment implements QueryFragment {
    protected functionName = 'limit';

    constructor(protected n: bigint, protected offset?: bigint) {
        super()
    }

    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        return [
            ['n', fluxInteger(this.n)],
            ['offset', (this.offset === undefined) ? undefined : fluxInteger(this.offset)]
        ]
    }
}