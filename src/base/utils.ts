import { fluxExpression, fluxString } from '@influxdata/influxdb-client';

export function fluxListOfStrings(listOfStr: string[]) {
  return fluxExpression(`[${fluxExpression(listOfStr.map(fluxString).join(', '))}]`);
}
