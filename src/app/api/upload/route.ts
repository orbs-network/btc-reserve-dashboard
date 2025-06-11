import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json(
      { error: "No file found in form data" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const blob = file as Blob;

  const cloudinaryForm = new FormData();
  cloudinaryForm.append("file", blob);
  cloudinaryForm.append("upload_preset", "excel_upload");
  cloudinaryForm.append("public_id", "excel_files/data-sheet");
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    const data = await response.json();
    console.log({data});
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


