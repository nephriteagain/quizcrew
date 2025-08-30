export const MULTIPLE_CHOICE_QUESTIONS = [
    {
        question: "What is the chemical symbol for gold?",
        choices: ["Au", "Ag", "Gd", "Pt"],
        answer: "Au",
    },
    {
        question: "Which planet is known as the Red Planet?",
        choices: ["Venus", "Mars", "Jupiter", "Mercury"],
        answer: "Mars",
    },
    {
        question: "What gas do humans exhale during respiration?",
        choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: "Carbon Dioxide",
    },
    {
        question: "Which part of the cell contains genetic material?",
        choices: ["Cytoplasm", "Nucleus", "Mitochondria", "Ribosome"],
        answer: "Nucleus",
    },
    {
        question: "What is the speed of light in vacuum?",
        choices: ["3 × 10^6 m/s", "3 × 10^7 m/s", "3 × 10^8 m/s", "3 × 10^9 m/s"],
        answer: "3 × 10^8 m/s",
    },
    {
        question: "Which vitamin is produced when the skin is exposed to sunlight?",
        choices: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
        answer: "Vitamin D",
    },
    {
        question: "What is the powerhouse of the cell?",
        choices: ["Ribosome", "Nucleus", "Mitochondria", "Chloroplast"],
        answer: "Mitochondria",
    },
    {
        question: "Which of the following is NOT a state of matter?",
        choices: ["Solid", "Liquid", "Gas", "Plasma Energy"],
        answer: "Plasma Energy",
    },
    {
        question: "Which planet has the strongest gravity?",
        choices: ["Earth", "Jupiter", "Saturn", "Neptune"],
        answer: "Jupiter",
    },
    {
        question: "Which scientist proposed the theory of relativity?",
        choices: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileo Galilei"],
        answer: "Albert Einstein",
    },
];

export const TOF_QUESTIONS = [
    {
        question: "The Sun is a star.",
        answer: true,
    },
    {
        question: "Sound can travel through a vacuum.",
        answer: false,
    },
    {
        question: "Water boils at 100°C at sea level.",
        answer: true,
    },
    {
        question: "The human skeleton has more than 500 bones.",
        answer: false, // about 206 bones in adults
    },
    {
        question: "Lightning is hotter than the surface of the Sun.",
        answer: true,
    },
    {
        question: "Sharks are mammals.",
        answer: false, // they are fish
    },
    {
        question: "DNA is the molecule that carries genetic information.",
        answer: true,
    },
    {
        question: "The Great Wall of China is visible from the Moon with the naked eye.",
        answer: false,
    },
    {
        question: "Pluto is classified as a dwarf planet.",
        answer: true,
    },
    {
        question: "All metals are magnetic.",
        answer: false,
    },
];

export const DRAG_AND_DROP = {
    // pool of draggable answers
    answers: [
        "Pacific Ocean",
        "Canberra",
        "Oxygen",
        "Leonardo da Vinci",
        "Jupiter",
        "William Shakespeare",
        "Mount Everest",
        "Nile River",
        "Mitochondria",
        "Albert Einstein",
    ],
    // questions with their correct answer
    questions: [
        {
            question: "What is the largest ocean on Earth?",
            answer: "Pacific Ocean",
        },
        {
            question: "What is the capital city of Australia?",
            answer: "Canberra",
        },
        {
            question: "What is the most abundant gas in Earth's atmosphere?",
            answer: "Oxygen",
        },
        {
            question: "Who painted the Mona Lisa?",
            answer: "Leonardo da Vinci",
        },
        {
            question: "Which planet is the largest in our solar system?",
            answer: "Jupiter",
        },
        {
            question: "Who wrote the play 'Romeo and Juliet'?",
            answer: "William Shakespeare",
        },
        {
            question: "What is the highest mountain in the world?",
            answer: "Mount Everest",
        },
        {
            question: "What is the longest river in the world?",
            answer: "Nile River",
        },
        {
            question: "What is known as the powerhouse of the cell?",
            answer: "Mitochondria",
        },
        {
            question: "Who developed the theory of relativity?",
            answer: "Albert Einstein",
        },
    ],
};
