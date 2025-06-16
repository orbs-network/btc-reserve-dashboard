import { useQuery } from "@tanstack/react-query";
import { protectedApi } from "../lib/api";
import { ParsedSheetRecord } from "../types";
import { useUser } from "./use-user";

const FOLDER_ID = {
  "denis@orbs.com": "1Ql_MhXJ9wmzdnRH8tEigROD3sbBq3TPS",
};

const getFolderId = (email: string) => {
  return FOLDER_ID[email as keyof typeof FOLDER_ID];
};

export function usePurchases() {
  const { user } = useUser();
  return useQuery<ParsedSheetRecord>({
    queryKey: ["purchases", user?.email],
    queryFn: async () => {
      const url = `https://www.googleapis.com/drive/v3/files?q='${getFolderId(
        user!.email
      )}' in parents&fields=files(id,name,mimeType,modifiedTime)&orderBy=modifiedTime desc`;

      const id = await protectedApi
        .get(url)
        .then((res) => res.data.files[0].id);

      const response = await protectedApi.get(
        `https://www.googleapis.com/drive/v3/files/${id}?alt=media`
      );

      return response.data;
    },
    enabled: !!user,
  });
}
