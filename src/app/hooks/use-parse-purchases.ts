import { useMutation } from "@tanstack/react-query";
import { parseAndDownloadPurchases } from "../lib/lib";
import { toast } from "sonner";

export const useParseExcel = () => {
    return useMutation({
      mutationFn: async (file: File) => {
        return parseAndDownloadPurchases(file);
      },
      onSuccess: () => {
        toast.success("Purchases downloaded successfully");
      },
      onError: (error) => {
        toast.error("Failed to download purchases");
        console.log(error);
      },
    });
  };
  