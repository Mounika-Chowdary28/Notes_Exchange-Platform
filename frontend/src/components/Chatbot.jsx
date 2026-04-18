import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatContext } from '../context/ChatContext'

// Helper to parse and render formatted messages with links
function renderMessage(content) {
  // Split by note links
  const parts = content.split(/(\d+)/g)
  const lines = content.split('\n')
  
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        // Match note link pattern: /notes/{id}
        const noteLinkMatch = line.match(/\/notes\/(\d+)/)
        const isBold = line.includes('**')
        const cleanLine = line.replace(/\*\*/g, '')
        
        if (noteLinkMatch) {
          return (
            <div key={idx} className="text-xs space-y-1">
              <p className="text-gray-800">{cleanLine}</p>
            </div>
          )
        }
        
        return (
          <p key={idx} className={`text-xs leading-relaxed ${isBold ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
            {cleanLine}
          </p>
        )
      })}
    </div>
  )
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const { messages, loading, error, sendMessage, clearChat } = useChatContext()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`)
    setIsOpen(false)
  }

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus-ring fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg transition hover:brightness-110"
        aria-label="Chat with AI"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="focus-ring fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-accent/20 bg-white/95 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-accent/20 bg-gradient-to-r from-accent/10 to-calm/10 px-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-accent">Study Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600">Ask about notes, subjects, or topics</p>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto space-y-3 px-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">
                  👋 Hi! Ask me for notes like:<br/>
                  "OS notes" · "CN cheat sheet" · "Database notes"
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSearchResult = msg.role === 'assistant' && msg.content.includes('/notes/')
                const noteLinks = msg.content.match(/\/notes\/\d+/g) || []
                
                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-xl px-4 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-accent text-white'
                          : 'bg-surface-2 text-gray-900 border border-accent/20'
                      }`}
                    >
                      {isSearchResult ? (
                        <div className="space-y-2">
                          {renderMessage(msg.content)}
                          <div className="space-y-1 mt-2">
                            {noteLinks.map((link, idx) => {
                              const noteId = link.replace('/notes/', '')
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleNoteClick(noteId)}
                                  className="block w-full text-left px-2 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold transition"
                                >
                                  View Note →
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                )
              })
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-2 border border-accent/20 rounded-xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-accent animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-accent animate-bounce delay-100" />
                    <div className="h-2 w-2 rounded-full bg-accent animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-xs text-red-600">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-accent/20 bg-surface-2/50 p-4 space-y-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700 w-full mb-2"
              >
                Clear chat
              </button>
            )}
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask: 'OS notes', 'DB cheat sheet'..."
                disabled={loading}
                rows={2}
                className="focus-ring w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 placeholder:text-gray-400 resize-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="focus-ring h-fit rounded-lg bg-accent px-3 py-2 text-white font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
