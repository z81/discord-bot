import { startWith, everyTestSuccess, regEx } from "../src/MessageFilters";
import { ICommand } from "../src/Command/ICommand";
import { IMessage } from "../src/Client/IMessage";
import { IAttachment } from "../src/Client/IAttachment";

const createMockCommand = (testClb?: (msg: IMessage, vars: object) => boolean, info: string = "") =>
  class implements ICommand {
    test(msg: IMessage, vars: object): boolean {
      return testClb ? testClb(msg, vars) : true;
    }
    public info = info;
    exec() {}
  };

type Prim = string | number | null | boolean;

type RecursivePartial<T> = { [P in keyof T]?: P extends object ? RecursivePartial<T[P]> : Partial<T[P]> };

const createMockMessage = (msg: RecursivePartial<IMessage>) => ({
  content: "",
  attachments: [],
  author: {
    isBot: false,
    id: "1",
    tag: "1234",
    isAdmin: false,
    roles: []
  },
  server: {
    id: "string"
  },

  reply(text: string) {
    return Promise.resolve();
  },
  send(text: string, attachments?: IAttachment) {
    return Promise.resolve();
  },
  remove() {
    return Promise.resolve();
  },
  ...msg
});

test("msg filter: startWith test, msg = test 123", () => {
  const testCommand = new (createMockCommand())();

  startWith("test")(testCommand, "test 123");

  expect(
    everyTestSuccess(
      testCommand,
      createMockMessage({
        content: "test 123"
      })
    )
  ).toEqual({ result: true, vars: {} });
});

test("msg filter: startWith test, msg = 1123test 123", () => {
  const testCommand = new (createMockCommand())();

  startWith("test")(testCommand, "test 123");

  expect(
    everyTestSuccess(
      testCommand,
      createMockMessage({
        content: "1123test 123"
      })
    )
  ).toEqual({ result: false, vars: {} });
});

test("msg filter: regex /test(.*)/, msg = 234test 123", () => {
  const testCommand = new (createMockCommand())();

  regEx(/test(.*)/)(testCommand, "test 123");

  expect(
    everyTestSuccess(
      testCommand,
      createMockMessage({
        content: "234test 123"
      })
    )
  ).toEqual({ result: false, vars: {} });
});

test("msg filter: regex /test(.*)/, msg = test 123", () => {
  const testCommand = new (createMockCommand())();

  regEx(/test(.*)/)(testCommand, "test 123");

  expect(
    everyTestSuccess(
      testCommand,
      createMockMessage({
        content: "test 123"
      })
    )
  ).toEqual({ result: true, vars: {} });
});

test("msg filter: regex /test (.*)/ vars: ['name'], msg = test 123", () => {
  const testCommand = new (createMockCommand())();

  regEx(/test (.*)/, ["name"])(testCommand, "test 123");

  expect(
    everyTestSuccess(
      testCommand,
      createMockMessage({
        content: "test 123"
      })
    )
  ).toEqual({ result: true, vars: { name: "123" } });
});

test("msg filter: regex /test (.*)/ isBot = true", () => {
  const testCommand = new (createMockCommand())();

  regEx(/test (.*)/)(testCommand, "test 123");

  expect(
    everyTestSuccess(
      testCommand,
      createMockMessage({
        author: {
          isBot: true
        },
        content: "test 123"
      })
    )
  ).toEqual({ result: false, vars: {} });
});
