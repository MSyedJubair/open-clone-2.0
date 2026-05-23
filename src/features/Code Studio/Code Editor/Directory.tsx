import File from "./File";
import Folder from "./Folder";

const Directory = () => {
    const files = {
        'package.json': {
            file: {
                contents: JSON.stringify({
                    name: "webcontainer-app",
                    type: "module",
                    dependencies: {
                        "express": "^4.19.2",
                        "cors": "^2.8.5"
                    },
                    scripts: {
                        "start": "node api/server.js"
                    }
                }, null, 2)
            }
        },
        'api': {
            directory: {
                'server.js': {
                    file: {
                        contents: `
                        import express from 'express';
                        const app = express();
                        app.get('/api', (req, res) => res.json({ message: "Hello from WebContainer!" }));
                        app.listen(3000, () => console.log('Server running on port 3000'));
                                `.trim()
                    }
                }
            }
        },
        'src': {
            directory: {
                'main.tsx': {
                    file: {
                        contents: `console.log("App initialized");`
                    }
                },
                'sadfdasf.tsx': {
                    file: {
                        contents: `console.log("App initialized");`
                    }
                },
                'dfdf.tsx': {
                    file: {
                        contents: `console.log("App initialized");`
                    }
                },
                'efrer.tsx': {
                    file: {
                        contents: `console.log("App initialized");`
                    }
                },
                'src': {
                    directory: {
                        'main.tsx': {
                            file: {
                                contents: `console.log("App initialized");`
                            }
                        },
                        'sadfdasf.tsx': {
                            file: {
                                contents: `console.log("App initialized");`
                            }
                        },
                        'dfdf.tsx': {
                            file: {
                                contents: `console.log("App initialized");`
                            }
                        },
                        'efrer.tsx': {
                            file: {
                                contents: `console.log("App initialized");`
                            }
                        },
                    },
                }
            },
        }
    };

    return (
        <div className="max-w-3xs">
            {Object.entries(files).map(([name, data]) => {
                if ('directory' in data) {
                    return (
                        <li key={name}>
                            <Folder name={name} data={data} level={1} />
                        </li>
                    )
                } else if ('file' in data) {
                    return (
                        <li key={name}>
                            <File name={name} data={data.file.contents} level={1} />
                        </li>
                    )
                }

            })}
        </div>
    )
}

export default Directory

// https://xhamster.com/videos/natural-busty-blonde-kenzie-madison-fucks-her-crush-robby-14816845
// https://xhamster.com/videos/sex-with-my-new-busty-horny-sister-in-law-xh0yPCV