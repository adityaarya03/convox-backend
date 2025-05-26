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

  const widgetURL = `https://your-static-host.com/chat-widget.html?${encodedParams}`;

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
