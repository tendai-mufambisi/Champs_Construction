# Owner dashboard

Sign in at https://champs.digitsdigital.co.zw/admin/login (or tap the **©** in the footer).
Password only. After 8 wrong passwords from one connection, sign-in is blocked for 15 minutes.

| Section | Controls |
| --- | --- |
| Enquiries | Every build enquiry from the website form. Reply on WhatsApp, mark New / Contacted / Closed, delete. |
| Projects | Before / During / After photos in "Our Work" and the progress story. Replace the 3 placeholders with real photos. Add, hide, reorder, delete. |
| Testimonials | Real client reviews. While empty, the site shows "[CLIENT TESTIMONIAL — TO COLLECT]" placeholders. |
| Settings | Phones, WhatsApp number, email, Facebook, WhatsApp Community link, founder name/quote/photo, stats ([X] until filled), The Burbs pricing, legal status and the "No deposit, no interest" switch; change password. |

Photos are resized in the browser (max 1,800 px, WebP) and stored in R2 under `/media/…`.

## Cloudflare resources

| Binding | Resource |
| --- | --- |
| DB | D1 `champs-construction` |
| MEDIA | R2 `champs-construction-media` |
| ADMIN_SECRET | Worker secret (signs session cookies; rotating it signs everyone out) |

Reset a forgotten password: `node scripts/set-password.mjs "new password"`.
