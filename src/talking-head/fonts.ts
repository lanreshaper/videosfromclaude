import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Montserrat is bundled in public/fonts so renders never depend on the network.
export const fontFamily = "Montserrat";

for (const weight of ["600", "800", "900"]) {
  loadFont({ family: fontFamily, url: staticFile(`fonts/Montserrat-${weight}.woff2`), weight });
}
