import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [workInProgress, setWorkInProgress] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '')
  const messagesEndRef = useRef(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_history')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, workInProgress])

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true)
    setWorkInProgress(['Analyzing your request...', 'Processing context...', 'Generating response...'])
    
    // Simulate work-in-progress updates
    const workSteps = [
      'Analyzing your request...',
      'Processing context...',
      'Searching knowledge base...',
      'Generating response...',
      'Finalizing output...'
    ]

    for (let i = 0; i < workSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setWorkInProgress(workSteps.slice(0, i + 1))
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responses = [
      "I understand what you're asking about. Based on our conversation history and the context you've provided, I can help you with that.",
      "That's a great question! Let me think about this carefully and provide you with a thoughtful response.",
      "I remember our previous discussion about this topic. Building on that, here's what I think would work best for you.",
      "I've processed your request and taken into account all the information you've shared with me. Here's my analysis.",
      "Based on the context from our conversation, I can provide you with a comprehensive answer to your question."
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    setWorkInProgress([])
    setIsTyping(false)
    
    const aiMessage = {
      id: Date.now(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, aiMessage])
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    await simulateAIResponse(input)
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem('chat_history')
  }

  const saveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey)
    setShowSettings(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neocryptz-pink to-neocryptz-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-white font-semibold text-xl">Neocryptz AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={clearHistory}
              className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
              title="Clear chat history"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10">
            <h2 className="text-white text-xl font-semibold mb-4">Settings</h2>
            <div className="mb-4">
              <label className="text-gray-300 text-sm block mb-2">OpenAI API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-neocryptz-pink"
                placeholder="sk-..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveApiKey}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neocryptz-pink to-neocryptz-blue text-white hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neocryptz-pink to-neocryptz-blue flex items-center justify-center animate-pulse-slow">
                <span className="text-white font-bold text-3xl">N</span>
              </div>
              <h2 className="text-white text-2xl font-semibold mb-2">Welcome to Neocryptz AI</h2>
              <p className="text-gray-400">Your intelligent assistant with memory and voice capabilities</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-neocryptz-pink to-neocryptz-purple text-white'
                    : 'bg-gray-800/80 backdrop-blur-sm text-white border border-white/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neocryptz-pink to-neocryptz-blue flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">N</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speak(message.content)}
                        className="mt-2 text-xs text-gray-400 hover:text-neocryptz-pink transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        {isSpeaking ? 'Stop' : 'Read aloud'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Work in Progress Indicator */}
          {workInProgress.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10 max-w-[80%]">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neocryptz-pink to-neocryptz-blue flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-neocryptz-pink rounded-full animate-bounce-slow" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-neocryptz-blue rounded-full animate-bounce-slow" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-neocryptz-purple rounded-full animate-bounce-slow" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-gray-400">Working on it...</span>
                    </div>
                    <div className="space-y-1">
                      {workInProgress.map((step, index) => (
                        <div key={index} className="text-xs text-gray-300 flex items-center gap-2">
                          <svg className="w-3 h-3 text-neocryptz-pink" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && workInProgress.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neocryptz-pink rounded-full animate-bounce-slow" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-neocryptz-blue rounded-full animate-bounce-slow" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-neocryptz-purple rounded-full animate-bounce-slow" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="relative">
          <div className="relative flex items-center bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neocryptz-pink via-neocryptz-blue to-neocryptz-purple"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Neocryptz AI..."
              className="flex-1 bg-transparent px-5 py-4 text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-4 bg-gradient-to-r from-neocryptz-pink to-neocryptz-blue text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default App
