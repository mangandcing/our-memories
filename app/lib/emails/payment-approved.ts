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

export function paymentApprovedEmail(params: {
  customerName: string
  pageTitle: string
  editorUrl: string
}): string {
  const { customerName, pageTitle, editorUrl } = params

  const content = `
<h2 style="margin:0 0 8px;font-size:22px;color:#1a1a2e;">Payment Confirmed ✓</h2>
<p style="margin:0 0 24px;font-size:15px;color:#555555;">Great news, ${customerName}! Your payment has been verified and your page is ready to be built.</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf7;border:1px solid #eeeeea;border-radius:8px;margin:0 0 28px;">
<tr><td style="padding:20px 24px;">
<p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Your Page</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#1a1a2e;">${pageTitle}</p>
</td></tr>
</table>

<p style="margin:0 0 16px;font-size:14px;color:#555555;">Your page is waiting for your content. Head to the editor to add your photos, text, music, and everything that makes your memory special.</p>

<div style="text-align:center;margin:28px 0;">
<a href="${editorUrl}" style="display:inline-block;background:#d4af37;color:#1a1a2e;font-size:14px;font-weight:700;padding:14px 36px;border-radius:6px;text-decoration:none;letter-spacing:0.5px;">Start Building Your Page →</a>
</div>

<p style="margin:24px 0 12px;font-size:14px;color:#555555;">Once you've added your content, submit it for review and we'll publish your page as quickly as possible.</p>
<p style="margin:0;font-size:13px;color:#888888;border-top:1px solid #eeeeea;padding-top:20px;">Questions? Reach us anytime on <a href="https://t.me/ourmemories" style="color:#d4af37;text-decoration:none;">Telegram</a>.</p>
`

  return layout(content)
}
