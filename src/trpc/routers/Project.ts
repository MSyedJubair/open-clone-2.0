import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';

export const Project = createTRPCRouter({
  getProject: protectedProcedure
    .input(z.object({
      projectId: z.number()
    }))
    .query(async (opts) => {
      const project = await opts.ctx.db.project.findUnique({
        where: {
          id: opts.input.projectId
        }
      })

      return project
    }),

  newProject: protectedProcedure
    .mutation(async ({ ctx }) => {
      const files = {
        "package.json": {
          file: {
            contents: `
                {
                  "name": "openclone-ai",
                  "private": true,
                  "version": "0.0.0",
                  "type": "module",
                  "scripts": {
                    "dev": "vite",
                    "build": "vite build",
                    "preview": "vite preview"
                  },
                  "dependencies": {
                    "react": "^18.3.1",
                    "react-dom": "^18.3.1"
                  },
                  "devDependencies": {
                    "@vitejs/plugin-react": "^4.3.1",
                    "autoprefixer": "^10.4.20",
                    "postcss": "^8.4.47",
                    "tailwindcss": "^3.4.13",
                    "vite": "^5.4.8"
                  }
                }
                      `,
          },
        },

        "vite.config.js": {
          file: {
            contents: `
                import { defineConfig } from 'vite';
                import react from '@vitejs/plugin-react';

                export default defineConfig({
                  plugins: [react()],
                });
                      `,
          },
        },

        "tailwind.config.js": {
          file: {
            contents: `
                
                export default {
                  content: [
                    "./index.html",
                    "./src/**/*.{js,ts,jsx,tsx}",
                  ],
                  theme: {
                    extend: {},
                  },
                  plugins: [],
                };
                      `,
          },
        },

        "postcss.config.js": {
          file: {
            contents: `
                export default {
                  plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                  },
                };
                      `,
          },
        },

        "index.html": {
          file: {
            contents: `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>OpenClone.ai</title>
                  </head>
                  <body>
                    <div id="root"></div>
                    <script type="module" src="/src/main.jsx"></script>
                  </body>
                </html>
                      `,
          },
        },

        src: {
          directory: {
            "main.jsx": {
              file: {
                contents: `
                import React from 'react';
                import ReactDOM from 'react-dom/client';
                import App from './App';
                import './index.css';

                ReactDOM.createRoot(document.getElementById('root')).render(
                  <React.StrictMode>
                    <App />
                  </React.StrictMode>
                );
                          `,
              },
            },

            "index.css": {
              file: {
                contents: `
                @tailwind base;
                @tailwind components;
                @tailwind utilities;

                body {
                  margin: 0;
                  font-family: Inter, sans-serif;
                }
                          `,
              },
            },

            "App.jsx": {
              file: {
                contents: `
                export default function App() {
                  return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white p-4">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25"></div>

                        <h1 className="relative text-5xl font-bold mb-4 tracking-tighter">
                          OpenClone.ai
                        </h1>
                      </div>

                      <p className="text-zinc-400 font-medium">
                        Your Initial Setup Is Ready!
                      </p>
                    </div>
                  );
                }
                          `,
              },
            },

            components: {
              directory: {
                "Header.jsx": {
                  file: {
                    contents: `
                export default function Header() {
                  return (
                    <div className="relative">
                      <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25"></div>

                      <h1 className="relative text-5xl font-bold mb-4 tracking-tighter">
                        OpenClone.ai
                      </h1>
                    </div>
                  );
                }
                              `,
                  },
                },
              },
            },
          },
        },
      };

      try {
        const project = await ctx.db.project.create({
          data: {
            name: 'New Project',
            description: 'New Project',
            files: JSON.stringify(files),

            authorId: ctx.session.user.id,
            status: 'DRAFT',
          }
        })

        const message = await ctx.db.message.create({
          data: {
            role: 'AI',
            message: "I've done the inital setup.",
            projectId: project.id
          }
        })

        return project.id

      } catch(error) {
        console.error("Project creation failed:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR'
        })
      }
    })
});