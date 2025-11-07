// Типы для кнопки в header
export interface HeaderButton {
  title: string;
}

// Типы для header
export interface Header {
  phone: string;
  address: string;
  button: HeaderButton;
}

// Типы для info_block в footer
export interface FooterInfoBlock {
  title: string;
  content: string; // HTML контент
}

// Типы для footer
export interface Footer {
  logo: string;
  info_blocks: FooterInfoBlock[];
}

// ACF структура header и footer
export interface HeaderAndFooterACF {
  header: Header;
  footer: Footer;
}

// Интерфейс для элемента массива ответа API
export interface HeaderAndFooterInterface {
  acf: HeaderAndFooterACF;
}

// Основной интерфейс для ответа API (массив)
export interface GetHeaderAndFooterResponse
  extends Array<HeaderAndFooterInterface> {}
