# Image Server - Quick Start Guide

## What's New

The image server now has **full Tencent Cloud Hunyuan integration** for generating images from text prompts!

## Quick Usage

### 1. Get Your Tencent Cloud Credentials

- Go to [Tencent Cloud Console](https://console.cloud.tencent.com/)
- Navigate to API Keys
- Copy your **Secret ID** and **Secret Key**

### 2. Call the Image Generation Tool

```javascript
// Using the MCP tool
mcp_call_tool(
  serverName: "image",
  toolName: "text_image",
  arguments: {
    "text": "A beautiful sunset over mountains",
    "secertId": "YOUR_SECRET_ID",
    "secertKey": "YOUR_SECRET_KEY"
  }
)
```

### 3. Get Your Image

Success response:
```json
{
  "success": true,
  "message": "Image generated successfully",
  "imageUrl": "https://hunyuan-image-url.example.com/image.jpg",
  "requestId": "req-12345678"
}
```

## Example Prompts

Try these prompts to test the server:

- `"yizhixiaomao"` - A cute cat
- `"A beautiful sunset over mountains"`
- `"A futuristic city at night"`
- `"A serene forest with a waterfall"`
- `"A space station orbiting Earth"`

## Implementation Details

### What Was Added

✅ **Tencent Cloud API Integration**
- Full support for Hunyuan text-to-image API
- TC3-HMAC-SHA256 signature generation
- Secure credential handling

✅ **Type Safety**
- TypeScript type definitions
- Input validation
- Structured responses

✅ **Error Handling**
- Comprehensive error messages
- Graceful failure handling
- Detailed logging

### Files Modified

- `src/index.ts` - Main server with Tencent Cloud integration
- `src/types/image.ts` - Type definitions (NEW)
- `IMPLEMENTATION_GUIDE.md` - Detailed documentation (NEW)
- `IMPLEMENTATION_SUMMARY.md` - Summary of changes (NEW)

## Build Status

✅ **Successfully Built**

```bash
npm run build
# Output: Successfully compiled TypeScript
```

## How It Works

```
Your Request
    ↓
Validate Parameters
    ↓
Generate Tencent Cloud Signature (TC3-HMAC-SHA256)
    ↓
Send to Hunyuan API
    ↓
Receive Image URL
    ↓
Return to You
```

## Troubleshooting

### "Invalid credentials"
- Check your Secret ID and Secret Key
- Verify they're from Tencent Cloud
- Ensure they have Hunyuan API permissions

### "API timeout"
- Check your internet connection
- Verify Tencent Cloud API is accessible
- Try again in a moment

### "Invalid prompt"
- Ensure text is not empty
- Try a simpler prompt
- Avoid special characters

## Next Steps

1. **Restart the MCP server** to load the new code
2. **Test with your credentials**
3. **Generate your first image!**

## Documentation

For more details, see:
- `IMPLEMENTATION_GUIDE.md` - Complete technical guide
- `IMPLEMENTATION_SUMMARY.md` - Summary of changes

## Support

Need help? Check:
1. The error message for specific issues
2. `IMPLEMENTATION_GUIDE.md` for troubleshooting
3. Tencent Cloud documentation for API issues

---

**Ready to generate images?** 🎨

Get your credentials and start using the `text_image` tool!
