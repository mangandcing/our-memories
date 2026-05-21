function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f4f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1a1a2e;padding:28px 40px;border-radius:10px 10px 0 0;text-align:center;">
<div style="font-size:24px;font-weight:700;color:#d4af37;letter-spacing:1px;">Our Memories</div>
<div style="font-size:11px;color:#8888aa;text-transform:uppercase;letter-spacing:3px;margin-top:4px;">our-memories.store</div>
</td></tr>
<tr><td style="background:#ffffff;padding:40px;">${content}</td></tr>
<tr><td style="background:#fafaf7;padding:20px 40px;border-radius:0 0 10px 10px;border-top:1px solid #eeeeea;text-align:center;">
<p style="margin:0;font-size:12px;color:#999999;">© 2025 Our Memories &nbsp;·&nbsp; <a href="https://our-memories.store" style="color:#d4af37;text-decoration:none;">our-memories.store</a></p>
<p style="margin:6px 0 0;font-size:11px;color:#bbbbbb;">Need help? <a href="https://t.me/ourmemories" style="color:#d4af37;text-decoration:none;">Contact us on Telegram</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export function contentRejectedEmail(params: {
  customerName: string
  pageTitle: string
  flaggedSections: string[]
  reason: string
  editorUrl: string
}): string {
  const { customerName, pageTitle, flaggedSections, reason, editorUrl } = params

  const sectionsHtml = flaggedSections.length > 0
    ? `<ul style="margin:0 0 0;padding-left:20px;font-size:14px;color:#555555;line-height:1.8;">
${flaggedSections.map(s => `<li>${s}</li>`).join('\n')}
</ul>`
    : `<p style="margin:0;font-size:14px;color:#555555;">Please review all sections of your page.</p>`

  const content = `
<h2 style="margin:0 0 8px;font-size:22px;color:#1a1a2e;">Content Review — Changes Needed</h2>
<p style="margin:0 0 24px;font-size:15px;color:#555555;">Hi ${customerName}, our team has reviewed your page <strong>${pageTitle}</strong> and found a few things that need to be updated before we can publish it.</p>

${flaggedSections.length > 0 ? `<h3 style="margin:0 0 10px;font-size:15px;color:#1a1a2e;">Sections that need attention</h3>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf7;border:1px solid #eeeeea;border-radius:8px;margin:0 0 20px;">
<tr><td style="padding:16px 24px;">${sectionsHtml}</td></tr>
</table>` : ''}

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff8f0;border:1px solid #f0d9c0;border-radius:8px;margin:0 0 28px;">
<tr><td style="padding:20px 24px;">
<p style="margin:0 0 8px;font-size:12px;color:#cc7733;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Notes from our team</p>
<p style="margin:0;font-size:14px;color:#555555;">${reason}</p>
</td></tr>
</table>

<p style="margin:0 0 16px;font-size:14px;color:#555555;">Once you've made the changes, re-submit your page for review and we'll prioritize it.</p>

<div style="text-align:center;margin:28px 0;">
<a href="${editorUrl}" style="display:inline-block;background:#d4af37;color:#1a1a2e;font-size:14px;font-weight:700;padding:14px 36px;border-radius:6px;text-decoration:none;letter-spacing:0.5px;">Open Page Editor →</a>
</div>

<p style="margin:24px 0 0;font-size:13px;color:#888888;border-top:1px solid #eeeeea;padding-top:20px;">Have questions about the feedback? Contact us on <a href="https://t.me/ourmemories" style="color:#d4af37;text-decoration:none;">Telegram</a> and we'll explain further.</p>
`

  return layout(content)
}
