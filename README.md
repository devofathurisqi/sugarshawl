# Sugar Shawl

Independent mint/peach React / TypeScript / Vite storefront. Official checkout: **+628132217724**.

```powershell
npm ci
npm run dev
```

Open `http://127.0.0.1:4175`. Verification: `npm test`, `npm run typecheck`, `npm run build`; production preview: `npm run preview`. Static output: `dist/`.

Brand/contact/storage: `src/config.ts`. Catalog: `src/data/products.json`. Client selling-price overrides: `src/data/prices.json`; verified Vuyama Ecer fallback: `src/data/retail-prices.json`. Precedence is client price → Ecer → inquiry. Procurement costs are absent. Unknown retail prices use `null`; known prices remain visible when photos need confirmation. Paris Jadul is the documented alias of Paris Legend, at Rp29,000, with legacy cart/favorite migration.

The current design uses mint #9FC1A9 and peach #EFC2AF sampled from the supplied logo, silk ribbons, an interactive shade hero, a horizontal product wardrobe and asymmetric collection rooms. Product photography retains its authentic colors. Revision verification: `../qa/revision/RESULTS.md`.

The homepage features Gana Instan. Catalog cards and product galleries prioritize verified on-model photography where available; the gallery keeps model examples accessible when switching colors. Zea Sport Instan uses the confirmed Sugar Shawl price of Rp48,000. See `docs/REVISION-2026-10-26.md` for the revision and verification record.

Production: https://sugarshawl.vercel.app (GitHub `prod` branch, deployed by Vercel). Set `SITE_URL` to the production origin when building to generate canonical URLs and a sitemap. The folder is named `sugarshawl_150_3` because Vite cannot reliably build from the original path containing `#`.
