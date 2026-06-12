import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" — ildizда ham, subkatalogда ham (masalan GitHub Pages) ishlaydi.
export default defineConfig({
  base: "./",
  plugins: [react()],
  // host: true — localhost'дан tashqari tarmoq IP'сида ham ochilади
  // (telefon / boshqa qurilmалар bir Wi-Fi'да turиб kira oladi).
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
