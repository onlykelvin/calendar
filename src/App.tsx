import React from 'react';
import Calendar from './components/Calendar';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <Calendar />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;