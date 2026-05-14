import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import apiPath from "../path"
import type { Committee, UpsertCommitteeRequest } from "./committee.type"

export default class CommitteeService {
    // Upsert committee
    static async upsert(data: UpsertCommitteeRequest) {
        let loading
        try {
            const { classId, milestoneId, members } = data

            if (!classId || !milestoneId) {
                toast.error("Thiếu thông tin lớp hoặc milestone")
                return false
            }

            if (members.length < 3) {
                toast.error("Hội đồng phải có ít nhất 3 thành viên")
                return false
            }

            loading = toast.loading("Đang lưu hội đồng...")

            const { status, data: result } = await api.post<Committee>(apiPath.committee.upsert, data)

            if (status >= 200 && status < 300) {
                toast.success("Lưu hội đồng thành công")
                return result
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get committee by class ID
    static async getByClassId(classId: string) {
        let loading
        try {
            if (!classId) {
                toast.error("Không tìm thấy lớp học")
                return false
            }

            loading = toast.loading("Đang tải thông tin hội đồng...")

            const { status, data } = await api.get<Committee>(apiPath.committee.getByClassId(classId))

            if (status >= 200 && status < 300) {
                return data
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
}
