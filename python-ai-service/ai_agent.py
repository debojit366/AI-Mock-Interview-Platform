from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pypdf import PdfReader
import io
from typing import Optional

from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
import os                  
from dotenv import load_dotenv 
from typing import List
import json
load_dotenv()

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    google_api_key=GEMINI_API_KEY,
    temperature=0.7
)

class InterviewRoundRequest(BaseModel):
    role: str
    experience: str
    company: str
    history: str

@app.post("/ai/generate-question")
async def generate_question(
    role: str = Form("MERN Developer"),        
    experience: str = Form("Fresher"),
    company: str = Form("Google"),
    history: Optional[str] = Form(""),        
    resume: Optional[UploadFile] = File(None)  
):
    try:
        extracted_text = ""
        
        # 1. Parsing logic
        if resume:
            print(f"📄 Python Parsing PDF: {resume.filename}")
            pdf_bytes = await resume.read()
            pdf_file = io.BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

        # 2. Instruction Logic
        if extracted_text.strip():
            resume_instruction = f"""
            CRITICAL REFERENCE (RESUME MODE ON):
            The candidate has uploaded a resume. Content:
            \"\"\"{extracted_text}\"\"\"
            INSTRUCTION: Ask questions regarding their specific projects, frameworks, and architecture.
            """
        else:
            resume_instruction = """
            REFERENCE (GENERAL MODE):
            No resume provided. Ask standard high-quality technical interview questions matching the role.
            """

        # Safe String cleanup for history
        safe_history = history if history else ""

        # 3. Compile Master Prompt
        prompt = f"""
        You are an expert technical interviewer for the position of {role} at {company} for a level of {experience}.
        
        {resume_instruction}

        CORE LAWS:
        1. Ask exactly ONE clear technical question.
        2. Do not include any greeting or markdown formatting. Just return raw question text.
        3. Maintain history continuity below. Do not repeat topics.

        Current Interview History:
        {safe_history}
        """
        
        response = llm.invoke(prompt)
        return {"question": response.content.strip(), "extractedText": extracted_text}
        
    except Exception as e:
        print(f"❌ Python Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))






class ReportRequest(BaseModel):
    history: str

@app.post("/ai/generate-report")
async def generate_report(data: ReportRequest):
    try:
        prompt = f"""
        You are an expert technical interviewer. Analyze the following conversation history between the Interviewer and the Candidate.
        Provide a detailed performance evaluation report in strict JSON format. 
         Do not include any markdown formatting like ```json or ```, just return the raw JSON string.

        The JSON object must look exactly like this:
        {{
            "overallScore": 7.5,
            "summaryFeedback": "Detailed string feedback here...",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"]
        }}

        Conversation History:
        {data.history}
        """
        
        response = llm.invoke(prompt)
        
        # Parse the string response into proper JSON dictionary
        report_json = json.loads(response.content.strip())
        return report_json
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)