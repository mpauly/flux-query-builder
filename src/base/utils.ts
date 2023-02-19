import { fluxExpression, fluxString } from '@influxdata/influxdb-client';

export function fluxListOfStrings(listOfStr: any[]) {
  return fluxExpression(`[${fluxExpression(listOfStr.map(fluxString).join(', '))}]`);
}
