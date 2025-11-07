import { HeaderAndFooterACF } from "@/shared/api/getHeaderAndFooter/types";

export const FooterClient=({footer}:{footer:HeaderAndFooterACF['footer']})=>{
  if (!footer) {
    return null;
  }
  return (
    <div className="bg-[#373737] p-12 lg:p-32">
      <div className="xl:max-w-[1440px] w-full mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-20">
          <img src={footer.logo} alt="logo" className="w-[300px]" />
          {footer.info_blocks.map((info)=>(
            <div className="flex flex-col gap-4" key={info.title}>
              <h3 className="text-white text-3xl font-medium">{info.title}</h3>
              <div className="text-white text-2xl font-light" dangerouslySetInnerHTML={{ __html: info.content }} />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-end gap-4  w-full h-96 lg:h-full ">
            <div className="w-full h-full rounded-xl" style={{position: 'relative', overflow: 'hidden'}}>
                <a href="https://yandex.ru/maps/org/primorskiy/1134485526/?utm_medium=mapframe&utm_source=maps" style={{color:'#eee',fontSize:'12px',position:'absolute',top:'0px'}}>Приморский</a>
                <a href="https://yandex.ru/maps/2/saint-petersburg/category/veterinary_clinic/184107216/?utm_medium=mapframe&utm_source=maps" style={{color:'#eee',fontSize:'12px',position:'absolute',top:'14px'}}>Ветеринарная клиника в Санкт‑Петербурге</a>
                <a href="https://yandex.ru/maps/2/saint-petersburg/category/veterinary_pharmacy/184107214/?utm_medium=mapframe&utm_source=maps" style={{color:'#eee',fontSize:'12px',position:'absolute',top:'28px'}}>Ветеринарная аптека в Санкт‑Петербурге</a>
                <iframe src="https://yandex.ru/map-widget/v1/?ll=30.226974%2C60.007123&mode=search&oid=1134485526&ol=biz&z=13.86" width="560" height="400" frameBorder="0" allowFullScreen={true} style={{position:'relative'}}></iframe>
            </div>
            <p className="text-white text-right text-2xl font-light">© 2025 Ветеринарный центр Приморский. Все права защищены.</p>
        </div>
            
      </div>
    </div>
  );
};