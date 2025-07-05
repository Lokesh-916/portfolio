import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Gives a summary of what kind of internship I'm looking for, plus my contact info and how to reach me. Use this tool when the user asks about my internship search or how to contact me for opportunities.",
  parameters: z.object({}),
  execute: async () => {
    return `Here’s what I’m looking for 

-  **Duration**: Internship for any duration
-  **Location**: Remote**
-  **Focus**: Data Analysis & Visualization, Deep learning model development, deploying machine learning models, agentic workflows
-  **Stack**: Python, CrewAI, GPT, RAG, AutoGen, LangChain etc.
-  **What I bring**: I bring curiosity, consistency, and a build-first mindset to anything I work on.
-  I build with AI, explore with data, and learn by doing — that’s how I roll.

 **Contact me** via:
- Email: lokeshbabukolamala@gmail.com
- LinkedIn: [linkedin.com/in/lokeshbabu-kolamala](https://www.linkedin.com/in/lokeshbabu-kolamala)
- GitHub: [github.com/Lokesh-916](https://github.com/Lokesh-916)

Let's build  together 
    `;
  },
});
