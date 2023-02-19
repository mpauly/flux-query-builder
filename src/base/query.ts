import { AggregateWindowFragment } from "../fragments/aggregateWindow";
import { FilterFragment } from "../fragments/filter";
import { FromFragment } from "../fragments/from";
import { MeanFragment } from "../fragments/mean";
import { PivotFragment } from "../fragments/pivot";
import { QueryFragment } from "../fragments/queryFragment";
import { RangeFragment } from "../fragments/range";
import { YieldFragment } from "../fragments/yield";
import { BucketName } from "../types/base";

class NotImplementedError extends Error { }

class FluxQuery {
    protected fragments: QueryFragment[] = [];

    constructor(name: BucketName) {
        this.fragments.push(new FromFragment(name))
    }

    renderFluxQuery(): string {
        return this.fragments.map((f) => f.renderFlux()).join('\n');
    }

    // flux functions

    aggregateWindow(...args: ConstructorParameters<typeof AggregateWindowFragment>) {
        this.fragments.push(new AggregateWindowFragment(...args));
        return this;
    }

    filter(...args: ConstructorParameters<typeof FilterFragment>): FluxQuery {
        this.fragments.push(new FilterFragment(...args));
        return this
    }

    map() {
        throw new NotImplementedError();
    }

    mean(...args: ConstructorParameters<typeof MeanFragment>) {
        this.fragments.push(new MeanFragment(...args))
        return this
    }

    pivot(...args: ConstructorParameters<typeof PivotFragment>) {
        this.fragments.push(new PivotFragment(...args));
        return this;
    }

    range(...args: ConstructorParameters<typeof RangeFragment>) {
        this.fragments.push(new RangeFragment(...args))
        return this
    }

    yield(...args: ConstructorParameters<typeof YieldFragment>) {
        this.fragments.push(new YieldFragment(...args))
        return this
    }
}

export function from(name: BucketName): FluxQuery {
    return new FluxQuery(name)
}