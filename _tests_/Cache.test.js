const { Store } = require('../Sourcery');

const fakeStorage = {
  store: {},
  getItem: jest.fn().mockImplementation((key) => {
    return fakeStorage.store[key] || null;
  }),
  setItem: jest.fn().mockImplementation((key, value) => {
    fakeStorage.store[key] = value;
  }),
  removeItem: jest.fn().mockImplementation((key) => {
    fakeStorage.store[key] = null;
  }),
  clear: jest.fn().mockImplementation(() => {
    fakeStorage.store = {};
  }),
};
const testObj = { "poo": "har", times: 12 };

describe("Storage class with Web Storage", () => {
  const webStore = new Store(fakeStorage);

  test("set", () => {
    webStore.set("foo", "bar");
    expect(fakeStorage.setItem).toHaveBeenCalledWith("foo", "bar");

    webStore.set("obj", testObj);
    expect(fakeStorage.setItem).toHaveBeenCalledWith("obj", JSON.stringify(testObj));
  });

  test("has", () => {
    fakeStorage.getItem.mockClear();
    expect(webStore.has("foo")).toBe(true);
    expect(webStore.has("obj")).toBe(true);
    expect(webStore.has("poo")).toBe(false);
    expect(fakeStorage.getItem).not.toHaveBeenCalled();
  });

  test("get", () => {
    fakeStorage.getItem.mockClear();
    expect(webStore.get("foo")).toBe("bar");
    expect(fakeStorage.getItem).toHaveBeenCalledWith("foo");

    fakeStorage.getItem.mockClear();
    expect(webStore.get("poo")).toBe(null);
    expect(fakeStorage.getItem).not.toHaveBeenCalled();

    expect(webStore.get("obj")).toEqual(testObj);
    expect(fakeStorage.getItem).toHaveBeenCalledWith("obj");
  });

  test("delete", () => {
    webStore.delete("foo");
    expect(fakeStorage.removeItem).toHaveBeenCalledWith("foo");
    expect(webStore.get("foo")).toBe(null);
    expect(webStore.has("foo")).toBe(false);
  });

  test("clear", () => {
    webStore.set("foo", "bar");
    webStore.set("bar", "foo");
    webStore.clear();
    expect(fakeStorage.clear).toHaveBeenCalled();
    expect(webStore.get("foo")).toBe(null);
    expect(webStore.get("bar")).toBe(null);
  });
});

describe("Storage class", () => {
  const memStore = new Store();

  test("set", () => {
    memStore.set("foo", "bar");
    expect(memStore.map["foo"]).toBe("bar");
    memStore.set("obj", testObj);
    expect(memStore.map["obj"]).toBe(testObj);
  });

  test("has", () => {
    expect(memStore.has("foo")).toBe(true);
    expect(memStore.has("obj")).toBe(true);
    expect(memStore.has("poo")).toBe(false);
  });

  test("get", () => {
    expect(memStore.get("foo")).toBe("bar");
    expect(memStore.get("poo")).toBe(null);
    expect(memStore.get("obj")).toEqual(testObj);
  });

  test("delete", () => {
    memStore.delete("foo");
    expect(memStore.map["foo"]).toBe(undefined);
  });

  test("clear", () => {
    memStore.set("foo", "bar");
    memStore.set("bar", "foo");
    memStore.clear();
    expect(memStore.map["foo"]).toBe(undefined);
    expect(memStore.map["bar"]).toBe(undefined);
  });
});

