import { fluxExpression } from "@influxdata/influxdb-client";
import { QueryLine } from "../types/base";

export class FluxFunction<InputType, ReturnType> {
    constructor(protected source: string | QueryLine) { }
    renderFlux() {
        return fluxExpression(this.source)
    }
}