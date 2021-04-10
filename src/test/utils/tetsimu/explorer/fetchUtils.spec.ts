import merge from "deepmerge";
import fetchMock from "fetch-mock";
import { ExplorerItemType } from "stores/ExplorerState";
import { fetchExplorerItemFolder } from "utils/tetsimu/explorer/fetchUtils";

describe("valifetchExplorerItemFolder", () => {
  it("should fetch and correct data", async () => {
    fetchMock.get("http://localhost/test1.json", {
      status: 200,
      body: {
        description: "folder1 description",
        name: "  folder1  ",
        syncUrl: "",
        id: "1",
        items: {
          "1-1 ": {
            description: "",
            name: "  folder1-1",
            syncUrl: "",
            id: " 1-1",
            items: {
              "1-1-1 ": {
                name: " file1-1-1",
                description: "file1-1-1 description",
                parameters: "np=I&m=0&v=2.03",
                id: "  1-1-1",
                type: 2,
              },
            },
            type: 1,
          },
        },
        type: 1,
      },
    });

    const actual = await fetchExplorerItemFolder("http://localhost/test1.json");

    const expected = {
      succeeded: true,
      data: {
        description: "folder1 description",
        name: "folder1",
        syncUrl: "http://localhost/test1.json",
        id: "1",
        items: {
          "1-1": {
            description: "",
            name: "folder1-1",
            syncUrl: "",
            id: "1-1",
            items: {
              "1-1-1": {
                name: "file1-1-1",
                description: "file1-1-1 description",
                parameters: "np=I&m=0&v=2.03",
                id: "1-1-1",
                type: 2,
              },
            },
            type: 1,
          },
        },
        type: 1,
      },
    };

    expect(actual).toEqual(expected);

    fetchMock.restore();
  });

  it("should return fail due to 404", async () => {
    fetchMock.get("http://localhost/404.json", {
      status: 404,
      body: "Not Found",
    });

    const actual = await fetchExplorerItemFolder("http://localhost/404.json");
    fetchMock.restore();

    expect(actual.succeeded).toBeFalsy();
    if (!actual.succeeded) {
      expect(actual.reason).toMatch("Not Found");
    }
  });

  it("should return fail due to invalid json format", async () => {
    fetchMock.get("http://localhost/notjson.json", {
      status: 200,
      body: "{ a: {}",
    });

    const actual = await fetchExplorerItemFolder(
      "http://localhost/notjson.json"
    );
    fetchMock.restore();

    expect(actual.succeeded).toBeFalsy();
    if (!actual.succeeded) {
      expect(actual.reason).toMatch(/Synced data is not json format\..*/);
    }
  });

  describe("data is broken", () => {
    const baseData = {
      description: "folder1 description",
      name: "folder1",
      syncUrl: "",
      id: "1",
      items: {
        "1-1": {
          name: "file1-1",
          description: "file1-1 description",
          parameters: "np=I&m=0&v=2.03",
          id: "1-1",
          type: 2,
        },
      },
      type: 1,
    };

    const testBroken = async (body: any) => {
      fetchMock.get("http://localhost/broken.json", {
        status: 200,
        body,
      });

      const actual = await fetchExplorerItemFolder(
        "http://localhost/broken.json"
      );
      fetchMock.restore();

      expect(actual.succeeded).toBeFalsy();
      if (!actual.succeeded) {
        expect(actual.reason).toBe("Synced data is broken.");
      }
    };

    describe("folder", () => {
      it("should return fail due to folder is not object", async () => {
        await testBroken("1");
      });

      it("should return fail due to folder type is missing", async () => {
        const { type, ...body } = baseData;
        await testBroken(body);
      });

      it("should return fail due to type is not folder", async () => {
        const { ...body } = baseData;
        body.type = ExplorerItemType.File;
        await testBroken(body);
      });

      it("should return fail due to description is missing", async () => {
        const { description, ...body } = baseData;
        await testBroken(body);
      });

      it("should return fail due to description is not string", async () => {
        const { ...body } = baseData;
        (body as any).description = 1;
        await testBroken(body);
      });

      it("should return fail due to id is missing", async () => {
        const { id, ...body } = baseData;
        await testBroken(body);
      });

      it("should return fail due to id is not string", async () => {
        const { ...body } = baseData;
        (body as any).id = 1;
        await testBroken(body);
      });

      it("should return fail due to name is missing", async () => {
        const { name, ...body } = baseData;
        await testBroken(body);
      });

      it("should return fail due to name is not string", async () => {
        const { ...body } = baseData;
        (body as any).name = 1;
        await testBroken(body);
      });

      it("should return fail due to syncUrl is missing", async () => {
        const { syncUrl, ...body } = baseData;
        await testBroken(body);
      });

      it("should return fail due to syncUrl is not string", async () => {
        const { ...body } = baseData;
        (body as any).syncUrl = 1;
        await testBroken(body);
      });

      it("should return fail due to items is missing", async () => {
        const { items, ...body } = baseData;
        await testBroken(body);
      });

      it("should return fail due to items is not string", async () => {
        const { ...body } = baseData;
        (body as any).items = 1;
        await testBroken(body);
      });
    });

    describe("file", () => {
      it("should return fail due to file is not object", async () => {
        const { ...body } = merge({}, baseData);
        body.items["1-1"] = 1 as any;
        await testBroken(body);
      });

      it("should return fail due to file type is missing", async () => {
        const { ...body } = merge({}, baseData);
        const { type, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to type is not file", async () => {
        const { ...body } = merge({}, baseData);
        body.items["1-1"].type = ExplorerItemType.Folder;
        await testBroken(body);
      });

      it("should return fail due to description is missing", async () => {
        const { ...body } = merge({}, baseData);
        const { description, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to description is not string", async () => {
        const { ...body } = merge({}, baseData);
        const { description, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to id is missing", async () => {
        const { ...body } = merge({}, baseData);
        const { id, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to id is not string", async () => {
        const { ...body } = merge({}, baseData);
        const { id, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to name is missing", async () => {
        const { ...body } = merge({}, baseData);
        const { name, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to name is not string", async () => {
        const { ...body } = merge({}, baseData);
        const { name, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to parameters is missing", async () => {
        const { ...body } = merge({}, baseData);
        const { parameters, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });

      it("should return fail due to name parameters not string", async () => {
        const { ...body } = merge({}, baseData);
        const { parameters, ...fileBody } = body.items["1-1"];
        body.items["1-1"] = fileBody as any;
        await testBroken(body);
      });
    });
  });
});
