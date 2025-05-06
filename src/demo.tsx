import React from 'react';
import ReactDOM from 'react-dom/client';
import { FineBitesRoot } from './components/FineBites';
import './components/FineBites.css';
import '../examples/styles.css';

const App = () => {
  return (
    <FineBitesRoot 
      shortcut="Control+ArrowUp"
      animationDuration={300}
      zoomOutScale={0.5}
      onActivate={() => console.log('Mission Control activated')}
      onDeactivate={() => console.log('Mission Control deactivated')}
    >
      <div className="app">
        <div className="header">
          <h1>Fine-Bites Demo</h1>
          <div className="instructions">
            Press <kbd>Ctrl</kbd> + <kbd>↑</kbd> to activate Mission Control and see all windows.
          </div>
        </div>
        
        <div className="window-container">
          <div className="window" data-fb-window="dashboard/analytics">
            <div className="window-header">
              <h2>Analytics Dashboard</h2>
            </div>
            <div className="window-content">
              <p>This is the analytics dashboard panel.</p>
              <p>User engagement: 78%</p>
              <p>Conversion rate: 5.2%</p>
            </div>
          </div>
          
          <div className="window" data-fb-window="dashboard/users">
            <div className="window-header">
              <h2>Users Dashboard</h2>
            </div>
            <div className="window-content">
              <p>Active users: 5,238</p>
              <p>New signups today: 148</p>
              <p>Total registered: 23,651</p>
            </div>
          </div>
          
          <div className="window" data-fb-window="tools/settings">
            <div className="window-header">
              <h2>Settings</h2>
            </div>
            <div className="window-content">
              <p>Application preferences and settings panel.</p>
              <ul>
                <li>Dark mode: Enabled</li>
                <li>Notifications: All</li>
                <li>Auto-save: 5 minutes</li>
              </ul>
            </div>
          </div>
          
          <div className="window" data-fb-window="content/editor">
            <div className="window-header">
              <h2>Content Editor</h2>
            </div>
            <div className="window-content">
              <p>This is where you edit your content.</p>
              <textarea 
                rows={3} 
                style={{ width: '100%', marginTop: '10px', padding: '5px' }}
                placeholder="Write something amazing..."
              />
            </div>
          </div>
          
          <div className="window" data-fb-window="tools/calendar">
            <div className="window-header">
              <h2>Calendar</h2>
            </div>
            <div className="window-content">
              <p>Upcoming events:</p>
              <ul>
                <li>Team Meeting - 2:00 PM</li>
                <li>Project Review - 4:30 PM</li>
                <li>Client Call - Tomorrow, 10:00 AM</li>
              </ul>
            </div>
          </div>
          
          <div className="window" data-fb-window="content/media">
            <div className="window-header">
              <h2>Media Library</h2>
            </div>
            <div className="window-content">
              <p>Your media assets:</p>
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd' }}></div>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd' }}></div>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd' }}></div>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FineBitesRoot>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);