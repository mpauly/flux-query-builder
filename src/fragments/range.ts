import { flux, fluxDateTime, fluxDuration, fluxExpression, fluxInteger, FluxParameterLike } from "@influxdata/influxdb-client";
import { FluxDurationString, QueryLine } from "../types/base";
import { QueryFragment } from "./queryFragment";

export class RangeFragment extends QueryFragment {
    protected functionName = 'range';
    constructor(protected start: bigint | Date | FluxDurationString, protected stop?: bigint | Date | FluxDurationString) {
        super()
    }

    inputToFlux(date: bigint | Date | FluxDurationString) {
        if (date instanceof Date) return fluxDateTime(date);
        if (typeof date === 'bigint') return fluxInteger(date);
        return fluxDuration(date)
    }

    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        return [
            ['start', this.inputToFlux(this.start)],
            ['stop', (this.stop === undefined) ? undefined : this.inputToFlux(this.stop)]
        ]
    }
}