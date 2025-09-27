# Announcement Framework Sample

A modern, flexible announcement system built with Next.js, React, and TypeScript. This project demonstrates how to create intelligent, context-aware announcements with tracking, targeting, and persistence capabilities.

## ✨ Features

- **🎯 Smart Targeting**: Route-based and condition-based announcement targeting
- **📊 View Tracking**: Automatic tracking of views, dismissals, and user interactions
- **💾 Persistence**: LocalStorage-based persistence across browser sessions
- **🎮 Interactive Controls**: Support for multi-step announcements and custom actions
- **🎨 Beautiful UI**: Built with Radix UI and Tailwind CSS for a modern look
- **🔧 Flexible Configuration**: Highly customizable announcement behavior
- **⚡ Performance**: Lightweight with minimal overhead

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd announcement-framework-sample
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How It Works

### Core Components

- **AnnouncementService**: Singleton service managing announcement logic, tracking, and persistence
- **AnnouncementProvider**: React context provider for announcement state management
- **AnnouncementModal**: Reusable modal component for displaying announcements
- **DemoPanel**: Interactive demo showcasing different announcement types

### Basic Usage

1. **Wrap your app with the AnnouncementProvider**:

```tsx
import { AnnouncementProvider } from "@/components/announcement/announcement-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnnouncementProvider>{children}</AnnouncementProvider>
      </body>
    </html>
  );
}
```

2. **Use the hook to show announcements**:

```tsx
import { useAnnouncement } from "@/components/announcement/announcement-provider";

function MyComponent() {
  const { showAnnouncement } = useAnnouncement();

  const showWelcome = () => {
    showAnnouncement({
      id: "welcome-v1",
      content: <div>Welcome to our app!</div>,
      modalProps: {
        title: "Welcome",
        okText: "Get Started",
      },
      maxViewCount: 1,
      targetPath: "/dashboard",
    });
  };

  return <button onClick={showWelcome}>Show Welcome</button>;
}
```

### Advanced Features

#### Route Targeting

```tsx
{
  id: 'dashboard-feature',
  targetPath: '/dashboard', // or regex: /^\/admin/
  content: <FeatureAnnouncement />
}
```

#### Conditional Display

```tsx
{
  id: 'premium-upgrade',
  condition: () => user.plan === 'free',
  content: <UpgradePrompt />
}
```

#### Multi-step Announcements

```tsx
// Step 1
showAnnouncement({
  id: "onboarding-step-1",
  content: <Step1Content />,
  onOk: () => {
    // Move to step 2
    updateAnnouncementConfig({
      id: "onboarding-step-1",
      content: <Step2Content />,
    });
    return false; // Don't close modal
  },
});
```

#### Custom Actions

```tsx
{
  id: 'survey-prompt',
  content: <SurveyInvite />,
  onOk: async () => {
    await trackSurveyResponse()
    return true // Close modal
  },
  onDismiss: (afterOk) => afterOk // Permanently dismiss if completed
}
```

## 🎛️ Configuration Options

| Option         | Type                                        | Default     | Description                                |
| -------------- | ------------------------------------------- | ----------- | ------------------------------------------ |
| `id`           | `string`                                    | Required    | Unique identifier for the announcement     |
| `content`      | `ReactNode`                                 | Required    | The announcement content                   |
| `modalProps`   | `ModalProps`                                | `{}`        | Modal configuration (title, buttons, etc.) |
| `maxViewCount` | `number`                                    | `3`         | Maximum times to show this announcement    |
| `showDelay`    | `number`                                    | `0`         | Delay in milliseconds before showing       |
| `targetPath`   | `string \| RegExp`                          | `undefined` | Route targeting                            |
| `condition`    | `() => boolean`                             | `undefined` | Custom display condition                   |
| `onShow`       | `() => void`                                | `undefined` | Callback when announcement is shown        |
| `onOk`         | `() => Promise<boolean> \| boolean \| void` | `undefined` | OK button handler                          |
| `onDismiss`    | `(afterOk?: boolean) => boolean \| void`    | `undefined` | Dismiss handler                            |

## 🛠️ Development

### Project Structure

```
├── app/                    # Next.js app router pages
├── components/
│   ├── announcement/       # Announcement system components
│   │   ├── announcement-service.ts     # Core service logic
│   │   ├── announcement-provider.tsx   # React context provider
│   │   ├── announcement-modal.tsx      # Modal component
│   │   └── demo-panel.tsx             # Demo interface
│   └── ...
├── lib/                   # Utility functions
└── styles/               # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- This project was bootstrapped using [v0.dev](https://v0.dev)
- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is a demonstration project showcasing announcement system patterns. Feel free to adapt and extend it for your specific use case.
