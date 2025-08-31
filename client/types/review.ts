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
    questions: {
        question: string;
        choices: string[];
        answer: string;
    }[];
} & MultipleChoiceType;

export type TrueOrFalseQ = {
    type: "TOFQ";
    questions: {
        question: string;
        answer: boolean;
    }[];
} & TrueOrFalseType;

export type DragAndDrop = {
    type: "DNDQ";
    answers: string[];
    questions: {
        question: string;
        answer: string[];
    }[];
} & DragAndDropType;

export type Quiz = MultipleChoiceQ | TrueOrFalseQ | DragAndDrop;
