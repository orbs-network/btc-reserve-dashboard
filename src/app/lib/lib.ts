import { useMutation } from "@tanstack/react-query";
import { protectedApi } from "./auth/api";
import { toast } from "sonner";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file); //

      const res = await protectedApi.post("/api/upload", formData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload file");
    },
  });
};
