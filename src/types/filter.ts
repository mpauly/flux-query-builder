export const IN_KEY = '$in';

export type FluxTagValue = string | number | boolean;
export type FluxFilterOptions = {
  [IN_KEY]?: FluxTagValue[];
  $gt?: number;
  $lt?: number;
};
export type FluxFilterQuery = { [field: string]: FluxTagValue | FluxFilterOptions };
