import { getHeaderAndFooter } from "@/shared/api/getHeaderAndFooter";
import { HeaderAndFooterACF } from "@/shared/api/getHeaderAndFooter/types";
import { FooterClient } from "./FooterClient";

export const Footer=async ()=>{
    const {footer} = await getHeaderAndFooter();
    if (!footer) {
        return null;
    }
    return <FooterClient footer={footer} />;
}