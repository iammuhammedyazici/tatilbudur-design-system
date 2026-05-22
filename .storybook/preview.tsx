import type { Preview } from '@storybook/react-vite';
import React from 'react';

// Poppins fontunu yükle
const FontLoader = () => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return null;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <>
        <FontLoader />
        <div style={{ fontFamily: 'Poppins, sans-serif' }}>
          <Story />
        </div>
      </>
    ),
  ],
};

export default preview;
