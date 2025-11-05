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
const postfix = `&_fields=acf&_embed&acf_format=standard`;

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


  //service_types
  getServiceTypes: `/service_types?per_page=100${postfix}`,
  getServiceTypeById: (id: number) => `/service_types/${id}?${postfix.replace('&', '')}`,

  //doctors
  getDoctors: `/doctors?per_page=100${postfix}`,
  getDoctorById: (id: number) => `/doctors/${id}?${postfix.replace('&', '')}`,
};
