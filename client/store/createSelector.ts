import { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & {
          use: {
              [K in keyof T & string as `use${Capitalize<K>}`]: () => T[K];
          };
      }
    : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
    _store: S
): WithSelectors<S> => {
    const store = _store as WithSelectors<S>;
    type State = ReturnType<S["getState"]>;

    const use = {} as WithSelectors<S>["use"];

    for (const k of Object.keys(store.getState()) as (keyof State & string)[]) {
        const hookName = `use${k.charAt(0).toUpperCase()}${k.slice(
            1
        )}` as keyof WithSelectors<S>["use"];

        use[hookName] = (() =>
            store((s) => s[k as keyof object])) as WithSelectors<S>["use"][typeof hookName];
        //                        ^^^^^ tell TS that s is State
    }

    store.use = use;
    return store;
};
