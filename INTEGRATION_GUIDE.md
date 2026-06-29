# Neocryptz AI Chat Widget Integration Guide

This guide will help you integrate the new Gemini-style chat widget with OAuth support into your existing Neocryptz AI website.

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

## New OAuth Features

The chat widget now includes comprehensive OAuth support for **39 platforms**:

### Supported Platforms (39 total)
- **Development**: GitHub, GitLab, Bitbucket
- **Cloud & Infrastructure**: AWS, Azure, DigitalOcean, Heroku, Vercel, Netlify
- **AI Services**: OpenAI, Anthropic, Cohere
- **Social Media**: Twitter/X, Facebook, LinkedIn, Instagram, TikTok, Reddit, YouTube, Pinterest, Snapchat
- **Communication**: Slack, Discord, WhatsApp, Telegram
- **Business**: Stripe, PayPal, Shopify, Salesforce, HubSpot, Mailchimp
- **Productivity**: Notion, Airtable, Trello, Asana, Monday.com, Figma, Canva
- **Storage**: Dropbox, Box, OneDrive, Google Drive
- **Authentication**: Google, Microsoft

### OAuth Features Included

✅ **Platform Authorization Panel** - Click "OAuth" button to access platform settings
✅ **39 Platform Support** - Toggle authorization for each platform
✅ **Custom API Tokens** - Add custom tokens for any platform
✅ **Secure Storage** - All tokens stored in localStorage (client-side only)
✅ **Authorization Button** - One-click authorization for Neocryptz AI
✅ **Token Management** - Add, view (masked), and remove custom tokens
✅ **Persistent State** - Authorizations persist across sessions

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
✅ **OAuth Platform Support** - 39 platforms with authorization management
✅ **Custom API Tokens** - Secure token storage and management

## OAuth Integration with Existing System

The widget's OAuth system is designed to work alongside your existing OAuth infrastructure:

### Data Storage Keys
- `neocryptz_chat_history` - Chat message history
- `neocryptz_oauth_platforms` - Authorized platforms list
- `neocryptz_custom_tokens` - Custom API tokens

### Integration with Your Existing OAuth

To integrate with your existing OAuth system (from your current website), you can:

1. **Share OAuth Data**: The widget can read from your existing OAuth storage
2. **Sync Authorization**: Use the widget's OAuth panel to manage platform access
3. **Token Forwarding**: Custom tokens are automatically available to the AI backend

### Connecting OAuth to AI Backend

Modify the `onSendMessage` prop to include OAuth data:

```javascript
<ChatWidget 
  onSendMessage={async (message) => {
    // Get OAuth data from localStorage
    const oauthPlatforms = JSON.parse(localStorage.getItem('neocryptz_oauth_platforms') || '[]');
    const customTokens = JSON.parse(localStorage.getItem('neocryptz_custom_tokens') || '{}');
    
    // Call your existing AI API with OAuth context
    const response = await callYourExistingAIAPI(message, {
      authorizedPlatforms: oauthPlatforms,
      customTokens: customTokens
    });
    return response;
  }}
/>
```

## Customization

You can customize the widget by editing:
- `src/ChatWidget.jsx` - Component logic, OAuth platforms list, behavior
- `src/ChatWidget.css` - Styling, animations, OAuth panel styles
- `tailwind.config.js` - Color scheme and theme

### Adding More OAuth Platforms

Edit the `OAUTH_PLATFORMS` array in `ChatWidget.jsx`:

```javascript
const OAUTH_PLATFORMS = [
  // ... existing platforms
  'YourNewPlatform',
  'AnotherPlatform'
]
```

## Testing

1. Start the development server:
```bash
cd /Users/dennisfarmer/CascadeProjects/neocryptz-ai-chat
npm run dev
```

2. Open http://localhost:5173 to test the standalone widget

3. Test OAuth features:
   - Click "OAuth" button to open the OAuth panel
   - Toggle platform authorizations
   - Add custom API tokens
   - Test authorization flow

4. For iframe integration, test it in your existing website context

## Deployment

When ready for production:

1. Build the widget: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update the iframe src to your production URL
4. Ensure OAuth data persists correctly in production

## Security Considerations

- **Client-Side Storage**: OAuth tokens are stored in localStorage (client-side only)
- **Token Masking**: Custom tokens are displayed masked in the UI
- **No Server Transmission**: Tokens are only sent when you explicitly implement backend integration
- **User Control**: Users have full control over their OAuth authorizations

## Support

If you need help with integration or customization, the widget is designed to be easily modified to fit your existing infrastructure. The OAuth system is modular and can be extended to support additional platforms or authentication methods.
