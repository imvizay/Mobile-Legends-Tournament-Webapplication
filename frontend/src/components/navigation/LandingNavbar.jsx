import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

import { useMediaQuery } from "../../hooks/useMediaQuery";

function Navbar() {

  const isMobile = useMediaQuery("(max-width: 780px)");

  return (
    <>
      {isMobile ? (
        <MobileNavbar />
      ) : (
        <DesktopNavbar />
      )}
    </>
  );
}

export default Navbar;