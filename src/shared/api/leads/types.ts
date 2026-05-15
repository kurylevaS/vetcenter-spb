/** Поля формы заявки (совпадают с ключами JSON для WordPress / ACF). */
export interface LeadFormPayload {
  name: string;
  phone: string;
  pet?: string;
  comment?: string;
  doctor?: string;
  service_name?: string;
}
