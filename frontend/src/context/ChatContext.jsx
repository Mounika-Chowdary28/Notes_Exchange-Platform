import { createContext, useContext, useState, useCallback } from 'react'
import { useNotes } from './NotesContext'
import { getMockResponse } from '../utils/mockChat'

const ChatContext = createContext()

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}

// Helper function to search notes by keywords
function searchNotes(query, allNotes) {
  const keywords = query.toLowerCase().split(' ').filter(k => k.length > 2)
  
  return allNotes.filter(note => {
    const searchText = `${note.title} ${note.subject || ''} ${note.description || ''}`.toLowerCase()
    return keywords.some(keyword => searchText.includes(keyword))
  }).slice(0, 5) // Return top 5 matching notes
}

// Helper function to format notes as search results
function formatSearchResults(notes) {
  if (notes.length === 0) {
    return '📚 No notes found with that keyword. Try searching for different subjects or topics!'
  }

  const formatted = notes.map(note => 
    `📄 **${note.title}**\n` +
    `Subject: ${note.subject || 'General'} | Quality: ${note.quality || 'N/A'}\n` +
    `📍 /notes/${note.id}`
  ).join('\n\n')

  return `Found ${notes.length} relevant note(s):\n\n${formatted}`
}

// Set to true to use mock responses (set to false to use real Gemini API)
const USE_MOCK_MODE = true
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRequestTime, setLastRequestTime] = useState(0)
  const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests
  
  // Access notes from context inside the component
  const { notes } = useNotes()

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return

    // Rate limiting
    const now = Date.now()
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      setError('Please wait a moment before sending another message...')
      return
    }
    setLastRequestTime(now)

    // Add user message to chat
    const userMsg = { role: 'user', content: userMessage, id: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      let assistantContent

      // Check if user is asking about notes
      const isSearchQuery = /note|sheet|cheat|study|pdf|material|bookmark|download/i.test(userMessage)

      if (isSearchQuery && notes.length > 0) {
        // Search notes database
        const matchedNotes = searchNotes(userMessage, notes)
        assistantContent = formatSearchResults(matchedNotes)
        await new Promise((resolve) => setTimeout(resolve, 400)) // Simulate search delay
      } else if (USE_MOCK_MODE) {
        // Use mock response for general questions
        assistantContent = getMockResponse(userMessage)
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay
      } else {
        // Use REST API directly
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: messages.map((msg) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
              })).concat({
                role: 'user',
                parts: [{ text: userMessage }],
              }),
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              },
            }),
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error?.message || `API Error: ${response.status}`)
        }

        const data = await response.json()
        assistantContent = data.candidates[0].content.parts[0].text
      }

      // Add assistant response
      const assistantMessage = {
        role: 'assistant',
        content: assistantContent,
        id: Date.now() + 1,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err.message || 'Failed to get response')
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }, [messages, lastRequestTime, notes])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
