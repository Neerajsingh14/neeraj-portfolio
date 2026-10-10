# Neeraj Portfolio - Tech Stack and Project Notes

Last updated: October 2026

Is file me project ki saari technology, services, folders aur roz ke kaam ke commands likhe hain. Is file me kabhi bhi asli password ya API key mat likhna (repo public hai).

- GitHub repo: Neerajsingh14/neeraj-portfolio
- Live hosting: Vercel (project: neeraj-portfolio)
- Owner and developer: Neeraj Singh Rajpurohit
- Contact: neerajpurohit520@gmail.com

---

## 1. Main technology

| Kya | Kaam |
|---|---|
| Next.js 16 (App Router) | Poori website ka framework. Pages, API route aur server actions ek hi project me |
| React | Website ke components (navbar, hero, projects, admin forms). Next.js ke andar hi aata hai |
| TypeScript | JavaScript ka safe version, galtiyan pehle hi pakad leta hai |
| Tailwind CSS (v4) | Design aur styling. Colors CSS variables se (`:root` me) |
| Node.js + npm | Project chalane aur packages install karne ke liye (Node v24, npm 11) |

Exact versions dekhne ke liye `package.json` kholo, ya chalao: `npm ls next react tailwindcss motion`

---

## 2. Packages (npm se install kiye)

| Package | Kaam |
|---|---|
| motion | Saari animations: hero, scroll reveal, navbar pill, drawer, dropdown, toasts (`motion/react` se import) |
| lenis | Smooth scrolling (sirf public site par, `/admin` par band) |
| lucide-react | Saare icons |
| @supabase/supabase-js | Database se data padhna aur likhna |
| @supabase/ssr | Login (auth) ko Next.js ke cookies ke saath chalana, server aur browser dono me |

Ye project chhota rakha gaya hai: form ke liye alag library nahi, contact form simple React state se chalta hai. Email ke liye bhi alag package nahi, Resend ki API seedha `fetch` se call hoti hai (`lib/mail.ts`).

---

## 3. Online services

| Service | Kaam | Kharcha |
|---|---|---|
| GitHub | Code ka online backup aur version history | Free |
| Vercel | Website live karna. GitHub se juda hai, `git push` par apne aap update | Free (Hobby) personal portfolio ke liye theek hai |
| Supabase | Database (Postgres), admin login (Auth), aur images ka storage (bucket: `portfolio`) | Free plan |
| Resend | Contact form ka email Gmail par bhejna | Free plan (limit resend.com/pricing par dekho) |
| Gmail | Contact form ka email yahan aata hai | Free |
| Google Fonts | Fonts: Sora (headings), Manrope (text), Geist Mono (labels aur logo). `next/font/google` se load hote hain | Free |
| jsDelivr + Devicon | Tech ke logos (React, Next.js, Java...) CDN se aate hain | Free |
| WhatsApp / LinkedIn / Instagram / GitHub | Sirf links, koi integration nahi. WhatsApp ka link `wa.me` se chat kholta hai | Free |

---

## 4. Tools

- VS Code: code likhne ka editor
- Git: code ka version control
- PowerShell scripts (`setup-*.ps1`): files aur code apne aap banane ya badalne ke liye. Chalane ke baad delete kar diye jate the, repo me nahi hain
- Supabase SQL Editor: tables, security rules aur storage bucket banane ke liye
- Browser DevTools aur terminal: check aur debug ke liye

---

## 5. Website ke features aur kaise bane

### Public site

| Feature | Kaise bana |
|---|---|
| Hero | Letter by letter naam, badalte words ("I build ..."), count-up stats, mouse ke saath 3D tilt hone wala code card jisme code khud type hota hai |
| Site background | Halki grid aur mouse ke saath chalti spotlight, screen par fixed (`SiteBackground`) |
| Navbar | Sliding pill (hover aur active section par), mobile par chhota dropdown menu |
| Custom cursor | Asli arrow ke peeche lag kar chalne wali ring, sirf mouse wale device par |
| Left social bar | Brand colors me hover (Instagram par asli gradient), WhatsApp seedha chat kholta hai |
| Back to top | Gol button jisme scroll progress ring hai, mobile par uske neeche WhatsApp button |
| Projects | Filter pills (categories ke hisaab se) aur browser frame me screenshot jo hover par scroll hoti hai |
| Skills | Group ke tabs aur logo wale tiles. Logo naam se apne aap milta hai (`lib/devicon.ts`) |
| Experience | Scroll ke saath bharne wali timeline |
| Education | Horizontal timeline aur CGPA progress bar |
| Certificates | Ek ke neeche ek horizontal cards, credential ID copy button ke saath |
| Contact form | Name, email, reason dropdown, message. Success animation |
| Contact email | Message pehle Supabase me save hota hai, phir Resend se Gmail par mail jati hai |
| Spam se bachav | Server par validation, ek rate limit (10 minute me 5 message per IP), aur honeypot check |
| Smooth scrolling | Lenis, navbar click par section tak glide |
| Responsive | Mobile se desktop tak, mobile par floating WhatsApp button |

### Admin panel (`/admin`)

