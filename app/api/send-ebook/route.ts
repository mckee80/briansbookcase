import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { ebookId, deviceEmail, userId } = await request.json();

    if (!ebookId || !deviceEmail || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch the ebook details
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .single();

    if (ebookError || !ebook) {
      return NextResponse.json(
        { error: 'Ebook not found' },
        { status: 404 }
      );
    }

    if (!ebook.download_url) {
      return NextResponse.json(
        { error: 'Download URL not available' },
        { status: 400 }
      );
    }

    // Fetch the file from Supabase Storage
    const fileName = ebook.download_url.split('/').pop();
    const { data: fileData, error: fileError } = await supabase.storage
      .from('ebooks')
      .download(fileName);

    if (fileError || !fileData) {
      return NextResponse.json(
        { error: 'Failed to retrieve ebook file' },
        { status: 500 }
      );
    }

    // Convert the file to base64 for email attachment
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString('base64');

    // Send the email with the ebook attachment
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'library@mail.briansbookcase.org',
      to: deviceEmail,
      subject: `Your ebook: ${ebook.title}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6B4226; font-size: 24px; margin-bottom: 16px;">
            Thank you for downloading from Brian's Bookcase!
          </h1>

          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
            We're delighted to send you <strong>${ebook.title}</strong> by ${ebook.author}.
          </p>

          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
            Your ebook is attached to this email. Simply open the attachment on your device to start reading.
          </p>

          <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0;">
            <p style="color: #92400E; font-size: 14px; margin: 0;">
              All proceeds from Brian's Bookcase support mental health initiatives.
              Thank you for being part of our mission to save lives through stories.
            </p>
          </div>

          <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
            Happy reading,<br>
            The Brian's Bookcase Team
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${ebook.title.replace(/[^a-z0-9]/gi, '_')}.${fileName.split('.').pop()}`,
          content: base64Content,
        },
      ],
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update user metadata with device email
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { device_email: deviceEmail },
      }
    );

    if (updateError) {
      console.warn('Failed to update user metadata:', updateError);
      // Don't fail the request if metadata update fails
    }

    return NextResponse.json({ success: true, emailId: emailData?.id });
  } catch (error) {
    console.error('Send ebook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
