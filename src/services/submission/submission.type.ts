import type { Field_TypeType, SubmissionStatusType } from "../../config/enum"

export type UpdateSubmissionAnswer = {
    id?: string,
    fieldId: string,
    body?: string | null,
    file_name?: string | null
    input_type: Field_TypeType
}

export type UpdateSubmissionAnswerCheckbox = {
    id?: string,
    checkboxFieldId: string,
    fieldChoicesId: string
}

export type UpdateSubmission = {
    id?: string,
    formId: string,
    answer: UpdateSubmissionAnswer[],
    answer_checkbox: UpdateSubmissionAnswerCheckbox[]
}

export type UpdateSubmissionResponse = {
    id: string,
    status: SubmissionStatusType,
    created_at: string,
    updated_at: string,
    user: {
        id: string,
        full_name: string,
        email: string
    },
    form: {
        id: string,
        label: string
    },
    answers: {
        id: string,
        body: string | null,
        file_name: string | null,
        input_type: Field_TypeType,
        field: {
            id: string,
            title: string
        }
    }[],
    checkboxes: {
        id: string,
        checkboxField: {
            id: string,
            title: string
        },
        fieldChoices: {
            id: string,
            body: string
        }
    }[]
}