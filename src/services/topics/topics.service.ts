import { toast } from "sonner"
import api from "../../config/gateway"
import apiPath from "../path"
import errorCatch from "../../config/errorCatch"
import type { TopicDetail } from "./topics.type"
import type { ThesisTypeType } from "../../config/enum"

export default class TopicsService {
    static async getOneTopic(topicId: string) {
        try {
            const { status, data } = await api.get<TopicDetail>(`${apiPath.topics.getOneTopic}/${topicId}`)
            if (status >= 200 && status < 300) return data
        } catch (error) {
            errorCatch(error)
        }
        return null
    }

    static async getTopics(classId: string, milestoneId?: string) {
        try {
            const params: any = { classId }
            if (milestoneId) params.milestoneId = milestoneId
            const { status, data } = await api.get<TopicDetail[]>(apiPath.topics.getTopics, { params })
            if (status >= 200 && status < 300) return data
        } catch (error) {
            errorCatch(error)
        }
        return null
    }

    static async getMyTopic(classId: string, milestoneId: string, studentId: string) {
        const topics = await this.getTopics(classId, milestoneId)
        return topics?.find(t => t.student?.id === studentId) ?? null
    }

    static async createTopic(classId: string, milestoneId: string, title: string, thesis_type: ThesisTypeType, description?: string) {
        let loading
        try {
            loading = toast.loading("Đang tạo đề tài...")
            const { status, data } = await api.post<TopicDetail>(apiPath.topics.createTopic, { classId, milestoneId, title, thesis_type, description })
            if (status >= 200 && status < 300) { toast.success("Tạo đề tài thành công"); return data }
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }

    static async getMyTopicsAsLecturer(classId: string, milestoneId?: string) {
        try {
            const params: any = { classId }
            if (milestoneId) params.milestoneId = milestoneId
            const { status, data } = await api.get<TopicDetail[]>(apiPath.topics.myTopics, { params })
            if (status >= 200 && status < 300) return data
        } catch (error) {
            errorCatch(error)
        }
        return null
    }

    static async cancelInvite(topicId: string, classId: string) {
        let loading
        try {
            loading = toast.loading("Đang thu hồi lời mời...")
            const { status, data } = await api.patch<TopicDetail>(`${apiPath.topics.cancelInvite}/${topicId}/cancel-invite`, { classId })
            if (status >= 200 && status < 300) { toast.success("Đã thu hồi lời mời"); return data }
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }

    static async inviteSupervisor(topicId: string, classId: string, supervisorId: string) {
        let loading
        try {
            loading = toast.loading("Đang gửi lời mời...")
            const { status, data } = await api.patch<TopicDetail>(`${apiPath.topics.inviteSupervisor}/${topicId}/invite`, { classId, supervisorId })
            if (status >= 200 && status < 300) { toast.success("Đã gửi lời mời đến GVHD"); return data }
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }

    static async supervisorResponse(topicId: string, classId: string, accept: boolean, rejection_note?: string) {
        let loading
        try {
            loading = toast.loading("Đang xử lý...")
            const { status, data } = await api.patch<TopicDetail>(`${apiPath.topics.supervisorResponse}/${topicId}/supervisor-response`, { classId, accept, rejection_note })
            if (status >= 200 && status < 300) { toast.success(accept ? "Đã chấp nhận hướng dẫn" : "Đã từ chối"); return data }
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }

    static async deleteOutlineFile(url: string): Promise<void> {
        try {
            await api.delete(`${apiPath.topics.createTopic}/upload-outline`, { data: { url } })
        } catch { /* silent fail */ }
    }

    static async uploadOutlineFile(file: File, oldUrl?: string): Promise<string | null> {
        let loading
        try {
            loading = toast.loading("Đang tải file lên...")
            const formData = new FormData()
            formData.append('file', file)
            if (oldUrl) formData.append('oldUrl', oldUrl)
            const { status, data } = await api.post<{ url: string }>(`${apiPath.topics.createTopic}/upload-outline`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (status >= 200 && status < 300) return data.url
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }

    static async submitOutline(topicId: string, classId: string, outline_file_url: string) {
        let loading
        try {
            loading = toast.loading("Đang nộp đề cương...")
            const { status, data } = await api.patch<TopicDetail>(`${apiPath.topics.submitOutline}/${topicId}/submit-outline`, { classId, outline_file_url })
            if (status >= 200 && status < 300) { toast.success("Nộp đề cương thành công"); return data }
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }

    static async reviewTopic(topicId: string, classId: string, approve: boolean, rejection_note?: string) {
        let loading
        try {
            loading = toast.loading("Đang xử lý...")
            const { status, data } = await api.patch<TopicDetail>(`${apiPath.topics.reviewTopic}/${topicId}/review`, { classId, approve, rejection_note })
            if (status >= 200 && status < 300) { toast.success(approve ? "Đã duyệt đề tài" : "Đã từ chối đề tài"); return data }
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }

    static async assignReviewer(topicId: string, classId: string, reviewerId: string) {
        let loading
        try {
            loading = toast.loading("Đang phân công phản biện...")
            const { status, data } = await api.patch<TopicDetail>(`${apiPath.topics.getOneTopic}/${topicId}/assign-reviewer`, { classId, reviewerId })
            if (status >= 200 && status < 300) { toast.success("Đã phân công giảng viên phản biện"); return data }
        } catch (error) {
            errorCatch(error)
        } finally {
            toast.dismiss(loading)
        }
        return null
    }
}
