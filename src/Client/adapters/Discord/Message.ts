import Discord from "discord.js";
import { IMessage } from "../../IMessage";
import { IAttachment } from "../../IAttachment";

export class Message implements IMessage {
  private msg: Discord.Message;

  constructor(msg: Discord.Message) {
    this.msg = msg;
  }

  get content() {
    return this.msg.content;
  }

  get attachments() {
    return this.msg.attachments.array().map(({ filename, filesize, id, url, width }) => ({
      filename,
      filesize,
      id,
      url,
      width
    }));
  }

  get author() {
    return {
      isBot: this.msg.author.bot,
      id: this.msg.author.id,
      tag: this.msg.author.tag,
      isAdmin: this.msg.member.hasPermission("ADMINISTRATOR"),
      toString: () => this.msg.author.toString(),
      roles: this.msg.member.roles.array()
    };
  }

  get server() {
    return {
      id: this.msg.guild.id
    };
  }
  async reply(text: string) {
    await this.msg.reply(text);
  }

  async send(text: string, attachment: IAttachment) {
    this.msg.channel.send(text, attachment);
  }
}
