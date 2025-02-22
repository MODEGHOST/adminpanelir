import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
 
export default defineConfig({
  base: "https://www.sxcretlab.com/thairung/adminir",
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});