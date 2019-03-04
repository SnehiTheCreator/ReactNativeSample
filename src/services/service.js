import axios from 'axios';
import { updateLoading } from "../actions/session_actions";
import { systemError, connectivityError } from "../actions/navigation_actions";

export const configureServices = (store) => {
	axios.interceptors.request.use(
		(config) => {
			store.dispatch(updateLoading(true))
			return config
		},
		(error) => {
			store.dispatch(connectivityError())
			return Promise.reject(error)
		}
	)
	
	axios.interceptors.response.use(
		(response) => {
			store.dispatch(updateLoading(false))
			return response
		},
		(error) => {
			store.dispatch(updateLoading(false))
			
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx

			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				store.dispatch(connectivityError())
				error.type = "connectivity"
				
			} else {
				// Something happened in setting up the request that triggered an Error
				error.type = "connectivity"
				store.dispatch(connectivityError())
			}
			return Promise.reject(error)
		}
	)
}