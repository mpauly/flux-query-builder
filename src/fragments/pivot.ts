import { FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { fluxListOfStrings } from '../base/utils';
import { FluxFieldName } from '../types/base';
import { QueryFragment } from './queryFragment';

export class PivotFragment extends QueryFragment {
  protected functionName = 'pivot';

  constructor(
    protected rowKeys: FluxFieldName[],
    protected columnKeys: FluxFieldName[],
    protected valueColumn: FluxFieldName
  ) {
    super();
  }
  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [
      ['rowKey', fluxListOfStrings(this.rowKeys)],
      ['columnKey', fluxListOfStrings(this.columnKeys)],
      ['valueColumn', fluxString(this.valueColumn)],
    ];
  }
}
