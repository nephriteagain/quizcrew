import { useRoute } from "@react-navigation/native";
import { DependencyList, EffectCallback, useEffect } from "react";

export function useEffectLogRoute(effectFn: EffectCallback, deps: DependencyList) {
    const route = useRoute();

    useEffect(() => {
        console.log(`effect ${route.name}`);
        return effectFn();
    }, deps);
}
