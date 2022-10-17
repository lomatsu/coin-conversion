import { Application } from "express"
import httpMock from "node-mocks-http"
import { agent as supertest, SuperAgentTest } from "supertest"

export const createExpressRequestMock = httpMock.createRequest

export const createExpressResponseMock = httpMock.createResponse


export default (app: Application): SuperAgentTest => {

	const agent = supertest(app)
	return agent
}
