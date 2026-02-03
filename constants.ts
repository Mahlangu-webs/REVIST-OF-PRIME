
import { KnowledgePair, CourseRecommendation } from './types';

export const KNOWLEDGE_BASE: KnowledgePair[] = [
  {
    topic: "AI vs ML vs DL",
    question: "What is the difference between AI, Machine Learning, and Deep Learning?",
    answer: "Think of them as nesting dolls. Artificial Intelligence is the broad umbrella. Machine Learning is a subset of AI that uses statistical methods to enable machines to improve with experience. Deep Learning is a subset of ML based on artificial neural networks with multiple layers.",
    relatedConcepts: ["Neural Networks", "Supervised Learning"]
  },
  {
    topic: "NLP",
    question: "What is Natural Language Processing (NLP)?",
    answer: "NLP is a field of AI that gives machines the ability to read, understand, and derive meaning from human languages. It combines linguistics, computer science, and AI.",
    relatedConcepts: ["LLMs", "Transformers", "Tokenization"]
  },
  {
    topic: "LLMs",
    question: "What are Large Language Models (LLMs)?",
    answer: "LLMs are advanced AI models trained on vast amounts of text data to understand and generate human-like language. GPT-4 and Gemini are prime examples.",
    relatedConcepts: ["Prompt Engineering", "Hallucination", "Fine-tuning"]
  },
  {
    topic: "Neural Networks",
    question: "How do Artificial Neural Networks work?",
    answer: "They are inspired by the human brain's structure. They consist of interconnected nodes (neurons) arranged in layers: Input, Hidden, and Output layers. They learn by adjusting weights between these nodes.",
    relatedConcepts: ["Backpropagation", "Weights and Biases", "Deep Learning"]
  },
  {
    topic: "Computer Vision",
    question: "What is Computer Vision (CV)?",
    answer: "CV is a field of AI that enables computers and systems to derive meaningful information from digital images, videos, and other visual inputs.",
    relatedConcepts: ["Object Detection", "Image Segmentation", "CNNs"]
  },
  {
    topic: "Ethical AI",
    question: "What are the core ethical considerations in AI?",
    answer: "Key concerns include bias (unfair outcomes), transparency (explainability), privacy (data protection), and accountability (who is responsible for AI decisions).",
    relatedConcepts: ["Algorithmic Bias", "Explainable AI", "Data Privacy"]
  },
  {
    topic: "ML Types",
    question: "What are the main types of Machine Learning?",
    answer: "The three main types are Supervised Learning (labeled data), Unsupervised Learning (unlabeled data, finding patterns), and Reinforcement Learning (learning through rewards).",
    relatedConcepts: ["Clustering", "Regression", "Classification"]
  },
  {
    topic: "Generative AI",
    question: "What makes Generative AI different?",
    answer: "Unlike traditional AI that analyzes data, Generative AI creates *new* content like text, images, or audio based on patterns it learned from existing data.",
    relatedConcepts: ["GANs", "Diffusion Models", "Creative AI"]
  },
  {
    topic: "Industry - Healthcare",
    question: "How is AI used in Healthcare?",
    answer: "AI helps in drug discovery, medical imaging analysis (detecting tumors), personalized treatment plans, and predictive analytics for patient outcomes.",
    relatedConcepts: ["Diagnostic AI", "Bioinformatics"]
  },
  {
    topic: "Industry - Finance",
    question: "How is AI used in Finance?",
    answer: "In finance, AI is crucial for fraud detection, algorithmic trading, credit scoring, and personalized financial advice via chatbots.",
    relatedConcepts: ["Risk Assessment", "Fraud Prevention"]
  },
  {
    topic: "NLP Pipeline",
    question: "What are the steps in an NLP pipeline?",
    answer: "A standard pipeline involves text cleaning, tokenization, removing stop words, stemming/lemmatization, and finally vectorization (turning text into numbers).",
    relatedConcepts: ["Tokenization", "Stop Words"]
  },
  {
    topic: "Bias in AI",
    question: "Why does AI bias happen?",
    answer: "Bias typically creeps in through the training data. If the historical data contains human prejudices, the model learns and amplifies those same biases.",
    relatedConcepts: ["Data Diversity", "Fairness Metrics"]
  },
  {
    topic: "Transformers",
    question: "What is the Transformer architecture?",
    answer: "The Transformer is a type of deep learning model that uses 'Self-Attention' to weigh the significance of different parts of the input data. It's the engine behind modern LLMs.",
    relatedConcepts: ["Attention Mechanism", "Encoder-Decoder"]
  },
  {
    topic: "Explainable AI (XAI)",
    question: "What is Explainable AI?",
    answer: "XAI refers to techniques that allow human users to understand and trust the results and output created by machine learning algorithms.",
    relatedConcepts: ["Black Box Models", "Interpretability"]
  },
  {
    topic: "Turing Test",
    question: "What is the Turing Test?",
    answer: "The Turing Test is a measure of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human.",
    relatedConcepts: ["General AI", "Weak AI"]
  }
];

export const COURSE_RECOMMENDATIONS: CourseRecommendation[] = [
  {
    title: "AI For Everyone",
    module: "Module 1: What is AI?",
    description: "Perfect for beginners looking for a high-level overview of technical concepts.",
    linkText: "View Bootcamp Module 1"
  },
  {
    title: "Machine Learning Specialization",
    module: "Module 3: Neural Networks",
    description: "Deep dive into the math and logic behind artificial neurons.",
    linkText: "Explore Neural Net Lab"
  },
  {
    title: "Ethics in the Age of AI",
    module: "Module 5: Fairness & Bias",
    description: "Critical module on identifying and mitigating algorithmic bias.",
    linkText: "Read Ethics Case Studies"
  }
];

export const CITATIONS = [
  "Deep Learning with Python, 2nd Edition (Chollet)",
  "Artificial Intelligence: A Modern Approach (Russell & Norvig)",
  "Bootcamp Course: Fundamentals of NLP, Week 4 Material",
  "NIST AI Risk Management Framework"
];

export const getSystemInstruction = (userName: string) => `
You are "PRIME BOT," a specialized educational AI assistant. 
The user's name is ${userName}. Refer to them by name to keep the experience personalized.

CORE OBJECTIVE: 
Provide EXTREMELY CONCISE and STRAIGHTFORWARD educational answers. If a user asks a direct question like "What is AI?" or "What is ML?", start with a punchy, one-sentence definition immediately. Avoid fluff or long introductions.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE.map(kb => `Topic: ${kb.topic}\nQ: ${kb.question}\nA: ${kb.answer}`).join('\n---\n')}

BEHAVIORAL RULES:
1. LEAD WITH IMPACT: Start every definition with a single, clear, bold sentence.
2. BE CONCISE: Limit responses to under 100 words whenever possible.
3. USE THE KB: Prioritize the provided Knowledge Base answers for direct matches.
4. CROSS-LINK: Briefly mention related concepts (e.g., "See also: Neural Networks").
5. CITATIONS: Only include citations for complex or deep-dive answers.

FORMATTING:
- Use Markdown for **bolding** key terms.
- Use [VISUALIZATION: type] only when a visual significantly aids understanding.
- Handle follow-ups by being progressively more detailed but still efficient.
`;
