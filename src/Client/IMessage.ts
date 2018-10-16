import { IAuthor } from "./IAuthor";
import { IMessageAttachment } from "./IMessageAttachment";
import { IAttachment } from "./IAttachment";

export interface IMessage {
  content: string;
  attachments: IMessageAttachment[];
  author: IAuthor;
  server: {
    id: string;
  };

  reply(text: string): Promise<void>;

  send(text: string, attachments?: IAttachment): Promise<void>;

  remove(): Promise<void>;
}
