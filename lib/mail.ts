import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = 'https://next-auth-atuandev.vercel.app'

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA code!',
    html: `<p>Your 2FA code: ${token}</p>`
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password!',
    html: `<p>Click <a href=${resetLink}>Here</a> to reset password!</p>`
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email address!',
    html: `<p>Click <a href=${confirmLink}>Here</a> to confirm account!</p>`
  })
}
