import { getHeaderAndFooter } from "@/shared/api/getHeaderAndFooter";
import HeaderClient from "./HeaderClient";

const Header = async () => {
  const { header } = await getHeaderAndFooter();
  
  if (!header) {
    return null;
  }
  
  return <HeaderClient header={header} />;
};

export default Header;