import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL)
export default socket