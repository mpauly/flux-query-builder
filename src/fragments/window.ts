import { fluxBool, fluxDuration, FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { FluxDurationString } from '../types';
import { QueryFragment } from './queryFragment';

export class WindowFragment extends QueryFragment {
  protected functionName = 'window';

  constructor(
    protected options?: {
      createEmpty?: boolean;
      every?: FluxDurationString;
      offset?: FluxDurationString;
      period?: FluxDurationString;
      startColumn?: string;
      stopColumn?: string;
      timeColumn?: string;
    }
  ) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [
      ['createEmpty', this.options?.createEmpty === undefined ? undefined : fluxBool(this.options.createEmpty)],
      ['every', this.options?.every === undefined ? undefined : fluxDuration(this.options.every)],
      ['offset', this.options?.offset === undefined ? undefined : fluxDuration(this.options.offset)],
      ['period', this.options?.period === undefined ? undefined : fluxDuration(this.options.period)],
      ['startColumn', this.options?.startColumn === undefined ? undefined : fluxString(this.options.startColumn)],
      ['stopColumn', this.options?.stopColumn === undefined ? undefined : fluxString(this.options.stopColumn)],
      ['timeColumn', this.options?.timeColumn === undefined ? undefined : fluxString(this.options.timeColumn)],
    ];
  }
}
