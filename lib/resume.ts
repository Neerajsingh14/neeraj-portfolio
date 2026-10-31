import { globalFrom, loadStore } from "./content";

const DEFAULT_HREF = "/Neeraj_Singh_Rajpurohit_Resume.pdf";

// Settings me jo resume link hai wahi file overwrite hoti hai (public folder me)
export async function resumeTarget() {
  const setting = globalFrom(await loadStore()).resume || "";
  const ok =
    /^\/[A-Za-z0-9._\-\/]+\.pdf$/i.test(setting) &&
    !setting.includes("..") &&
    !setting.includes("//");
  const href = ok ? setting : DEFAULT_HREF;
  return { href, path: `public${href}`, setting, mismatch: setting !== href };
}