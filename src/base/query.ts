import { AggregateWindowFragment } from '../fragments/aggregateWindow';
import { DropFragment } from '../fragments/drop';
import { FilterFragment } from '../fragments/filter';
import { FromFragment } from '../fragments/from';
import { GroupFragment, ModeChoices } from '../fragments/group';
import { LimitFragment } from '../fragments/limit';
import { MapFragment } from '../fragments/map';
import { MeanFragment } from '../fragments/mean';
import { PivotFragment } from '../fragments/pivot';
import { Renderable } from '../fragments/queryFragment';
import { RangeFragment } from '../fragments/range';
import { RawFluxFragment } from '../fragments/rawFlux';
import { SortFragment } from '../fragments/sort';
import { YieldFragment } from '../fragments/yield';
import { FluxBucketName, FluxFields, FluxFieldTypes } from '../types/base';
import { FluxFilterQuery } from '../types/filter';
import { FluxFunction } from './function';

export class FluxQuery<TReturnType extends Record<string, FluxFieldTypes | Date>> {
  protected fragments: Renderable[] = [];

  constructor(name: FluxBucketName) {
    this.fragments.push(new FromFragment(name));
  }

  renderFluxQuery(): string {
    return this.fragments.map((f) => f.renderFlux()).join('\n');
  }

  rawFlux<TReturn extends Record<string, FluxFieldTypes | Date> = TReturnType>(
    ...args: ConstructorParameters<typeof RawFluxFragment>
  ): FluxQuery<TReturn> {
    this.fragments.push(new RawFluxFragment(...args));
    return this as FluxQuery<TReturn>;
  }

  // flux functions

  aggregateWindow(...args: ConstructorParameters<typeof AggregateWindowFragment>) {
    this.fragments.push(new AggregateWindowFragment(...args));
    return this;
  }

  drop<TColumns extends FluxFields<TReturnType>>(columns: TColumns[]): this {
    this.fragments.push(new DropFragment(columns as string[]));
    return this;
  }

  filter(filter: string | FluxFunction<any, boolean> | FluxFilterQuery<TReturnType>) {
    this.fragments.push(new FilterFragment(filter));
    return this;
  }

  group<TColumns extends FluxFields<TReturnType>>(optionalArgs?: { columns?: TColumns[]; mode?: ModeChoices }) {
    this.fragments.push(new GroupFragment(optionalArgs as ConstructorParameters<typeof GroupFragment>[0]));
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

  pivot<
    TRowColumns extends FluxFields<TReturnType>[],
    TColColumns extends FluxFields<TReturnType>[],
    TValColumn extends FluxFields<TReturnType>
  >(rowKeys: TRowColumns, columnKeys: TColColumns, valueColumn: TValColumn): this {
    this.fragments.push(new PivotFragment(rowKeys as string[], columnKeys as string[], valueColumn as string));
    return this;
  }

  range(...args: ConstructorParameters<typeof RangeFragment>) {
    this.fragments.push(new RangeFragment(...args));
    return this;
  }

  sort<TColumns extends FluxFields<TReturnType>>(optionalArgs?: { columns?: TColumns[]; desc?: boolean }) {
    this.fragments.push(new SortFragment(optionalArgs));
    return this;
  }

  yield<TKey extends string = '_results', TValueType = FluxFieldTypes>(
    name?: TKey
  ): FluxQuery<TReturnType & { TKey: TValueType }> {
    this.fragments.push(new YieldFragment(name));
    return this;
  }
}

export function from<
  TReturnType extends Record<string, FluxFieldTypes | Date> = {
    result: '_result';
    table: number;
    _start: Date;
    _stop: Date;
    _time: Date;
    _value: FluxFieldTypes;
    _field: string;
    _measurement: string;
  } & Record<string, string>
>(name: FluxBucketName): FluxQuery<TReturnType> {
  return new FluxQuery<TReturnType>(name);
}
