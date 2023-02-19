import { AggregateWindowFragment } from '../fragments/aggregateWindow';
import { DropFragment } from '../fragments/drop';
import { FilterFragment } from '../fragments/filter';
import { FromFragment } from '../fragments/from';
import { GroupFragment } from '../fragments/group';
import { LimitFragment } from '../fragments/limit';
import { MapFragment } from '../fragments/map';
import { MeanFragment } from '../fragments/mean';
import { PivotFragment } from '../fragments/pivot';
import { QueryFragment } from '../fragments/queryFragment';
import { RangeFragment } from '../fragments/range';
import { SortFragment } from '../fragments/sort';
import { YieldFragment } from '../fragments/yield';
import { BucketName } from '../types/base';

class FluxQuery {
  protected fragments: QueryFragment[] = [];

  constructor(name: BucketName) {
    this.fragments.push(new FromFragment(name));
  }

  renderFluxQuery(): string {
    return this.fragments.map((f) => f.renderFlux()).join('\n');
  }

  // flux functions

  aggregateWindow(...args: ConstructorParameters<typeof AggregateWindowFragment>) {
    this.fragments.push(new AggregateWindowFragment(...args));
    return this;
  }

  drop(...args: ConstructorParameters<typeof DropFragment>) {
    this.fragments.push(new DropFragment(...args));
    return this;
  }

  filter(...args: ConstructorParameters<typeof FilterFragment>): FluxQuery {
    this.fragments.push(new FilterFragment(...args));
    return this;
  }

  group(...args: ConstructorParameters<typeof GroupFragment>) {
    this.fragments.push(new GroupFragment(...args));
    return this;
  }

  limit(...args: ConstructorParameters<typeof LimitFragment>) {
    this.fragments.push(new LimitFragment(...args));
    return this;
  }

  map(...args: ConstructorParameters<typeof MapFragment>) {
    this.fragments.push(new MapFragment(...args));
    return this;
  }

  mean(...args: ConstructorParameters<typeof MeanFragment>) {
    this.fragments.push(new MeanFragment(...args));
    return this;
  }

  pivot(...args: ConstructorParameters<typeof PivotFragment>) {
    this.fragments.push(new PivotFragment(...args));
    return this;
  }

  range(...args: ConstructorParameters<typeof RangeFragment>) {
    this.fragments.push(new RangeFragment(...args));
    return this;
  }

  sort(...args: ConstructorParameters<typeof SortFragment>) {
    this.fragments.push(new SortFragment(...args));
    return this;
  }

  yield(...args: ConstructorParameters<typeof YieldFragment>) {
    this.fragments.push(new YieldFragment(...args));
    return this;
  }
}

export function from(name: BucketName): FluxQuery {
  return new FluxQuery(name);
}