| Feature | Kaise bana |
|---|---|
| Login | Supabase Auth (email + password), show/hide password, Caps Lock warning |
| Route protection | `proxy.ts` bina login ke `/admin` khulne nahi deta |
| Database me likhna sirf owner ko | Supabase security rules (RLS) aur `is_admin()` function, owner ki email par |
| Section-wise editor | Hero, About, Experience, Skills, Projects, Education, Certificates, Section headings, Settings |
| Add / edit / hide / delete / reorder | List editor: search, filter, duplicate, up/down arrows |
| Image upload | Drag and drop, seedha Supabase Storage (bucket `portfolio`) me |
| Multiple profiles | AI Powered, Frontend jaise alag profiles. Live profile `/` par, baaki `/?profile=slug` par |
| Reset to default | Ek section ko `lib/portfolio.ts` ke original content par wapas laana |
| Settings (common) | Naam, email, phone, WhatsApp, social links, resume sab profiles me ek saath |
| Messages inbox | Unread filter, mark read, delete, Reply, "Send test email" |
| Dashboard | Setup checklist, completeness ring, stats, recent messages |
| Save ka tareeka | Ctrl + S, unsaved changes ka warning, toast messages |

---

## 6. Folder structure

~~~
app/                    pages, layout, API route aur admin
  page.tsx              public site (database se data padhta hai)
  layout.tsx            fonts, SEO title
  globals.css           colors, font size, width (.wrap), animations
  api/contact/          contact form ka server (save + email)
  admin/                login aur admin pages
components/             sections (Hero, Projects...), ui, admin/ ke forms
lib/                    data, database, email, scroll ke helpers
public/                 resume PDF, projects/ ki images
docs/                   ye notes
proxy.ts                /admin ko protect karta hai
.env.local              secret keys (GitHub par nahi jati)
~~~

### Important files

| File | Kya karti hai |
|---|---|
| `lib/portfolio.ts` | Default content (fallback aur "Reset to default" ke liye) |
| `lib/content.ts` | Database se content padhna aur saaf karna |
| `lib/content-types.ts` | Har section ka shape (type) |
| `lib/site-data.ts` | Public site ke liye data taiyar karna |
| `lib/admin-schemas.ts` | Admin ke form ke fields |
| `lib/actions.ts` | Admin ke save, delete, profile, message ke server actions |
| `lib/mail.ts` | Resend se email bhejna |
| `lib/devicon.ts` | Skill ke naam se logo dhundna |
| `app/api/contact/route.ts` | Contact form: validate, save, mail |

### Content kahan badalna hai

| Kya | Kahan |
|---|---|
| Hero, About, Experience, Skills, Projects, Education, Certificates | **Admin panel se** (code ya deploy ki zarurat nahi) |
| Naam, email, phone, social links, resume link | Admin, Settings |
| Section ke heading ya show/hide | Admin, Section headings |
| Colors | `app/globals.css`, `:root` me 7 variables |
| Text ka size | `app/globals.css`, `html { font-size }` |
| Site ki width | `app/globals.css`, `.wrap` ki `max-width` |
| Fonts | `app/layout.tsx` |
| Resume PDF | `public/` me file badlo, naam same rakho |

---

## 7. Secret values (Environment Variables)

| Naam | Kaam |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project ka address |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase ki publishable key (browser me dikhne ke liye hi bani hai, safety security rules se hai) |
| `ADMIN_EMAIL` | Sirf is email ko `/admin` me jaane dena |
| `RESEND_API_KEY` | Resend ki key, email bhejne ke liye |
| `CONTACT_TO_EMAIL` | Jis Gmail par contact form ka mail aana hai |
| `CONTACT_FROM` | (optional) mail kis naam se jaye. Na likho to Resend ka default use hota hai |

- Computer par: `.env.local` file me
- Live site par: Vercel, Settings, Environment Variables
- Code me ya GitHub par kabhi nahi
- **Supabase ki secret key ya service_role key kabhi kahin mat daalo.** Is project ko wo chahiye hi nahi

---

## 8. Jo abhi use nahi hua (aage ke kaam)

- Apna domain (abhi `vercel.app` ka link hai)
- Resend me apna domain verify karna. Uske baad mail doosron ko bhi ja sakti hai (abhi sirf signup wali email par jati hai)
- Sitemap, robots, structured data (SEO)
- Analytics
- "Forgot password" login me
- Contact form me honeypot ka hidden field (server par check hai, form me field abhi nahi lagaya)
- Photo ko `next/image` se optimize karna
- Pakka rate limit (abhi server ki memory me hai)

---

## 9. Dhyan rakhne wali baatein

