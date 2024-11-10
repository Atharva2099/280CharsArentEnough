
Given your interests, here’s a blog post idea that aligns well with your background in machine learning, algorithms, and applied AI:

---
Title: EasyQuizzes Ai powered FlashCard Generator
date: 2024-11-07
categories:
  - RAG
  - LLM
  - ChromaDB
  - Hackathon
---

# Automating Study Material Creation with Retrieval-Augmented Generation (RAG)

## Overview
Creating effective study materials from lengthy notes or research papers can be time-consuming. As someone passionate about machine learning and productivity tools, I developed **EasyQuizzes**, an application that uses Retrieval-Augmented Generation (RAG) to turn notes or PDFs into custom flashcards. This blog walks you through how I implemented RAG and structured the app to automate the process.

## Problem and Motivation
Creating flashcards manually from notes often requires significant time and effort. Inspired by my experience with Quizlet, I wanted to streamline this task by building a tool that uses AI to extract key information and generate flashcards instantly.

## Solution Architecture

### 1. Setting Up RAG with ChromaDB and LLaMA3
To implement RAG:
- **LLM Selection**: I used **Meta's LLaMA3.2-3B-preview** via Groq API to ensure low latency and efficient processing.
- **Embedding and Retrieval**: Using **ChromaDB**, I created vector embeddings for notes, allowing quick retrieval of relevant chunks.
  
### 2. Core Components
#### Document Parsing and Chunking
Using **PyPDF2** and **OCR**, my app converts handwritten or scanned notes into text. Each document is chunked into manageable sections for better LLM performance and stored as vectors in ChromaDB.

#### RAG Process
The RAG approach includes:
1. **Retrieving** relevant text chunks based on a prompt.
2. **Generating** responses by feeding retrieved information to the LLaMA3 model.

### 3. Key Code Snippets

#### Document Parsing and Chunk Storage
```python
import PyPDF2

def parse_pdf(file_path):
    pdf_reader = PyPDF2.PdfFileReader(open(file_path, "rb"))
    text_content = ""
    for page in pdf_reader.pages:
        text_content += page.extract_text()
    return text_content
```

#### Flashcard Generation
```python
def generate_flashcards(topic, document_text):
    retrieved_chunks = chromadb.retrieve(topic)
    flashcards = []
    for chunk in retrieved_chunks:
        question, answer = llm.generate_flashcard(chunk)
        flashcards.append((question, answer))
    return flashcards
```

### 4. Key Features and Benefits
- **Custom Flashcards in Seconds**: Reduces study prep time by automating question generation.
- **Accuracy with RAG**: By using retrieval, flashcards focus on relevant information, increasing the quality of study material.
- **Local Storage and Privacy**: Flashcards and data are stored locally for student privacy and offline access.

## Challenges and Learnings
1. **Embedding Quality**: Choosing the right embeddings is crucial for retrieving relevant text chunks accurately.
2. **Latency**: Using the Groq API and an optimized Conda environment helped manage model inference times effectively.
3. **Chunk Size**: Balancing chunk size was essential to avoid missing context while keeping retrieval efficient.

## Future Improvements
1. **Multi-language Support**: Given my background in Indic languages, I plan to extend this tool to support content in Hindi and Marathi.
2. **Mobile App Version**: Allowing flashcard creation on the go for a more seamless study experience.

## Conclusion
EasyQuizzes demonstrates how retrieval-augmented generation can save time and enhance learning. With AI, students can now spend more time understanding concepts rather than preparing notes.

Checkout EasyQuizzes at : [EasyQuizzes](https://github.com/Atharva2099/EasyQuizzes)

---

