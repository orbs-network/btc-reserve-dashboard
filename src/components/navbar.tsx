import React, { useCallback } from "react";
import OrbsLogo from "@/assets/orbs-logo.svg";
import Image from "next/image";
import { Button } from "./ui/button";
import { LogOut, Upload } from "lucide-react";
import { useLogout, useUser } from "@/app/lib/auth/hooks";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useUploadFile } from "@/app/lib/lib";
import { Spinner } from "./ui/spinner";

const UploadCSV = () => {
  const user = useUser();
  const { mutate: uploadFile, isPending } = useUploadFile();
//   if (!user?.isAdmin) return null

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      uploadFile(acceptedFiles[0]);
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-[16px] font-[500] text-muted-foreground flex items-center gap-2"
        >
          <Upload />
          <p>Upload</p>
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogTitle>Upload CSV</DialogTitle>

      <div className="h-[250px]">
      {isPending ? (
          <div className="flex justify-center h-full flex-col items-center gap-4">
            <Spinner className="w-[100px] h-[100px] border-6" />
            <p className="text-[16px] font-[600] text-muted-foreground">
              Uploading file...
            </p>
          </div>
        ) : (
          <div
            {...getRootProps()}
            style={{
              textAlign: "center",
              backgroundColor: isDragActive ? "#e3e7ff" : "#fbeeff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="h-[100%]"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-[16px] font-[500] text-muted-foreground">
                Drop the file here...
              </p>
            ) : (
              <p className="text-[16px] font-[500] text-muted-foreground">
                Upload Excel file
              </p>
            )}
          </div>
        )}
      </div>
      </DialogContent>
    </Dialog>
  );
};

export function Navbar() {
  const logout = useLogout();
  return (
    <div className="h-[64px] flex items-center border-b border-[#EAECF0] justify-center">
      <div className="max-w-[1400px] pl-6 pr-6 flex items-center justify-between w-full">
        <Image src={OrbsLogo} alt="Orbs Logo" height={20} />
        <div className="flex items-center gap-2">
          <UploadCSV />
          <Button
            onClick={logout}
            variant="ghost"
            className="text-[16px] font-[500] text-muted-foreground flex items-center gap-2"
          >
            <LogOut />
            <p>Logout</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
