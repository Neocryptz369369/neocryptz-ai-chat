import ChatWidget from './ChatWidget'
import './App.css'

function App() {
  // Demo mode - standalone chat widget
  const handleSendMessage = async (message) => {
    // This would connect to your existing AI backend
    // For now, return null to use the built-in simulated responses
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6 h-screen flex flex-col">
        <ChatWidget onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default App
