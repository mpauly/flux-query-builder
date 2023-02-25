import { FluxFields } from './base';

export const IN_KEY = '$in';
export const GT_KEY = '$gt';
export const LT_KEY = '$lt';

export interface FluxFilterOptions<TFieldType> {
  [IN_KEY]?: TFieldType[];
  [GT_KEY]?: TFieldType extends number | bigint ? TFieldType : never;
  [LT_KEY]?: TFieldType extends number | bigint ? TFieldType : never;
}
export type FluxFilterQuery<TReturnType> = {
  [K in FluxFields<TReturnType>]?: TReturnType[K] | FluxFilterOptions<TReturnType[K]>;
};
