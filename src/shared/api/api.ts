export type Error = {
  message: string;
  code: number;
  customData: any;
};

export type TRequestStatuses = 'init' | 'pending' | 'fulfilled' | 'rejected';

export interface IResponse<D = any> {
  status: 'success' | 'error';
  data: D;
  errors: Error[];
}

// Базовый postfix для запроса ACF полей
// acf_format=standard - возвращает ACF поля в стандартном формате
// _embed - включает связанные объекты (embedded objects)
// _fields=acf - возвращает только ACF поля (можно убрать если нужны все поля)
const postfix = `&_embed&acf_format=standard`;

// ПРИМЕЧАНИЕ: Для получения ACF полей связанных объектов (service_types, doctors и т.д.)
// необходимо настроить фильтры на стороне WordPress в functions.php или плагине.
// Стандартный WordPress REST API не всегда автоматически включает ACF поля связанных объектов.
//
// Пример кода для WordPress (добавить в functions.php):
//
// add_filter('rest_prepare_service_types', 'add_acf_to_rest_response', 10, 3);
// add_filter('rest_prepare_doctor', 'add_acf_to_rest_response', 10, 3);
// function add_acf_to_rest_response($response, $post, $request) {
//   $response->data['acf'] = get_fields($post->ID);
//   return $response;
// }

export const API = {
  //pages
  getMainPage: `/pages?slug=main${postfix}`,
  getHeaderAndFooter: `/pages?slug=header-footer${postfix}`,
  getAboutPage: `/pages?slug=about${postfix}`,
  getContactsPage: `/pages?slug=contacts${postfix}`,

  //service_types
  getServiceTypes: `/service_types?per_page=100&order=asc${postfix}`,
  getServiceTypeById: (id: number) =>
    `/service_types/${id}?${postfix.replace('&', '')}`,
  getServiceTypeBySlug: (slug: string) =>
    `/service_types?slug=${slug}${postfix}`,

  getServiceByServiceType: (serviceTypeId: number) =>
    `/services?service-type=${serviceTypeId}&order=asc${postfix}`,
  getServiceBySlug: (slug: string) => `/services?slug=${slug}${postfix}`,
  getServices: `/services?per_page=100&order=asc${postfix}`,

  //doctors
  getDoctors: `/doctors?per_page=100${postfix}&order=asc`,
  getDoctorById: (id: number) => `/doctors/${id}?${postfix.replace('&', '')}`,

  //posts
  getPosts: `/blog_post?per_page=100${postfix}`,
  getPostById: (id: number) => `/blog_post/${id}?${postfix.replace('&', '')}`,
  getPostBySlug: (slug: string) => `/blog_post?slug=${slug}${postfix}`,

  //blog_categories
  getBlogCategories: `/blog_category?per_page=100${postfix}`,

  //promos
  getPromos: `/promo?per_page=100${postfix}`,
  getPromoById: (id: number) => `/promo/${id}?${postfix.replace('&', '')}`,
  getPromoBySlug: (slug: string) => `/promo?slug=${slug}${postfix}`,
};
