This is the version 2 of 'OpenClone' An Ai Web Builder that i've been working on. I've changed a lot of the code structure and fixed many issues. The main issue was that the code structure was very bad. When I logged of for 1 month bcz of my exms and came back to the code, I was like "what the hell is this code". So I decided to change the code structure and make it more organized. I also added some new features and fixed some bugs. The new version is much better than the previous one and I'm very happy with it. I hope you will like it too. I've explained the new code structure and all the features in the documentation. 

Here the mind map of the new code structure:

here's the overview of the project file structure:
## Project Structure

```text
.
├── proxy.ts
│
├── app
│   ├── actions.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   │
│   ├── (auth)
│   │   ├── sign-in
│   │   │   └── page.tsx
│   │   └── sign-up
│   │       └── page.tsx
│   │
│   ├── (project)
│   │   └── project
│   │       └── [projectId]
│   │           └── page.tsx
│   │
│   ├── (root)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects
│   │       ├── page.tsx
│   │       └── me
│   │           └── page.tsx
│   │
│   ├── api
│   │   ├── auth
│   │   │   └── [...all]
│   │   │       └── route.ts
│   │   ├── inngest
│   │   │   └── route.ts
│   │   └── trpc
│   │       └── [trpc]
│   │           └── route.ts
│   │
│   └── generated
│       └── prisma
│           ├── browser.ts
│           ├── client.ts
│           ├── commonInputTypes.ts
│           ├── enums.ts
│           ├── models.ts
│           ├── internal
│           │   ├── class.ts
│           │   ├── prismaNamespace.ts
│           │   └── prismaNamespaceBrowser.ts
│           └── models
│               ├── Account.ts
│               ├── Message.ts
│               ├── Project.ts
│               ├── Session.ts
│               ├── User.ts
│               └── Verification.ts
│
├── components
│   ├── Shared
│   │   ├── NewProject.tsx
│   │   ├── ProjectHeader.tsx
│   │   └── SideBar
│   │       ├── SideBar.tsx
│   │       ├── SideBarHeader.tsx
│   │       ├── SideBarItems.tsx
│   │       └── SideBarUser.tsx
│   │
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button-group.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── combobox.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── direction.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── empty.tsx
│       ├── field.tsx
│       ├── hover-card.tsx
│       ├── input-group.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── item.tsx
│       ├── kbd.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── native-select.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── spinner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
│
├── context
│   ├── DirectoryContext.tsx
│   ├── DirectoryContextProvider.tsx
│   ├── ProjectContext.tsx
│   └── ProjectContextProvider.tsx
│
├── features
│   ├── ProjectInput
│   ├── Projects
│   │   └── ProjectsView.tsx
│   │
│   └── ProjectView
│       ├── ProjectView.tsx
│       │
│       ├── Code Studio
│       │   ├── Code Studio.tsx
│       │   │
│       │   ├── Code Editor
│       │   │   ├── CodeEditor.tsx
│       │   │   ├── Directory.tsx
│       │   │   ├── Editor.tsx
│       │   │   ├── File.tsx
│       │   │   └── Folder.tsx
│       │   │
│       │   └── Code Preview
│       │       ├── CodePreview.tsx
│       │       └── WebContainer.tsx
│       │
│       └── ProjectChat
│           ├── MessageInput.tsx
│           ├── Messages.tsx
│           └── ProjectChatView.tsx
│
├── hooks
│   └── use-mobile.ts
│
├── inngest
│   ├── client.ts
│   └── function.ts
│
├── lib
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── prisma.ts
│   ├── pusher-client.ts
│   ├── pusher-server.ts
│   ├── types.ts
│   └── utils.ts
│
└── trpc
    ├── client.tsx
    ├── init.ts
    ├── query-client.ts
    ├── server.tsx
    └── routers
        ├── Ai.ts
        ├── Message.ts
        ├── Project.ts
        └── _app.ts
```