- **Supabase free project 1 hafte tak koi use na ho to pause ho jata hai.** Tab admin aur contact form kaam nahi karte. Site default content dikhati rehti hai. Supabase dashboard se "Restore" dabane par wapas chalu ho jata hai
- Admin me "hide" kiya hua item site par nahi dikhta, par database me padha ja sakta hai. Koi private cheez mat daalna
- Resend free plan me bina domain ke mail sirf **tumhari signup wali email** par ja sakti hai. Isliye `CONTACT_TO_EMAIL` wahi Gmail rakho jisse Resend par signup kiya hai
- Rate limit server ki memory me hai. Vercel par har instance me alag chalta hai, isliye ye basic spam rokne ke liye hai, pakka lock nahi
- Environment variable badalne ke baad Vercel par **Redeploy** zaroori hai, warna purane build me naya value nahi lagta
- Purane Supabase tables (`roles`, `settings`, `profile`, `projects`, `skills`, `services`, `experience`, `certificates`) ab use nahi hote. Site `content` table se chalti hai. Inhe hata sakte ho
- `lib/site.ts` aur `lib/types.ts` purani files hain, ab kisi page me use nahi hoti. Hata sakte ho
- Tech logos internet (CDN) se aate hain. Net na ho to logo ki jagah 2 letters dikhte hain
- Admin me image upload ki limit 10MB hai
- Admin ka text size alag hai (`app/admin/layout.tsx`), public site se bada

---

## 10. Roz ke kaam (cheat sheet)

Project chalana (computer par):

~~~powershell
cd D:\Projects\neeraj-portfolio
npm run dev
~~~

Live site update karna (Vercel apne aap update ho jata hai):

~~~powershell
git add .
git commit -m "kya badla"
git push
~~~

Production jaisa test (computer par):

~~~powershell
npm run build
npm start
~~~

| Kaam | Kaise |
|---|---|
| Naya project, skill, certificate, experience | Admin se add karo, Save. Deploy nahi chahiye |
| Project ka screenshot lagana | Admin, Projects, image drag and drop |
| Phone, email, social links badalna | Admin, Settings |
| Naya profile (jaise Frontend Developer) | Admin, Profiles, Create profile |
| Kisi profile ko live karna | Admin, Profiles, Make live |
| Alag profile ka link bhejna | `https://tumhari-site/?profile=profile-ka-slug` |
| Colors ya design badalna | Code badlo, phir `git push` |
| Resend key badalna | Vercel, Settings, Environment Variables badlo, phir Redeploy. Computer par `.env.local` me bhi |
| Galat update wapas lena | Vercel, Deployments, purane Ready deployment ke `...`, Promote to Production |
| Browser me purana dikhe | `Ctrl + Shift + R`, ya incognito tab |
| Admin password bhool gaye | Supabase, Authentication, Users, us user ka password reset |

---

## 11. Resume / LinkedIn ke liye

Personal portfolio website (Next.js, TypeScript, Tailwind CSS, Motion, Supabase, Resend, Vercel). Designed and built an animated, fully responsive portfolio with a custom admin panel that lets me edit every section, manage multiple role-based profiles, upload images and read contact messages without touching code. Contact form messages are stored in a database and emailed to me, with live deployment through GitHub and Vercel.

---

## 12. Project se live tak (GitHub aur Vercel)

Ye wahi flow hai jo kisi bhi Next.js project me use hota hai.

### Step 1: Project banao

~~~powershell
npx create-next-app@latest project-ka-naam
cd project-ka-naam
code .
npm run dev
~~~

Browser me `http://localhost:3000` par welcome page dikhe to setup sahi hai.

### Step 2: Packages install karo

~~~powershell
npm install motion lenis lucide-react
npm install @supabase/supabase-js @supabase/ssr
~~~

### Step 3: Secret values rakho

Project ke root me `.env.local` banao aur apni keys daalo. Ye file `.gitignore` me hoti hai, GitHub par nahi jati. Push se pehle `git status` me check karo ki `.env.local` na dikhe.

### Step 4: GitHub par daalo

1. github.com par naya **empty repo** banao (README, .gitignore, license **unchecked** rakho)
2. Project folder me:

~~~powershell
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAAM.git
git push -u origin main
~~~

Pehli baar ke baad sirf `git add .`, `git commit -m "..."` aur `git push` kaafi hai.

### Step 5: Deploy se pehle local build check karo

~~~powershell
npm run build
~~~

Isme error aaye to Vercel par bhi build fail hoga. Pehle yahin theek karo.

### Step 6: Vercel par deploy

1. vercel.com par **Continue with GitHub** se login
2. **Add New, Project**, apna repo **Import** karo
3. Framework **Next.js** apne aap aata hai, kuch mat badlo
4. **Environment Variables** me `.env.local` ki saari values daalo (poora text copy karke Key wale box me paste karne se sab apne aap alag ho jate hain)
5. **Deploy** dabao. 1 se 2 minute me link milta hai, jaise `project-naam.vercel.app`

### Step 7: Uske baad

- Har `git push` par Vercel apne aap naya deploy kar deta hai
- Environment variable badlo to Redeploy karna padta hai
- Galat deploy ho jaye to Vercel, Deployments, purana deployment, Promote to Production
- Supabase me Authentication, URL Configuration me live link daalo (Site URL aur Redirect URLs)
- Apna domain ho to Vercel, Settings, Domains, Add

### Poora flow ek line me

~~~
Code (VS Code) -> git push -> GitHub -> Vercel apne aap build karta hai -> Live site
                                              ^
                                Environment Variables yahin lagte hain

Content badalna ho -> Admin panel -> Supabase me save -> site turant update (deploy nahi chahiye)
~~~