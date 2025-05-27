export const generateScript = (req, res) => {
  const { user_id, primaryColor, secondaryColor, fontFamily } = req.body;

  if (!user_id || !primaryColor || !secondaryColor || !fontFamily) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const encodedParams = new URLSearchParams({
    user_id,
    primaryColor,
    secondaryColor,
    fontFamily,
  }).toString();

  const widgetURL = `https://convo-x-signup.vercel.app/chat-widget?${encodedParams}`;

  const scriptTag = `
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = "${widgetURL}";
    iframe.style = "border: none; width: 400px; height: 600px; position: fixed; bottom: 20px; right: 20px; z-index: 9999;";
    document.body.appendChild(iframe);
  })();
</script>`.trim();

  res.status(200).send(scriptTag);
};

export const widgetScript = (req, res) => {
  const { user_id, primaryColor, secondaryColor, fontFamily } = req.body;

  const encodedUserId = encodeURIComponent(user_id || '');
  const iframeUrl = `https://convo-x-signup.vercel.app/chat-widget?user_id=${encodedUserId}&primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&fontFamily=${fontFamily}`;

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>ConvoX Widget</title>
      <style>body { margin: 0; }</style>
    </head>
    <body>
      <iframe
        src="${iframeUrl}"
        style="border: none; width: 100vw; height: 100vh;">
      </iframe>
    </body>
    </html>
  `);
};
