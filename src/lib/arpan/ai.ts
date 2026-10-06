import { createServerFn } from '@tanstack/react-start';
import { GoogleGenAI } from '@google/genai';
import { fetchReflections, fetchParticipants, fetchAllUnifiedEntries } from './api';

export const analyzeInsights = createServerFn({ method: 'GET' })
  .validator((d: { userId: string }) => d)
  .handler(async (ctx) => {
    const userId = ctx.data.userId;

    // Fetch user data
    const reflectionsObj = await fetchReflections(userId);
    const reflections = Object.values(reflectionsObj);
    
    const joinedSevaIds = await fetchParticipants(userId);
    const allEntries = await fetchAllUnifiedEntries();
    const joinedSevas = allEntries.filter(e => e.kind === 'seva' && joinedSevaIds.includes(e.id));
    
    const sevaTitles = joinedSevas.map(s => s.title);

    const mockData = {
      dimensions: [
        { category: 'Empathy', score: 75 },
        { category: 'Community', score: 85 },
        { category: 'Gratitude', score: 90 },
        { category: 'Action', score: 65 },
        { category: 'Awareness', score: 80 },
      ],
      modes: [
        { name: 'Active Presence', value: 45 },
        { name: 'Deep Listening', value: 35 },
        { name: 'Skill Sharing', value: 20 },
      ],
      synthesis: "Your journey shows a quiet dedication to community. Through small acts of presence, you are cultivating a steady sense of gratitude and connection.",
      theme: "Grounded",
      learnings: [
        "Patience is found in the pauses between helping others.",
        "Community is built through showing up, even when it is difficult.",
        "True empathy requires listening without immediately trying to fix."
      ],
      recommendations: [
        "Consider a quiet Seva focused on elder care to deepen your practice of stillness.",
        "A nature-based Seva might help balance your active community engagement with grounded reflection."
      ]
    };

    if (reflections.length === 0 && sevaTitles.length === 0) {
      return mockData;
    }

    const promptText = `
    Analyze the following user's reflections and the sevas (community service events) they participated in.
    Extract key learnings and categorize them into 5 dimensions: Empathy, Community, Gratitude, Action, Awareness.
    Score each dimension out of 100 based on how strongly it reflects in their text.
    
    Also, identify their "Contribution Modes" (e.g., Active Presence, Deep Listening, Skill Sharing, Organizing, Emotional Support). Provide exactly 3 modes that total 100 in value.
    
    Write a gentle, non-gamified, 2-sentence "synthesis" paragraph reflecting on their spiritual/community growth. Emphasize selflessness and inner growth.
    Provide a single word "theme" (e.g. Grounded, Flowing, Radiant, Deep) that captures their current phase.
    
    Extract 3 short "key teachings" or learnings they have gained (1 sentence each).
    
    Recommend 2 directions for their next Seva (e.g., "Consider a quiet Seva focused on environmental care to deepen your connection to nature.").
    
    Return ONLY a JSON object with this exact schema:
    {
      "dimensions": [{"category": "string", "score": number}],
      "modes": [{"name": "string", "value": number}],
      "synthesis": "string",
      "theme": "string",
      "learnings": ["string", "string", "string"],
      "recommendations": ["string", "string"]
    }
    
    Reflections:
    ${reflections.join('\n- ')}
    
    Sevas Joined:
    ${sevaTitles.join('\n- ')}
    `;

    try {
      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptText,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const rawResponse = response.text;
        if (rawResponse) {
           const parsed = JSON.parse(rawResponse);
           return parsed;
        }
      }
    } catch (e) {
      console.error('AI Analysis failed, returning fallback data:', e);
    }

    // Dynamic mock based on actual data size if API key is missing
    const baseScore = Math.min(100, 50 + reflections.length * 10 + sevaTitles.length * 5);
    return {
      dimensions: [
        { category: 'Empathy', score: Math.min(100, baseScore + 10) },
        { category: 'Community', score: Math.min(100, baseScore + 15) },
        { category: 'Gratitude', score: Math.min(100, baseScore + 20) },
        { category: 'Action', score: Math.min(100, baseScore) },
        { category: 'Awareness', score: Math.min(100, baseScore + 5) },
      ],
      modes: [
        { name: 'Hands-on Care', value: 50 },
        { name: 'Listening', value: 30 },
        { name: 'Organizing', value: 20 },
      ],
      synthesis: "As you step into more spaces of service, your reflections reveal a deepening sense of interconnectedness. There is a quiet strength building in your everyday acts of presence.",
      theme: "Expansive",
      learnings: [
        "Every small act of care ripples outward in unseen ways.",
        "Holding space for others allows them to heal at their own pace.",
        "Joy is found in the collective effort, not individual recognition."
      ],
      recommendations: [
        "A Seva involving teaching or mentoring could help you share the quiet wisdom you are gathering.",
        "Consider joining a community kitchen effort to experience the grounding nature of shared nourishment."
      ]
    };
  });
