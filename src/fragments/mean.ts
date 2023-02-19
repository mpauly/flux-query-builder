import { flux, FluxParameterLike } from "@influxdata/influxdb-client";
import { QueryLine } from "../types/base";
import { QueryFragment } from "./queryFragment";

export class MeanFragment extends QueryFragment {
    protected functionName = 'mean';
    constructor() {
        super()
    }
    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        return []
    }
}