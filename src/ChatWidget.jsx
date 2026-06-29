import { useState, useEffect, useRef } from 'react'
import './ChatWidget.css'

function ChatWidget({ currentUser, onSendMessage, existingMessages = [] }) {
  const [messages, setMessages] = useState(existingMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [workInProgress, setWorkInProgress] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('neocryptz_chat_history')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('neocryptz_chat_history', JSON.stringify(messages))
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
    
    // If there's an external onSendMessage handler, use it
    if (onSendMessage) {
      const response = await onSendMessage(userMessage)
      setWorkInProgress([])
      setIsTyping(false)
      
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: response || "I understand what you're asking about. Based on our conversation history and the context you've provided, I can help you with that.",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
    } else {
      // Fallback to simulated responses
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
    localStorage.removeItem('neocryptz_chat_history')
  }

  return (
    <div className="neocryptz-chat-widget">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-title">
          <div className="chat-avatar">
            <span className="avatar-letter">N</span>
          </div>
          <span className="title-text">Neocryptz AI Chat</span>
        </div>
        <button
          onClick={clearHistory}
          className="clear-btn"
          title="Clear chat history"
        >
          🗑️
        </button>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-avatar">
              <span className="avatar-letter-large">N</span>
            </div>
            <h3 className="empty-title">Welcome to Neocryptz AI</h3>
            <p className="empty-subtitle">Your intelligent assistant with memory and voice capabilities</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className={`message-bubble ${message.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
              <div className="message-content">
                {message.role === 'assistant' && (
                  <div className="message-avatar">
                    <span className="avatar-letter-small">N</span>
                  </div>
                )}
                <div className="message-text">
                  <p>{message.content}</p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speak(message.content)}
                      className="speak-btn"
                    >
                      🔊 {isSpeaking ? 'Stop' : 'Read aloud'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Work in Progress Indicator */}
        {workInProgress.length > 0 && (
          <div className="message-wrapper assistant-message">
            <div className="message-bubble assistant-bubble">
              <div className="message-content">
                <div className="message-avatar">
                  <span className="avatar-letter-small">N</span>
                </div>
                <div className="message-text">
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <div className="dot dot-1"></div>
                      <div className="dot dot-2"></div>
                      <div className="dot dot-3"></div>
                    </div>
                    <span className="typing-text">Working on it...</span>
                  </div>
                  <div className="work-steps">
                    {workInProgress.map((step, index) => (
                      <div key={index} className="work-step">
                        <span className="step-check">✓</span>
                        <span className="step-text">{step}</span>
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
          <div className="message-wrapper assistant-message">
            <div className="message-bubble assistant-bubble">
              <div className="typing-indicator-simple">
                <div className="typing-dots">
                  <div className="dot dot-1"></div>
                  <div className="dot dot-2"></div>
                  <div className="dot dot-3"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="input-form">
        <div className="input-wrapper">
          <div className="input-gradient-border"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Neocryptz AI..."
            className="chat-input"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatWidget
