"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/shared/ui/Button/Button';
import { Header } from '@/shared/api/getHeaderAndFooter/types';
import Logo from '@public/images/logo.svg';
import LogoFull from '@public/images/logo_full.svg';
import  Map  from '@public/icons/map.svg';
import { useOpenFeedbackModal } from '@/shared/hooks/useOpenFeedbackModal';
interface HeaderClientProps {
  header: Header;
}

const HeaderClient = ({ header }: HeaderClientProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openFeedbackModal = useOpenFeedbackModal();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Услуги', href: '/service-types' },
    { label: 'Врачи', href: '/doctors' },
    { label: 'О клинике', href: '/about' },
    { label: 'Блог', href: '/blog' },
    { label: 'Контакты', href: '/contacts' },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`fixed top-0 left-0 right-0 z-50 bg-white  transition-shadow duration-300 ${
            isScrolled ? 'shadow-md' : 'shadow-none'
          }`}
        >
          {/* Десктопная версия */}
          <div className="hidden lg:block">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-16">
              <div className="flex items-center justify-between h-20 lg:h-32">
                {/* Логотип */}
                <Link href="/" className="flex items-center">
                  <Logo className="h-10 lg:h-20" />
                </Link>

                {/* Навигация */}
                <nav className="flex items-center gap-6 lg:gap-24">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm lg:text-[1.4rem] text-cBlack hover:text-cGreen transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Контакты и кнопка */}
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="flex flex-col gap-2 items-start">
                    <a
                      href={`tel:${header.phone.replace(/\s/g, '')}`}
                      className="text-base lg:text-[1.6rem] lg:ml-2 font-medium text-cBlack hover:text-cGreen transition-colors"
                    >
                      {header.phone}
                    </a>
                    <div className="flex items-start gap-1.5 mt-0.5">
                      <Map className="w-8 h-8 lg:w-10 lg:h-10 text-cBlack/70" />
                      <span className="text-xs lg:text-base !leading-[1.2rem] lg:max-w-[100px] xl:max-w-[150px] text-cBlack/70">
                        {header.address}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => openFeedbackModal()}
                    theme="green"
                    size="xl"
                    rounded="full"
                    className="whitespace-nowrap lg:!text-2xl lg:!py-5 lg:!px-12"
                  >
                    {header.button.title}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Мобильная версия */}
          <div className="lg:hidden relative">
            <div className="px-10 py-8">
              <div className="flex items-center justify-between">
                {/* Логотип */}
                <Link href="/" className="flex items-center">
                  <LogoFull className="h-16" />
                </Link>

                {/* Гамбургер меню */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex flex-col gap-2 p-2"
                  aria-label="Меню"
                >
                  <span
                    className={`block h-1 w-8 bg-cBlack transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-3' : ''
                    }`}
                  />
                  <span
                    className={`block h-1 w-8 bg-cBlack transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block h-1 w-8 bg-cBlack transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-3' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Мобильное меню */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'calc(100vh - 80px)' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute top-full left-0 right-0 bg-white z-50 overflow-y-auto"
                >
                  <div className="px-10 py-12 flex flex-col min-h-full">
                    {/* Заголовок меню и кнопка закрытия */}
                    <div className="flex items-center justify-between mb-12">
                      <h2 className="text-4xl font-bold text-cBlack">Меню</h2>
                      
                    </div>
                    
                    {/* Пункты меню */}
                    <nav className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 mb-12">
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-3xl text-cBlack hover:text-cGreen transition-colors font-medium py-2 md:py-3"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    
                    {/* Контакты и кнопка */}
                    <div className="pt-8 border-t mt-auto">
                      <a
                        href={`tel:${header.phone.replace(/\s/g, '')}`}
                        className="text-3xl text-center font-bold text-cBlack block mb-6"
                      >
                        {header.phone}
                      </a>
                      <p className="text-2xl text-center text-cBlack/70 mb-8">{header.address}</p>
                      <Button
                        onClick={() => openFeedbackModal()}
                        theme="green"
                        size="2xl"
                        rounded="full"
                        className="w-full"
                      >
                        {header.button.title}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default HeaderClient;

