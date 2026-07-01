const {GoogleGenAI} = require("@google/genai")
const z = require('zod')
const {zodToJsonSchema} = require('zod-to-json-schema')
// for integrating -> Gemini docs
const puppeteer = require('puppeteer')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY // for api key-> Google AI Studio
})

const interviewReportSchema = z.object({
    title: z.string().describe("The title of the job for which the interview report is generated"),
    matchScore: z.number().describe("A numerical score from 0 to 100 indicating how well the candidate's profile matches the job requirements"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("A specific technical question that could be asked in the interview"),
        intention: z.string().describe("The interviewer's intention behind asking this question"),
        answer: z.string().describe("A comprehensive answer covering key points, approaches, and best practices")
    })).describe("Array of 3-5 technical questions relevant to the job with interviewer intentions and model answers"),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("A behavioral question about past experiences or situational handling"),
        intention: z.string().describe("The interviewer's intention behind asking this behavioral question"),
        answer: z.string().describe("A comprehensive answer showing soft skills, experience, and professional approach")
    })).describe("Array of 2-3 behavioral questions with interviewer intentions and model answers"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("A specific skill the candidate is lacking or needs to improve"),
        severity: z.enum(["low","medium","high"]).describe("How critical this skill gap is for the job: low, medium, or high")
    })).describe("Array of identified skill gaps in the candidate's profile with severity levels"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main learning focus for this day (e.g., data structures, system design)"),
        tasks: z.array(z.string()).describe("Specific tasks and resources to study on this day")
    })).describe("A 7-day preparation plan with daily focus areas and tasks"),
    title: z.string().describe("The title of the job for which the ineterview report is generated")
})


async function generateInterviewReport({resume,selfDescription,jobDescription}){
    const prompt = `You are an expert interview coach and technical recruiter. Generate a comprehensive interview report for a candidate.

Candidate Details:
Resume: ${resume}

Candidate's Self Description: ${selfDescription}

Job Description: ${jobDescription}

IMPORTANT: You MUST return a valid JSON object with this EXACT structure:

{
    "title": "<job title>",
  "matchScore": <number between 0-100>,
  "technicalQuestions": [
    {
      "question": "<specific technical question>",
      "intention": "<why interviewer asks this>",
      "answer": "<comprehensive answer with key points>"
    }
  ],
  "behaviouralQuestions": [
    {
      "question": "<behavioral question about experience>",
      "intention": "<why interviewer asks this>",
      "answer": "<comprehensive answer>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "<'low' or 'medium' or 'high'>"
    }
  ],
  "preparationPlan": [
    {
      "day": <number>,
      "focus": "<main learning focus>",
      "tasks": ["<task 1>", "<task 2>"]
    }
  ]
}

Rules:
1. technicalQuestions must be an ARRAY of OBJECTS (not strings)
2. behaviouralQuestions must be an ARRAY of OBJECTS (not strings)
3. skillGaps must be an ARRAY of OBJECTS with skill and severity
4. preparationPlan must be an ARRAY of OBJECTS with day, focus, and tasks array
5. All string values must be properly quoted
6. matchScore must be a number, not a string
7. Generate 4-5 technical questions, 3-4 behavioral questions, 3-4 skill gaps, and 7-day plan
8. Return ONLY valid JSON, no markdown or explanation`;

    // Explicit schema for Gemini
    const explicitSchema = {
        type: "object",
        properties: {
            title: {
                type: "string",
                description: "The title of the job for which the interview report is generated"
            },
            matchScore: {
                type: "number",
                description: "Score 0-100"
            },
            technicalQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behaviouralQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string" },
                        severity: { 
                            type: "string",
                            enum: ["low", "medium", "high"]
                        }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "number" },
                        focus: { type: "string" },
                        tasks: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            }
        },
        required: ["title", "matchScore", "technicalQuestions", "behaviouralQuestions", "skillGaps", "preparationPlan"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: explicitSchema
            },
        });

        // Log raw response for debugging
        // console.log("Raw response:", response.text);
        
        // Parse the response
        const parsedResponse = JSON.parse(response.text);
        // console.log("Parsed response:", JSON.stringify(parsedResponse, null, 2));
        
        // Validate against schema
        const validatedData = interviewReportSchema.parse(parsedResponse);
        
        // console.log("Interview report generated successfully");
        return validatedData;
    } catch (error) {
        console.error("Error generating interview report:", error.message);
        if (error instanceof z.ZodError) {
            console.error("Schema validation failed:", error.errors);
            throw new Error(`Generated content does not match schema: ${JSON.stringify(error.errors)}`);
        }
        throw error;
    }
}

async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent,{waitUntil:"networkidle0"})
    const pdfBuffer = await page.pdf({format: "A4",margin:{
        top: "10mm",
        bottom: "10mm",
        left: "5mm",
        right: "5mm"
    }})
    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({resume,selfDescription,jobDescription}){
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}

                    the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF usin any library like puppeteer
                    The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML should be well-formatted and structured, making it easy to read and visually appealing.
                    The content of the resume should not be sounnd like it's generated by AI and should be as close as possible to a real human-written resume.
                    You can highlight the content using some some colors or different font sytles but the overall design should be simple and  professional.
                    The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                    The resume should not be so lengthy, it should be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to inlcude all the relevant inforation that can increase the candidate's chances of gettin an interview call for the given job description. 
    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
             responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = {generateInterviewReport,generateResumePdf}
