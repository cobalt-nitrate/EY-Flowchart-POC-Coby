import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text.trim();
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

export function extractTextFromTXT(buffer: Buffer): string {
  return buffer.toString('utf-8').trim();
}

export async function extractText(buffer: Buffer, mimetype: string, originalname: string): Promise<string> {
  const ext = originalname.split('.').pop()?.toLowerCase();

  if (mimetype === 'application/pdf' || ext === 'pdf') {
    return extractTextFromPDF(buffer);
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword' ||
    ext === 'docx' ||
    ext === 'doc'
  ) {
    return extractTextFromDOCX(buffer);
  }

  if (mimetype === 'text/plain' || ext === 'txt') {
    return extractTextFromTXT(buffer);
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}
