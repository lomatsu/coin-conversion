import { Response } from "express";
import {
  createExpressRequestMock,
  createExpressResponseMock,
} from "../common/utils/tests";
import { MockResponse } from "node-mocks-http";
import application from "../bin/www-test";
import knex from "../database/connection";
import mockDB from "mock-knex";
import { TransactionController } from "./TransactionController";
import { TransactionRepository } from "../repositories";
import { transactionMock } from "./mock-data";
import { TransactionViewModel } from "./TransactionViewModel";
import { TransactionModel } from "../database/model";
import { IPageOptions } from "../repositories/Repository";

describe("TransactionController", () => {
  let controller: TransactionController;
  let tracker: mockDB.Tracker;
  let response: MockResponse<Response<any, Record<string, any>>>;
  const app = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  beforeAll(() => mockDB.mock(knex));
  afterAll(() => mockDB.unmock(knex));
  beforeEach(() => {
    tracker = mockDB.getTracker();
    tracker.install();
    response = createExpressResponseMock();
    controller = new TransactionController(
      application,
      new TransactionRepository(knex)
    );
  });
  afterEach(() => tracker.uninstall());

  it("should register routes", () => {
    controller = new TransactionController(
      app as any,
      new TransactionRepository(knex)
    );
    controller.registerRoutes();
    expect(app.get).toBeCalledTimes(3);
    expect(app.post).toBeCalledTimes(1);
    expect(app.put).toBeCalledTimes(1);
    expect(app.delete).toBeCalledTimes(1);
  });

  it("should return transactions by user id", (done) => {
    const userId = 1;
    tracker.on("query", (query, step) => {
      query.response(
        [
          [transactionMock.find((x: any) => x.user_id === userId)],
          transactionMock,
          [true],
        ][step - 1]
      );
    });
    const request = createExpressRequestMock({
      params: { userId: 1 },
    });
    controller
      .getByUserId(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(200);
        const res: any = response._getJSONData();
        expect(res).toBeDefined();
        expect(res.data[0].userId).toBe(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 on get transaction by user id with invalid parameter user id", (done) => {
    const request = createExpressRequestMock({ params: { userId: -1 } });
    controller
      .getByUserId(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return error on to try get transaction by user id", (done) => {
    controller = new TransactionController(application, {
      getByUserId(userId: number,  _options: IPageOptions<TransactionModel>) {
        return Promise.reject(userId);
      },
    } as TransactionRepository);
    const request = createExpressRequestMock({ params: { userId: 50000000 } });
    controller
      .getByUserId(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(500);
        const data: { message: string } = response._getJSONData();
        expect(data).toBeDefined();
        expect(data.message).toBe("Error on get paginated transactions");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 on get transaction with invalid parameter user id", (done) => {
    const request = createExpressRequestMock({ params: { id: -1 } });
    controller
      .getById(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 on get transaction who id not exist", (done) => {
    tracker.on("query", (query) => {
      query.response([]);
    });
    const request = createExpressRequestMock({ params: { id: 50000 } });
    controller
      .getById(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 on get transaction who transactionType not exist", (done) => {
    const transaction = transactionMock.filter((x: any) => x.id === 999999);
    tracker.on("query", (query, step) => {
      query.response([transaction, [undefined]][step - 1]);
    });
    const request = createExpressRequestMock({ params: { id: 1 } });
    controller
      .getById(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return transactions by id", (done) => {
    const transaction = transactionMock.find((x: any) => x.id === 1);
    tracker.on("query", (query) => {
      query.response([transaction]);
    });
    const request = createExpressRequestMock({ params: { id: 1 } });
    controller
      .getById(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(200);
        const data: TransactionViewModel = response._getJSONData();
        expect(data).toBeDefined();
        expect(data.userId).toBe(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return error on to try get transaction by id", (done) => {
    const request = createExpressRequestMock({ params: { id: 1 } });
    controller = new TransactionController(application, {
      getById(id: number) {
        return Promise.reject(id);
      },
    } as TransactionRepository);
    controller
      .getById(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(500);
        const data: { message: string } = response._getJSONData();
        expect(data).toBeDefined();
        expect(data.message).toBe("Error on get transaction by id");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return all transactions", (done) => {
    tracker.on("query", (query) => {
      query.response([transactionMock]);
    });
    const request = createExpressRequestMock();
    controller
      .getAll(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(200);
        const data: TransactionViewModel[] = response._getJSONData();
        expect(data).toBeDefined();				
        done();
      })
      .catch((err) => done(err));
  });

  it("should return error on to try get all transactions", (done) => {
    const request = createExpressRequestMock();
    controller = new TransactionController(application, {
      getAll() {
        return Promise.reject();
      },
    } as TransactionRepository);
    controller
      .getAll(request, response)
      .then(() => {
        const data: { message: string } = response._getJSONData();
        expect(response._getStatusCode()).toBe(500);
        expect(data).toBeDefined();
        expect(data.message).toBe("Error on get paginated transactions");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 400 on try to create transaction without send request body", (done) => {
    const request = createExpressRequestMock({
      body: undefined,
    });
    controller
      .save(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(400);
        const { message } = response._getJSONData();
        expect(message).toBe("Property user_id is required");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 400 on try to create transaction send request body empty", (done) => {
    const request = createExpressRequestMock({
      body: {},
    });
    controller
      .save(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(400);
        const { message } = response._getJSONData();
        expect(message).toBe("Property user_id is required");
        done();
      })
      .catch((err) => done(err));
  });

  it("should create a new transaction", (done) => {
    const transactionResponse = {
      id: 5,
      user_id: 5,
      origin_currency: "JPY",
      origin_value: 100,
      target_currency: "BRL",
      conversion_rate: 100,
    } as any;
    tracker.on("query", (query) => {
      query.response([transactionResponse]);
    });
    const request = createExpressRequestMock({
      body: {
        id: transactionResponse.id,
        userId: transactionResponse.user_id,
        originCurrency: transactionResponse.origin_currency,
        originValue: transactionResponse.origin_value,
        targetCurrency: transactionResponse.target_currency,
        conversionRate: transactionResponse.conversion_rate,
      } as TransactionViewModel,
    });
    controller
      .save(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(201);
        const data: TransactionViewModel = response._getJSONData();
        expect(data).toBeDefined();
        expect(data.id).toBe(5);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return error on to try create a new transaction", (done) => {
    const request = createExpressRequestMock({
      body: {
        id: 1,
      },
    });
    controller = new TransactionController(application, {
      create(data: TransactionModel) {
        return Promise.reject(data);
      },
    } as TransactionRepository);
    controller
      .save(request, response)
      .then(() => {
        const data: { message: string } = response._getJSONData();
        expect(response._getStatusCode()).toBe(400);
        expect(data).toBeDefined();
        expect(data.message).toBe("Property user_id is required");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 when to try update transaction with invalid parameter id", (done) => {
    const request = createExpressRequestMock({ params: { id: -1 } });
    controller
      .update(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 when to try update transaction with invalid parameter id", (done) => {
    const request = createExpressRequestMock({ params: { id: undefined } });
    controller
      .update(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 400 on update transaction without body", (done) => {
    const request = createExpressRequestMock({ params: { id: 1 } });
    controller
      .update(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(400);
        const { message } = response._getJSONData();
        expect(message).toBe("Body is required for this request");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 400 on update transaction when body is empty", (done) => {
    const request = createExpressRequestMock({ params: { id: 1 }, body: {} });
    controller
      .update(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(400);
        const { message } = response._getJSONData();
        expect(message).toBe("Body is required for this request");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 on update transaction who id not exist", (done) => {
    tracker.on("query", (query) => {
      query.reject("transaction not found");
    });
    const request = createExpressRequestMock({
      params: { id: 50000 },
      body: { name: "Alex Leko" },
    });
    controller
      .update(request, response)
      .then(() => {
        const data: { message: string } = response._getJSONData();
        expect(response._getStatusCode()).toBe(500);
        expect(data).toBeDefined();
        expect(data.message).toBe("Error on update transaction");
        done();
      })
      .catch((err) => done(err));
  });

  it("should update transaction", (done) => {
    const transaction = {
      id: 1,
      originCurrency: "EUR",
    } as any;
    tracker.on("query", (query) => {
      query.response([transaction]);
    });
    const request = createExpressRequestMock({
      params: { id: 1 },
      body: { name: transaction.name },
    });
    controller
      .update(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(200);
        const data: TransactionViewModel = response._getJSONData();
        expect(data).toBeDefined();
        expect(data.id).toBe(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 when to try delete transaction with invalid parameter id", (done) => {
    const request = createExpressRequestMock({ params: { id: -1 } });
    controller
      .delete(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 404 when to try delete transaction without id", (done) => {
    const request = createExpressRequestMock({ params: { id: undefined } });
    controller
      .delete(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should delete transaction by id", (done) => {
    tracker.on("query", (query) => {
      query.response([true]);
    });
    const request = createExpressRequestMock({ params: { id: 1 } });
    controller
      .delete(request, response)
      .then(() => {
        expect(response._getStatusCode()).toBe(200);
        const data: { message: string } = response._getJSONData();
        expect(data).toBeTruthy();
        expect(data.message).toBe("Transaction removed with success");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return 500 on delete transaction who id not exist", (done) => {
    tracker.on("query", (query) => {
      query.reject("transaction not found");
    });
    const request = createExpressRequestMock({
      params: { id: 50000 },
    });
    controller
      .delete(request, response)
      .then(() => {
        const data: { message: string } = response._getJSONData();
        expect(response._getStatusCode()).toBe(500);
        expect(data).toBeDefined();
        expect(data.message).toBe("Error on delete transaction");
        done();
      })
      .catch((err) => done(err));
  });
});
