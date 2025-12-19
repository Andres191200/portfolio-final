import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, message, to } = await request.json()

    // In production, you would configure this with real email credentials
    // For now, this is a placeholder configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to || 'test@hotmail.com',
      subject: `New Portfolio Contact from ${name}`,
      text: message,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    }

    // In development, just log the email details
    if (process.env.NODE_ENV === 'development') {
      console.log('Email would be sent:', mailOptions)
      return NextResponse.json({ success: true, message: 'Email logged (development mode)' })
    }

    // In production, send the actual email
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true, message: 'Email sent successfully' })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}