import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/app/lib/auth/hooks";
import { protectedApi } from "../lib/auth/api";
import { ParsedSheetRecord } from "../types";

export function usePurchases() {
  const user = useUser();
 return useQuery<ParsedSheetRecord>({
    queryKey: ["purchases"],
    queryFn: () => protectedApi.get(`api/purchases`).then((r) => r.data),
    enabled: !!user,
  });
}


