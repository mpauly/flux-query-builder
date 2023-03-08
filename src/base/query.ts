import {
  Renderable,
  FromFragment,
  RawFluxFragment,
  AggregateWindowFragment,
  BottomFragment,
  CountFragment,
  DistinctFragment,
  DropFragment,
  DuplicateFragment,
  FilterFragment,
  FirstFragment,
  GroupFragment,
  ModeChoices,
  IncreaseFragment,
  KeepFragment,
  LastFragment,
  LimitFragment,
  MapFragment,
  MaxFragment,
  MeanFragment,
  MedianFragment,
  MinFragment,
  PivotFragment,
  RangeFragment,
  RenameFragment,
  SortFragment,
  SumFragment,
  TailFragment,
  TopFragment,
  UniqueFragment,
  WindowFragment,
  YieldFragment,
} from '../fragments';
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

  bottom<TColumns extends FluxFields<TReturnType>>(n: bigint, columns?: TColumns[]) {
    this.fragments.push(new BottomFragment(n, columns));
    return this;
  }

  count<TColumns extends FluxFields<TReturnType>>(column: TColumns): FluxQuery<TReturnType & { _value: bigint }> {
    this.fragments.push(new CountFragment(column));
    return this;
  }

  distinct(...args: ConstructorParameters<typeof DistinctFragment>) {
    this.fragments.push(new DistinctFragment(...args));
    return this;
  }

  drop<TColumns extends FluxFields<TReturnType>>(columns: TColumns[]): FluxQuery<Omit<TReturnType, TColumns>> {
    this.fragments.push(new DropFragment(columns));
    return this;
  }

  duplicate<TColumn extends FluxFields<TReturnType>, TNewCol extends string>(
    column: TColumn,
    as: TNewCol
  ): FluxQuery<TReturnType & Record<TNewCol, TReturnType[TColumn]>> {
    this.fragments.push(new DuplicateFragment(column, as));
    return this;
  }

  filter(filter: string | FluxFunction<any, boolean> | FluxFilterQuery<TReturnType>) {
    this.fragments.push(new FilterFragment(filter));
    return this;
  }

  first<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new FirstFragment(column));
    return this;
  }

  group<TColumns extends FluxFields<TReturnType>>(optionalArgs?: { columns?: TColumns[]; mode?: ModeChoices }) {
    this.fragments.push(new GroupFragment(optionalArgs as ConstructorParameters<typeof GroupFragment>[0]));
    return this;
  }

  increase<TColumns extends FluxFields<TReturnType>>(columns: TColumns[]) {
    this.fragments.push(new IncreaseFragment(columns));
    return this;
  }

  keep<TColumns extends FluxFields<TReturnType>>(columns: TColumns[]): FluxQuery<Pick<TReturnType, TColumns>> {
    this.fragments.push(new KeepFragment(columns));
    return this;
  }

  last<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new LastFragment(column));
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

  max<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new MaxFragment(column));
    return this;
  }

  mean<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new MeanFragment(column));
    return this;
  }

  median<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new MedianFragment(column));
    return this;
  }

  min<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new MinFragment(column));
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

  rename<TColumns extends FluxFields<TReturnType>>(columns: Record<TColumns, string>) {
    this.fragments.push(new RenameFragment(columns));
    return this;
  }

  sort<TColumns extends FluxFields<TReturnType>>(optionalArgs?: { columns?: TColumns[]; desc?: boolean }) {
    this.fragments.push(new SortFragment(optionalArgs));
    return this;
  }

  sum<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new SumFragment(column));
    return this;
  }

  tail(...args: ConstructorParameters<typeof TailFragment>) {
    this.fragments.push(new TailFragment(...args));
    return this;
  }

  top<TColumns extends FluxFields<TReturnType>>(n: bigint, columns?: TColumns[]) {
    this.fragments.push(new TopFragment(n, columns));
    return this;
  }

  unique<TColumns extends FluxFields<TReturnType>>(column?: TColumns) {
    this.fragments.push(new UniqueFragment(column));
    return this;
  }

  window(...args: ConstructorParameters<typeof WindowFragment>) {
    this.fragments.push(new WindowFragment(...args));
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
