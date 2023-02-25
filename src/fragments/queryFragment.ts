import { flux, fluxExpression, FluxParameterLike } from '@influxdata/influxdb-client';
import { FluxQueryLine } from '../types/base';

export interface Renderable {
  renderFlux(): FluxQueryLine;
}

export abstract class QueryFragment implements Renderable {
  protected abstract functionName: string;

  protected abstract collectArgs(): [string, FluxParameterLike | undefined][];

  renderFlux(): FluxQueryLine {
    const args = this.collectArgs();
    const renderedArgs = this.renderArgs(args);

    return fluxExpression(`|> ${fluxExpression(this.functionName)}(${fluxExpression(renderedArgs.join(', '))})`);
  }

  protected renderArgs(args: [string, any][]) {
    return args
      .filter(([_field, val]) => val !== undefined)
      .map(([field, val]) => fluxExpression(flux`${fluxExpression(field)}: ${val}`));
  }
}
