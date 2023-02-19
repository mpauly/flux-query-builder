import { flux, FluxParameterLike } from "@influxdata/influxdb-client";
import { BucketName, QueryLine } from "../types/base";
import { QueryFragment } from "./queryFragment";

export class FromFragment extends QueryFragment {
    protected functionName = 'from';
    constructor(protected name: BucketName) {
        super()
    }
    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        return []
    }
    renderFlux(): QueryLine {
        return flux`from(bucket: ${this.name})`
    }
}