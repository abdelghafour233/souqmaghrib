<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>متجر المغرب | SouqMaghrib</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Cairo', 'sans-serif'],
            },
            colors: {
              primary: '#059669', // Emerald 600
              secondary: '#1e293b', // Slate 800
              accent: '#f59e0b', // Amber 500
            }
          },
        },
      }
    </script>
    <style>
      body {
        font-family: 'Cairo', sans-serif;
        background-color: #f8fafc;
      }
      #error-display {
        display: none;
        color: #7f1d1d;
        background-color: #fef2f2;
        border: 1px solid #f87171;
        padding: 20px;
        margin: 20px;
        border-radius: 8px;
        text-align: center;
        direction: ltr;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.2.3",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react/": "https://esm.sh/react@^19.2.3/",
    "@google/genai": "https://esm.sh/@google/genai@^1.33.0",
    "lucide-react": "https://esm.sh/lucide-react@^0.561.0",
    "vite": "https://esm.sh/vite@^7.3.0",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.2"
  }
}
</script>
</head>
  <body>
    <div id="root">
      <div class="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500 font-sans">
        <div class="text-center">
          <div class="mb-4 text-primary text-4xl animate-bounce">🛡️</div>
          <p>جار التحميل...</p>
        </div>
      </div>
    </div>
    
    <!-- Error Handler Script -->
    <div id="error-display"></div>
    <script>
      window.onerror = function(message, source, lineno, colno, error) {
        const root = document.getElementById('root');
        const errDisplay = document.getElementById('error-display');
        console.error("Global Error:", message, error);
        
        // Only hide root if it's completely empty or just loading
        if(root && root.innerText.includes('جار التحميل')) {
           root.style.opacity = '0.5';
        }
        
        if(errDisplay) {
          errDisplay.style.display = 'block';
          errDisplay.innerHTML = '<strong>Application Error:</strong> ' + message;
        }
      };
    </script>

    <script type="module" src="/index.tsx"></script>
  </body>
</html>
