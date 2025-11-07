export interface InfoBlock {
  title: string;
  content: string;
}

export interface FeedbackBlock {
  title: string;
  description: string;
  button_text: string;
}

export interface ContactsPageACF {
  title: string;
  info_blocks: InfoBlock[];
  feedback_block: FeedbackBlock;
}

export interface ContactsPageInterface {
  acf: ContactsPageACF;
}
