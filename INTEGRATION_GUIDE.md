# Neocryptz AI Chat Widget Integration Guide

This guide will help you integrate the new Gemini-style chat widget into your existing Neocryptz AI website.

## What This Replaces

The new chat widget replaces ONLY the chat interface portion of your existing website:
- The chat window (`#chat-window`)
- The input area (`#input-area`) 
- Message display and input handling

## What This Keeps Intact

The integration preserves all your existing functionality:
- Authentication system (login/register)
- Sidebar navigation
- Admin console
- User settings and modals
- Ad system
- All other features

## Integration Steps

### Option 1: Simple Iframe Integration (Recommended)

The easiest way to integrate is to use an iframe. Add this to your existing `index.html` where the chat window currently is:

```html
<!-- Replace your existing #chat-window and #input-area with this -->
<div id="chat-widget-container" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
  <iframe 
    src="http://localhost:5173" 
    style="width: 100%; height: 100%; border: none;"
    id="neocryptz-chat-iframe">
  </iframe>
</div>
```

### Option 2: Direct Component Integration

For a more seamless integration, you can build the React widget and include it directly:

1. **Build the widget:**
```bash
cd /Users/dennisfarmer/CascadeProjects/neocryptz-ai-chat
npm run build
```

2. **Add the built files to your existing website:**
```bash
cp -r dist/* /Users/dennisfarmer/neocryptz-ai/my-ai-site/
```

3. **Update your index.html:**
Replace the chat window section with:
```html
<div id="chat-widget-root"></div>
<script type="module" src="/assets/index.js"></script>
```

## Features Included

✅ **Pink/blue gradient animations** - Beautiful animated borders and backgrounds
✅ **Three-dot typing indicator** - Shows when AI is thinking (like Gemini)
✅ **Work-in-progress display** - Shows real-time processing steps
✅ **Text-to-speech** - "Read aloud" button on AI responses
✅ **Memory persistence** - Chat history saved to localStorage
✅ **Modern UI** - Sleek design matching your brand colors

## Customization

You can customize the widget by editing:
- `src/ChatWidget.jsx` - Component logic and behavior
- `src/ChatWidget.css` - Styling and animations
- `tailwind.config.js` - Color scheme and theme

## Connecting to Your Existing AI Backend

To connect the widget to your existing AI system, modify the `onSendMessage` prop:

```javascript
<ChatWidget 
  onSendMessage={async (message) => {
    // Call your existing AI API here
    const response = await callYourExistingAIAPI(message);
    return response;
  }}
/>
```

## Testing

1. Start the development server:
```bash
cd /Users/dennisfarmer/CascadeProjects/neocryptz-ai-chat
npm run dev
```

2. Open http://localhost:5173 to test the standalone widget

3. For iframe integration, test it in your existing website context

## Deployment

When ready for production:

1. Build the widget: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update the iframe src to your production URL

## Support

If you need help with integration or customization, the widget is designed to be easily modified to fit your existing infrastructure.
