type Primitive = string | number | boolean | null

type JsonLike =
	| Primitive
	| Primitive[]
	| { [key: string]: JsonLike }
	| Array<{ [key: string]: JsonLike }>

interface HttpResponse<T = JsonLike> {
	statusCode: number
	body: T
	headers?: Record<string, string>
}

const HttpResponseFactory = {
	ok<T = JsonLike>(body: T): HttpResponse<T> {
		return { statusCode: 200, body }
	},

	created<T = JsonLike>(body: T): HttpResponse<T> {
		return { statusCode: 201, body }
	},

	noContent(): HttpResponse<null> {
		return { statusCode: 204, body: null }
	},

	custom<T = JsonLike>(statusCode: number, body: T): HttpResponse<T> {
		return { statusCode, body }
	}
}

export { JsonLike, HttpResponse, HttpResponseFactory }
