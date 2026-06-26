from fastapi import FastAPI, HTTPException
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
async def generate_question(data: InterviewRoundRequest):
    try:
        print("--- NEW REQUEST RECEIVED ---")
        print(f"Role: {data.role}, Company: {data.company}")
        
        prompt = (
            f"You are a professional technical interviewer for {data.company}. "
            f"Target Role: {data.role} ({data.experience}).\n"
            f"Conversation History:\n{data.history}\n\n"
            "Task: Generate exactly ONE short and direct technical interview question. "
            "Do not output greetings. Speak only the question."
        )
        
        print("Calling Gemini LLM via LangChain...")
        response = await llm.ainvoke(prompt)
        print("Gemini Response Success!")
        
        return {"question": response.content}
        
    except Exception as e:
        print("\n❌ !!! GEMINI CRASH DETECTED !!! ❌")
        print("Error Details:", str(e))
        print("---------------------------------\n")
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