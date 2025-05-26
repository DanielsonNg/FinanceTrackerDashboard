Initial Project with Vite
Create Project with npm create vite@latest
cd Project
npm install
npm run dev

Install Tailwind
npm install tailwindcss @tailwindcss/vite

add tailwind to to vite.config.ts
plugins: [
    tailwindcss(),
  ],

add @import "tailwindcss"; to index.css

Enabling React Compiler
npm install -D eslint-plugin-react-hooks@^6.0.0-rc.1
npm install babel-plugin-react-compiler@rc

add babel plugin to vite.config.ts
react({
  babel: {
    plugins: [
      ["babel-plugin-react-compiler", ReactCompilerConfig],
    ],
  },
}),

