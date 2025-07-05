// Keyword-based function trigger system for Groq (since it doesn't support function calling)

export interface FunctionTrigger {
  keywords: string[];
  function: string;
  description: string;
}

export const FUNCTION_TRIGGERS: FunctionTrigger[] = [
  {
    keywords: ['project', 'projects', 'work', 'portfolio', 'built', 'created', 'developed', 'what have you built', 'show me your work'],
    function: 'getProjects',
    description: 'User is asking about projects or work'
  },
  {
    keywords: ['resume', 'cv', 'experience', 'background', 'work history', 'professional', 'career'],
    function: 'getResume',
    description: 'User is asking about resume or work experience'
  },
  {
    keywords: ['contact', 'email', 'phone', 'reach', 'get in touch', 'connect', 'linkedin', 'github', 'social'],
    function: 'getContact',
    description: 'User is asking for contact information'
  },
  {
    keywords: ['about', 'who are you', 'tell me about yourself', 'background', 'personal', 'story', 'introduction'],
    function: 'getPresentation',
    description: 'User is asking for personal background'
  },
  {
    keywords: ['skill', 'skills', 'technologies', 'tech stack', 'languages', 'tools', 'what can you do', 'expertise'],
    function: 'getSkills',
    description: 'User is asking about skills or technologies'
  },
  {
    keywords: ['sport', 'sports', 'fitness', 'workout', 'gym', 'exercise', 'lifting', 'bulking', 'athlete', 'physical'],
    function: 'getSport',
    description: 'User is asking about sports or fitness'
  },
  {
    keywords: ['crazy', 'wild', 'craziest', 'wildest', 'funny', 'interesting', 'unusual', 'unique', 'strange'],
    function: 'getCrazy',
    description: 'User is asking about crazy or interesting things'
  },
  {
    keywords: ['internship', 'intern', 'work experience', 'job', 'position', 'role', 'company', 'workplace'],
    function: 'getInternship',
    description: 'User is asking about internship or work experience'
  }
];

// Function to detect which function should be called based on user message
export function detectFunctionTrigger(userMessage: string): string | null {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const trigger of FUNCTION_TRIGGERS) {
    for (const keyword of trigger.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        console.log(`Function trigger detected: ${trigger.function} (keyword: ${keyword})`);
        return trigger.function;
      }
    }
  }
  
  return null;
}

// Function to get function description for system prompt
export function getFunctionDescriptions(): string {
  return FUNCTION_TRIGGERS.map(trigger => 
    `- **${trigger.function}** → ${trigger.description}`
  ).join('\n');
} 