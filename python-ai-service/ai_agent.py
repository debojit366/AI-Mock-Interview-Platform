# python-ai-service/ai_agent.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
import os                  # 1. System environment se baat karne ke liye
from dotenv import load_dotenv  # 2. .env file load karne ke liye

# 3. Ye function tumhari .env file ko read karke memory me load kar dega
load_dotenv()

app = FastAPI()

# 4. os.getenv se key ko variable me nikal lo
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# 5. LangChain me key pipe kar do
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
        
        # Yahan call track hogi
        print("Calling Gemini LLM via LangChain...")
        response = await llm.ainvoke(prompt)
        print("Gemini Response Success!")
        
        return {"question": response.content}
        
    except Exception as e:
        # !!! SARA JADU YAHAN HAI !!!
        # Ye line terminal par asli error print karegi
        print("\n❌ !!! GEMINI CRASH DETECTED !!! ❌")
        print("Error Details:", str(e))
        print("---------------------------------\n")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)