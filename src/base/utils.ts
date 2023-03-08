import { fluxExpression, fluxString } from '@influxdata/influxdb-client';

export function fluxListOfStrings(listOfStr: any[]) {
  return fluxExpression(`[${fluxExpression(listOfStr.map(fluxString).join(', '))}]`);
}

export function fluxDict(dict: { [key: string]: string }) {
  return fluxExpression(
    `{ ${Object.entries(dict)
      .map(([key, val]) => `${key}: ${fluxString(val)}`)
      .join(', ')} }`
  );
}
