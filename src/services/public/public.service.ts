import api from "../../config/gateway"
import errorCatch from "../../config/errorCatch"
import apiPath from "../path"
import { store } from "../../redux/store"
import { setCurrentThesis, setThesisList } from "../../redux/reducers/thesisSlice.reducer"
import type { ThesisItem, ThesisPagination } from "./public.type"

export class PublicService {
    static async getTheses(
        page: number,
        size: number,
        filters?: { search?: string; thesis_type?: string; date_from?: string; date_to?: string }
    ) {
        try {
            const params: any = { page, size }
            if (filters?.search) params.search = filters.search
            if (filters?.thesis_type) params.thesis_type = filters.thesis_type
            if (filters?.date_from) params.date_from = filters.date_from
            if (filters?.date_to) params.date_to = filters.date_to

            const { status, data } = await api.get<ThesisPagination>(apiPath.public.getTheses, { params })
            if (status >= 200 && status < 300) {
                store.dispatch(setThesisList(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        }
    }

    static async getOneThesis(id: string) {
        try {
            const { status, data } = await api.get<ThesisItem>(`${apiPath.public.getTheses}/${id}`)
            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentThesis(data))
                return true
            }
        } catch (error) {
            errorCatch(error, { 404: { message: "Không tìm thấy đồ án", type: "error" } })
            return false
        }
    }
}
