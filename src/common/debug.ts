import Debug from "debug"

export default (suffix = "server"): Debug.Debugger =>
	Debug(`@coin-conversion/api:${suffix}`)
