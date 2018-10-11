import { asClass } from "awilix";
import fs from "fs";

export const commandNames = fs.readdirSync(__dirname).filter(f => !f.includes("."));

export const commandContainers = commandNames.reduce(
  (acc: any, name: string) => ({
    ...acc,
    [name]: asClass(require(`${__dirname}/${name}/${name}.js`)[name])
      .classic()
      .singleton()
  }),
  {}
);
