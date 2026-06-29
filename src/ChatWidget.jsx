import { useState, useEffect, useRef } from 'react'
import './ChatWidget.css'

// OAuth Platforms List (39 platforms)
const OAUTH_PLATFORMS = [
  'GitHub', 'Google', 'Microsoft', 'Twitter/X', 'Facebook', 
  'LinkedIn', 'Slack', 'Discord', 'Reddit', 'YouTube',
  'Instagram', 'TikTok', 'Pinterest', 'Snapchat', 'WhatsApp',
  'Telegram', 'Stripe', 'PayPal', 'Shopify', 'Salesforce',
  'HubSpot', 'Mailchimp', 'Notion', 'Airtable', 'Trello',
  'Asana', 'Monday.com', 'Figma', 'Canva', 'Dropbox',
  'Box', 'OneDrive', 'Google Drive', 'AWS', 'Azure',
  'DigitalOcean', 'Heroku', 'Vercel', 'Netlify', 'OpenAI',
  'Anthropic', 'Cohere'
]

function ChatWidget({ currentUser, onSendMessage, existingMessages = [] }) {
  const [messages, setMessages] = useState(existingMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [workInProgress, setWorkInProgress] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showOAuthPanel, setShowOAuthPanel] = useState(false)
  const [authorizedPlatforms, setAuthorizedPlatforms] = useState([])
  const [customTokens, setCustomTokens] = useState({})
  const messagesEndRef = useRef(null)

  // Load chat history and OAuth data from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('neocryptz_chat_history')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }

    const savedAuthPlatforms = localStorage.getItem('neocryptz_oauth_platforms')
    if (savedAuthPlatforms) {
      setAuthorizedPlatforms(JSON.parse(savedAuthPlatforms))
    }

    const savedTokens = localStorage.getItem('neocryptz_custom_tokens')
    if (savedTokens) {
      setCustomTokens(JSON.parse(savedTokens))
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

  const toggleOAuthPlatform = (platform) => {
    const updated = authorizedPlatforms.includes(platform)
      ? authorizedPlatforms.filter(p => p !== platform)
      : [...authorizedPlatforms, platform]
    
    setAuthorizedPlatforms(updated)
    localStorage.setItem('neocryptz_oauth_platforms', JSON.stringify(updated))
  }

  const addCustomToken = (platform, token) => {
    if (!platform || !token) return
    
    const updated = { ...customTokens, [platform]: token }
    setCustomTokens(updated)
    localStorage.setItem('neocryptz_custom_tokens', JSON.stringify(updated))
  }

  const removeCustomToken = (platform) => {
    const updated = { ...customTokens }
    delete updated[platform]
    setCustomTokens(updated)
    localStorage.setItem('neocryptz_custom_tokens', JSON.stringify(updated))
  }

  const authorizeNeocryptzAI = () => {
    // Simulate OAuth authorization flow
    const allAuthorized = [...authorizedPlatforms]
    localStorage.setItem('neocryptz_oauth_platforms', JSON.stringify(allAuthorized))
    alert('Neocryptz AI is now authorized to act on your behalf across connected platforms!')
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
        <div className="header-actions">
          <button
            onClick={() => setShowOAuthPanel(!showOAuthPanel)}
            className="oauth-btn"
            title="OAuth Platform Settings"
          >
            🔗 OAuth ({authorizedPlatforms.length})
          </button>
          <button
            onClick={clearHistory}
            className="clear-btn"
            title="Clear chat history"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* OAuth Panel */}
      {showOAuthPanel && (
        <div className="oauth-panel">
          <div className="oauth-header">
            <h3>🔗 OAuth Platform Settings</h3>
            <button 
              onClick={() => setShowOAuthPanel(false)}
              className="close-panel-btn"
            >
              ✕
            </button>
          </div>
          
          <div className="oauth-section">
            <h4>🤖 Authorize Neocryptz AI</h4>
            <p className="oauth-description">
              Grant Neocryptz AI permission to act on your behalf across connected platforms
            </p>
            <button 
              onClick={authorizeNeocryptzAI}
              className="authorize-btn"
            >
              ✅ Authorize Neocryptz AI to Act on My Behalf
            </button>
          </div>

          <div className="oauth-section">
            <h4>📋 Available Platforms (39)</h4>
            <div className="platforms-grid">
              {OAUTH_PLATFORMS.map(platform => (
                <div 
                  key={platform}
                  className={`platform-item ${authorizedPlatforms.includes(platform) ? 'authorized' : ''}`}
                  onClick={() => toggleOAuthPlatform(platform)}
                >
                  <span className="platform-name">{platform}</span>
                  <span className="platform-status">
                    {authorizedPlatforms.includes(platform) ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="oauth-section">
            <h4>🔐 Custom API Tokens</h4>
            <div className="token-input-group">
              <input
                type="text"
                placeholder="Platform name (e.g., OpenAI)"
                className="token-platform-input"
                id="token-platform"
              />
              <input
                type="password"
                placeholder="API token"
                className="token-value-input"
                id="token-value"
              />
              <button 
                onClick={() => {
                  const platform = document.getElementById('token-platform').value
                  const token = document.getElementById('token-value').value
                  addCustomToken(platform, token)
                  document.getElementById('token-platform').value = ''
                  document.getElementById('token-value').value = ''
                }}
                className="add-token-btn"
              >
                Add
              </button>
            </div>
            <div className="custom-tokens-list">
              {Object.entries(customTokens).map(([platform, token]) => (
                <div key={platform} className="token-item">
                  <span className="token-platform">{platform}</span>
                  <span className="token-masked">••••••••</span>
                  <button 
                    onClick={() => removeCustomToken(platform)}
                    className="remove-token-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
