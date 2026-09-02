import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "sarabun-documents-original";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const fileName = file.name;
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    // Simulated storage URL (pointing to MinIO endpoint)
    const fileUrl = `/api/files/${bucket}/${fileId}-${encodeURIComponent(fileName)}`;

    return NextResponse.json({
      success: true,
      data: {
        fileId,
        fileName,
        fileSize,
        mimeType: file.type,
        bucket,
        fileUrl,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file to MinIO" },
      { status: 500 }
    );
  }
}
