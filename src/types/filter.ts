import { Fields } from './base';

export const IN_KEY = '$in';

export type FluxTagValue = string | number | boolean;
export interface FluxFilterOptions<TFieldType> {
  [IN_KEY]?: TFieldType[];
  $gt?: TFieldType extends number | bigint ? TFieldType : never;
  $lt?: TFieldType extends number | bigint ? TFieldType : never;
}
export type FluxFilterQuery<TReturnType> = {
  [K in Fields<TReturnType>]?: TReturnType[K] | FluxFilterOptions<TReturnType[K]>;
};
