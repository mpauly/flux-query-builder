import { flux, fluxExpression, FluxParameterLike } from "@influxdata/influxdb-client";
import { FluxFunction } from "../base/function";
import { QueryLine } from "../types/base";
import { FluxFilterOptions, FluxFilterQuery, FluxTagValue, IN_KEY } from "../types/filter";
import { QueryFragment } from "./queryFragment";

export class FilterFragment extends QueryFragment {
    protected functionName = 'filter';

    constructor(protected filter: string | FluxFunction<any, boolean> | FluxFilterQuery) {
        super()
    }

    buildFieldFilter(field: string, value: FluxTagValue | FluxFilterOptions) {
        if (typeof value === 'object') {
            if (value[IN_KEY]) {
                const set = value[IN_KEY]?.map((v) => flux`${v}`).join(', ')
                return flux`contains(value: r[${field}], set: [${fluxExpression(set)}])`
            }
        }
        return flux`r[${field}] == ${value}`
    }

    buildFilterFunction(filters: FluxFilterQuery, concat: 'and' | 'or' = 'and'): FluxFunction<any, boolean> {
        const filterString = Object.entries(filters).map(([key, value]) => this.buildFieldFilter(key, value)).join(` ${concat} `)
        const fluxQuery = flux`(r) => ${fluxExpression(filterString)}`;
        return new FluxFunction<any, boolean>(fluxQuery)
    }

    buildFilter(filter: string | FluxFunction<any, boolean> | FluxFilterQuery): FluxFunction<any, boolean> {
        if (typeof filter === 'string') {
            return this.buildFilter(new FluxFunction<any, boolean>(filter));
        }
        if (filter instanceof FluxFunction) {
            return filter
        }
        return this.buildFilterFunction(filter);
    }

    protected collectArgs(): [string, FluxParameterLike | undefined][] {
        const filterFunction = this.buildFilter(this.filter)
        return [
            ['fn', filterFunction.renderFlux()]
        ]
    }
}