// Mock responses for testing chatbot without API calls
const mockResponses = {
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'greet', 'start'],
    response: '👋 Hi there! How can I help you with your studies today? You can ask me about notes, exam prep, study tips, or anything academic!'
  },
  help: {
    keywords: ['help', 'assist', 'what can you do', 'how to use', 'guide'],
    response: '📚 I\'m here to help! You can:\n- Search notes by subject or topic\n- Get exam prep suggestions\n- Ask about study tips\n- Find bookmarks and collections\n- Explore trending notes'
  },
  exam: {
    keywords: ['exam', 'test', 'quiz', 'prepare', 'study plan'],
    response: '📝 Great! Tell me which subject or topic you want to prepare for, and I can help you create a study plan or explain key concepts. Need PYQ papers or revision notes?'
  },
  upload: {
    keywords: ['upload', 'add', 'create note', 'share', 'document', 'submit'],
    response: '📄 You can upload your notes by clicking the Upload button in the navbar. Add details like subject, unit, type (notes/cheat sheet/PYQ), and quality score!'
  },
  collection: {
    keywords: ['collection', 'save', 'bookmark', 'favorite', 'like', 'organization'],
    response: '⭐ You can save notes to your collections and bookmarks for quick access later. Just click the star/bookmark icon on any note to save it!'
  },
  search: {
    keywords: ['search', 'find', 'look for', 'locate', 'browse', 'filter'],
    response: '🔍 Use the search bar and advanced filters to find notes by subject, quality, popularity, or unit. You can also browse trending notes!'
  },
  download: {
    keywords: ['download', 'save locally', 'export', 'get pdf'],
    response: '⬇️ Click the download button on any note to save it locally. You can track your downloads and stats in the Dashboard!'
  },
  discuss: {
    keywords: ['discuss', 'comment', 'chat', 'question', 'thread', 'reply'],
    response: '💬 Each note has a discussion thread! You can ask questions, share insights, upvote helpful comments, and engage with the community.'
  },
  leaderboard: {
    keywords: ['leaderboard', 'rank', 'top', 'score', 'compete', 'leader'],
    response: '🏆 Check the Leaderboard to see top contributors and your ranking. Contribute quality notes and engage to climb up!'
  },
  analytics: {
    keywords: ['analytics', 'dashboard', 'statistics', 'stats', 'progress', 'track'],
    response: '📊 Visit your Dashboard to see analytics like downloads, views, votes, and your contribution history!'
  }
}

export function getMockResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase()
  
  // Look for the best matching response category
  for (const [category, data] of Object.entries(mockResponses)) {
    const isMatch = data.keywords.some((keyword) => lowerMessage.includes(keyword))
    if (isMatch) {
      return data.response
    }
  }
  
  // Fallback responses based on query characteristics
  if (lowerMessage.length < 3) {
    return '🤔 That\'s a short question! Try asking "What can you help with?" for a full list of features.'
  }
  
  if (userMessage.includes('?')) {
    return '❓ Interesting question! I\'m here to help with notes, studying, and learning. Try asking about specific features like search, upload, collections, or exam prep.'
  }
  
  return '💭 That sounds interesting! Could you be more specific? Ask me about notes, exams, study tips, collections, or any study-related topic!'
}
