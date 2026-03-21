import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_EXTENSIONS = ['.epub', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const authorName = formData.get('authorName') as string;
    const email = formData.get('email') as string;
    const genres = formData.get('genres') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!authorName || !email || !genres || !file) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      return NextResponse.json(
        { error: 'File must be .epub, .doc, or .docx' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File must be under 10MB' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');

    // Send email with attachment
    const { error: emailError } = await resend.emails.send({
      from: 'library@mail.briansbookcase.org',
      to: 'mckee80@gmail.com',
      subject: `Story Submission from ${authorName}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6B4226; font-size: 24px; margin-bottom: 16px;">
            New Story Submission
          </h1>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="color: #6B7280; padding: 8px 0; font-size: 14px; width: 100px;">Author</td>
              <td style="color: #374151; padding: 8px 0; font-size: 16px; font-weight: bold;">${authorName}</td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 8px 0; font-size: 14px;">Email</td>
              <td style="color: #374151; padding: 8px 0; font-size: 16px;">
                <a href="mailto:${email}" style="color: #6B4226;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 8px 0; font-size: 14px;">Genre(s)</td>
              <td style="color: #374151; padding: 8px 0; font-size: 16px;">${genres}</td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 8px 0; font-size: 14px;">File</td>
              <td style="color: #374151; padding: 8px 0; font-size: 16px;">${file.name}</td>
            </tr>
          </table>

          <p style="color: #6B7280; font-size: 14px;">
            The submitted story is attached to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: file.name,
          content: base64Content,
        },
      ],
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send submission. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit story error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
