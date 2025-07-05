// Portfolio functions that can be called based on user triggers

export interface PortfolioData {
  title: string;
  content: string;
  type: 'text' | 'list' | 'link';
}

export const portfolioFunctions = {
  getProjects: (): PortfolioData => ({
    title: "My Projects",
    content: "Here are some of the projects I've worked on:\n\n1. **Cricket Field Placement AI** - Using ML to optimize cricket field positions\n2. **Speaker Recognition System** - Voice-based authentication using RNNs\n3. **Automation Tools** - Various Python scripts for workflow optimization\n4. **Portfolio Website** - This AI-powered portfolio you're chatting with!",
    type: 'text'
  }),

  getResume: (): PortfolioData => ({
    title: "Resume & Experience",
    content: "**Education:**\n- 3rd Year BTech in AI & Data Science at IIITDM Kurnool\n\n**Skills:**\n- Python, Machine Learning, RNNs/LSTMs\n- APIs, Git, Basic Web Development\n- Focus on practical, money-making applications\n\n**Goals:**\n- Building income-generating projects\n- Working towards FIRE (₹3 Crores+ target)",
    type: 'text'
  }),

  getContact: (): PortfolioData => ({
    title: "Contact Information",
    content: "You can reach me at:\n\n📧 Email: your-email@example.com\n🔗 LinkedIn: linkedin.com/in/yourprofile\n🐙 GitHub: github.com/yourusername\n📱 Phone: +91 XXXXXXXXXX\n\nFeel free to connect! I'm always open to discussing projects and opportunities.",
    type: 'text'
  }),

  getPresentation: (): PortfolioData => ({
    title: "About Me",
    content: "Hey! I'm Lokesh, a 19-year-old AI & DS student who's all about building things that make money. I believe in clear thinking, effective action, and constant growth.\n\nI'm curious, hardworking, and always thinking about how to turn skills into income. When I'm not coding, you'll find me at the gym or exploring new ideas.\n\nMy approach? Simple: learn, build, earn, repeat.",
    type: 'text'
  }),

  getSkills: (): PortfolioData => ({
    title: "Skills & Technologies",
    content: "**Technical Skills:**\n- Python (Core focus)\n- Machine Learning & AI\n- RNNs/LSTMs\n- APIs & Integration\n- Git & Version Control\n- Basic Web Development\n\n**Soft Skills:**\n- Quick Learning\n- Problem Solving\n- Analogical Thinking\n- Focus & Determination\n\n**Learning Style:**\n- Hands-on approach\n- Prefer guidance over direct answers\n- Believe in progress over perfection",
    type: 'text'
  }),

  getSport: (): PortfolioData => ({
    title: "Fitness & Sports",
    content: "I'm big into fitness and bulking! 🏋️‍♂️\n\n**My Approach:**\n- Balance of brain and body\n- Regular workouts\n- Focus on strength and growth\n- Believe in physical and mental development\n\nFitness isn't just about looks - it's about building discipline, consistency, and mental clarity. Plus, it helps me stay sharp for coding and problem-solving!",
    type: 'text'
  }),

  getCrazy: (): PortfolioData => ({
    title: "The Wildest Thing About Me",
    content: "The craziest thing? I'm aiming for ₹3 Crores+ by my mid-20s! 🚀\n\nMost people think that's insane, but I believe in setting big goals and working backwards. I'm not tied to traditional career paths - I want financial freedom and the flexibility to work on what excites me.\n\nPlus, I'm constantly ideating on unique projects that combine AI with practical applications. Some might call it ambitious, I call it having a clear vision!",
    type: 'text'
  }),

  getInternship: (): PortfolioData => ({
    title: "Internship & Work Experience",
    content: "Currently a 3rd-year student, so I'm actively looking for opportunities that align with my goals.\n\n**What I'm Looking For:**\n- AI/ML focused roles\n- Projects that have real-world impact\n- Opportunities to learn and grow\n- Positions that pay well (remember, I'm working towards FIRE!)\n\n**My Value:**\n- Quick learner\n- Focused and determined\n- Always thinking about practical applications\n- Not afraid to ask questions and get clarity",
    type: 'text'
  })
};

// Function to call the appropriate portfolio function
export function callPortfolioFunction(functionName: string): PortfolioData | null {
  const functionMap: Record<string, () => PortfolioData> = portfolioFunctions;
  
  if (functionName in functionMap) {
    return functionMap[functionName]();
  }
  
  console.warn(`Unknown function: ${functionName}`);
  return null;
} 