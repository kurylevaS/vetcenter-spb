'use client';

import Button from '@/shared/ui/Button/Button';

const MapBlockClient = () => {
  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex relative items-center flex-col gap-6 md:gap-8">
          {/* Карта */}
          <div className="w-full h-[40rem] md:h-[50rem] lg:h-[60rem] rounded-[2.4rem] md:rounded-[3.2rem] overflow-hidden shadow-lg relative">
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
              }}>
              <a
                href="https://yandex.ru/maps/org/primorskiy/1134485526/?utm_medium=mapframe&utm_source=maps"
                style={{
                  color: '#eee',
                  fontSize: '12px',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  zIndex: 1,
                }}>
                Приморский
              </a>
              <a
                href="https://yandex.ru/maps/2/saint-petersburg/category/veterinary_clinic/184107216/?utm_medium=mapframe&utm_source=maps"
                style={{
                  color: '#eee',
                  fontSize: '12px',
                  position: 'absolute',
                  top: '14px',
                  left: '0px',
                  zIndex: 1,
                }}>
                Ветеринарная клиника в Санкт‑Петербурге
              </a>
              <a
                href="https://yandex.ru/maps/2/saint-petersburg/category/veterinary_pharmacy/184107214/?utm_medium=mapframe&utm_source=maps"
                style={{
                  color: '#eee',
                  fontSize: '12px',
                  position: 'absolute',
                  top: '28px',
                  left: '0px',
                  zIndex: 1,
                }}>
                Ветеринарная аптека в Санкт‑Петербурге
              </a>
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=30.226974%2C60.007123&mode=search&oid=1134485526&ol=biz&z=13.86"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
                style={{ position: 'relative' }}
              />
            </div>
          </div>

          {/* Кнопка перехода на карты */}
          <div className="flex justify-center absolute bottom-6">
            <Button
              href="https://yandex.ru/maps/org/primorskiy/1134485526/"
              target="_blank"
              theme="green"
              size="2xl"
              rounded="full"
              className="px-8 md:px-12 lg:px-16">
              Перейти на карты
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapBlockClient;
