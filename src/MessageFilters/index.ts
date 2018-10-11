import { IMessage } from "../Client/IMessage";
import { Message } from "../Client/adapters/Discord/Message";
import { Permissions } from "../Permissions/Permissions";
import { ICommand } from "../Command/ICommand";

const decoratorInstances = new Map<any, any[]>();

export const messageFilter = (clb: Function) => (target: any, k: string) => {
  if (!decoratorInstances.has(target.constructor.name)) {
    decoratorInstances.set(target.constructor.name, []);
  }

  const instances = decoratorInstances.get(target.constructor.name);

  if (instances) {
    instances.push(clb);
  }
};

export const getMessageFilterDecorators = (target: ICommand) =>
  decoratorInstances.get(target);

export const everyTestSuccess = (target: ICommand, message: IMessage) => {
  const instances = decoratorInstances.get(target.constructor.name);

  if (!instances || message.author.isBot) return false;

  return instances.every((clb: Function) => clb(message, target));
};

export const startWith = (text: string) =>
  messageFilter((msg: IMessage) => msg.content.startsWith(text));

export const regEx = (regexp: RegExp) =>
  messageFilter((msg: IMessage) => !!msg.content.match(regexp));

export const hasAttachments = () =>
  messageFilter((msg: IMessage) => msg.attachments.length > 0);

export const noAttachments = () =>
  messageFilter((msg: IMessage) => msg.attachments.length === 0);

// export const hasPermission = (permissionName: string) =>
//   messageFilter((msg: IMessage, { permissions }: ICommand) => {
//     if (!permissions) return false;

//     return permissions.has(permissionName, msg.author);
//   });

let lastMessageTime = 0;
export const antiSpamTime = (value: number, antiSpamMessage: string) =>
  messageFilter((msg: IMessage) => {
    const time = +Date.now();

    if (time < lastMessageTime + value) {
      msg.reply(antiSpamMessage);
      return false;
    }

    lastMessageTime = time;

    return true;
  });
