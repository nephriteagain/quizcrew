export enum QUIZ_TYPE {
    MCQ = "MCQ",
    TOFQ = "TOFQ",
    DNDQ = "DNDQ",
}

export type MultipleChoiceType = {
    type: QUIZ_TYPE.MCQ;
};

export type TrueOrFalseType = {
    type: QUIZ_TYPE.TOFQ;
};

export type DragAndDropType = {
    type: QUIZ_TYPE.DNDQ;
};

export type MultipleChoiceQ = {
    quiz_id: string;
    createdAt: number; // Timestamp;
    title: string;
    description: string;
    questions: {
        question: string;
        choices: string[];
        answer: string;
    }[];
} & MultipleChoiceType;

export type TrueOrFalseQ = {
    quiz_id: string;
    createdAt: number; // Timestamp;
    title: string;
    description: string;
    questions: {
        question: string;
        answer: boolean;
    }[];
} & TrueOrFalseType;

export type DragAndDrop = {
    quiz_id: string;
    createdAt: number; // Timestamp;
    title: string;
    description: string;
    answers: string[];
    questions: {
        question: string;
        answer: string;
    }[];
} & DragAndDropType;

export type Quiz = MultipleChoiceQ | TrueOrFalseQ | DragAndDrop;
