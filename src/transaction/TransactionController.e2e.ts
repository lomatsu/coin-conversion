/* eslint-disable @typescript-eslint/no-empty-function */
import request from "../common/utils/tests"
import app from "../bin/www-test"
import { TransactionController } from "./TransactionController"

let id = 0
describe("TransactionController", () => {
	it("Get /api/transactions/ | Should return all transactions", (done) => {
		request(app)
			.get(TransactionController.baseRouter)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined()
				expect(res.body !== 0).toBeTruthy()
				done()
			})
			.catch((err) => done(err))
	})

	it("POST /api/transactions | Should create a new user", (done) => {
		const newTransaction = {
				userId: 2,
				originCurrency: "EUR",
				originValue: 10,
				targetCurrency: "JPY"
		}
		request(app)
			.post(TransactionController.baseRouter)
			.send(newTransaction)
			.expect(201)
			.then((res) => {
				expect(res.body).not.toBeNull()
				expect(res.body.id).not.toBeNull()
				expect(res.body.originCurrency === "EUR").toBeTruthy()
				id = res.body.id
				done()
			})
			.catch((err) => done(err))
	})

	it("Get /api/transactions/:id | Should return user by id", (done) => {
		request(app)
			.get(`${TransactionController.baseRouter}/${id}`)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined()
				expect(res.body !== 0).toBeTruthy()
				expect(res.body.id === id).toBeTruthy()
				done()
			})
			.catch((err) => done(err))
	})

	it("PUT /api/transactions | Should update user", (done) => {
		const user = {
			email: "pilot@share-aero.com",
		}
		request(app)
			.put(`${TransactionController.baseRouter}/${id}`)
			.send(user)
			.expect(200)
			.then((res) => {
				expect(res.body).not.toBeNull()
				expect(res.body.id).toBe(id)
				done()	
			})
			.catch((err) => done(err))
	})

	it("Delete /api/transactions | Should delete user", (done) => {
		request(app)
			.delete(`${TransactionController.baseRouter}/${id}`)
			.expect(200)
			.then((res) => {
				expect(res.body.message).toBe("Transaction removed with success")
				done()
			})
			.catch((err) => done(err))
	})
})
