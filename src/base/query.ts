import { AggregateWindowFragment } from '../fragments/aggregateWindow';
import { DropFragment } from '../fragments/drop';
import { FilterFragment } from '../fragments/filter';
import { FromFragment } from '../fragments/from';
import { GroupFragment, ModeChoices } from '../fragments/group';
import { LimitFragment } from '../fragments/limit';
import { MapFragment } from '../fragments/map';
import { MeanFragment } from '../fragments/mean';
import { PivotFragment } from '../fragments/pivot';
import { QueryFragment } from '../fragments/queryFragment';
import { RangeFragment } from '../fragments/range';
import { SortFragment } from '../fragments/sort';
import { YieldFragment } from '../fragments/yield';
import { BucketName } from '../types/base';

type Fields<TReturnType> = Extract<keyof TReturnType, string>;
type StringFields<T> = keyof { [P in keyof T as T[P] extends string | undefined ? P : never]: boolean };

export class FluxQuery<TReturnType> {
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

  drop<TColumns extends Fields<TReturnType>>(columns: TColumns[]): FluxQuery<Omit<TReturnType, TColumns>> {
    this.fragments.push(new DropFragment(columns as string[]));
    return this;
  }

  filter(...args: ConstructorParameters<typeof FilterFragment>) {
    this.fragments.push(new FilterFragment(...args));
    return this;
  }

  group<TColumns extends keyof TReturnType>(optionalArgs?: { columns?: TColumns[]; mode?: ModeChoices }) {
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
    TRowColumns extends Fields<TReturnType>[],
    TColColumns extends Fields<TReturnType>[],
    TValColumn extends Fields<TReturnType>
  >(
    rowKeys: TRowColumns,
    columnKeys: TColColumns,
    valueColumn: TValColumn
  ): FluxQuery<
    Omit<TReturnType, TColColumns[number] | TValColumn> &
      Record<Extract<TReturnType[TColColumns[number]], string>, TReturnType[TValColumn]>
  > {
    this.fragments.push(new PivotFragment(rowKeys as string[], columnKeys as string[], valueColumn as string));
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

export function from<
  TReturnType = {
    result: '_result';
    table: number;
    _start: Date;
    _stop: Date;
    _time: Date;
    _value: number;
    _field: string;
    _measurement: string;
  }
>(name: BucketName): FluxQuery<TReturnType> {
  return new FluxQuery<TReturnType>(name);
}
