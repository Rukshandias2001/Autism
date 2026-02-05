import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Use the model name seen in your Playground screenshot
    const model = genAI.getGenerativeModel(
      { model: "gemini-3-flash-preview" ,
        systemInstruction: `
        You are the official assistant for the "Little Stars" web application. 
        Your goal is to help parents and caregivers of children with autism.
        
        Website Context:
        - We offer an Emotion Simulator to help kids recognize feelings.
        - We have a Speech Therapy tool and Nursery videos for learning.
        - We provide a Routine Builder to help children manage daily tasks.
        - We have social scenarios for social decision-making.
        - The user is currently on the website.
        
        Guidelines:
        - Be empathetic, supportive, and clear.
        - If a user asks about features, mention the Emotion Simulator, Speech Therapy, or Routine Builder.
        - If you don't know something specific about a user's account, ask them to check their dashboard.
      `,
      }
    );
    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ text: response.text() });
    
  }  catch (error) {
    console.error("GEMINI ERROR:", error);
    res.status(500).json({ error: "Assistant connection failed." });
  }
};