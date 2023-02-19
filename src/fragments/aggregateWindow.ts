import {
  fluxBool,
  fluxDuration,
  fluxExpression,
  FluxParameterLike,
  fluxString,
  FluxTableColumn,
} from '@influxdata/influxdb-client';
import { FluxFunction } from '../base/function';
import { FluxDurationString, FluxFunctionName } from '../types/base';
import { QueryFragment } from './queryFragment';

export class AggregateWindowFragment extends QueryFragment {
  protected functionName = 'aggregateWindow';

  constructor(
    protected every: FluxDurationString,
    protected fn: FluxFunctionName | FluxFunction<any, any>,
    protected optionalArgs: {
      column?: FluxTableColumn;
      timeSrc?: FluxTableColumn;
      timeDst?: FluxTableColumn;
      createEmpty?: boolean;
      offset?: FluxDurationString;
    }
  ) {
    super();
  }
  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [
      ['every', fluxDuration(this.every)],
      ['fn', this.fn instanceof FluxFunction ? this.fn.renderFlux() : fluxExpression(this.fn)],
      ['offset', this.optionalArgs.offset === undefined ? undefined : fluxDuration(this.optionalArgs.offset)],
      ['timeSrc', this.optionalArgs.timeSrc === undefined ? undefined : fluxString(this.optionalArgs.timeSrc)],
      ['timeDst', this.optionalArgs.timeDst === undefined ? undefined : fluxString(this.optionalArgs.timeDst)],
      [
        'createEmpty',
        this.optionalArgs.createEmpty === undefined ? undefined : fluxBool(this.optionalArgs.createEmpty),
      ],
    ];
  }
}
