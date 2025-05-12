// Export components
export { ExposeProvider } from './context/ExposeContext';
export { ExposeWrapper } from './components/ExposeWrapper';
export { ExposeTrigger } from './components/ExposeTrigger'; 

// Export hooks
export { useExpose } from './context/ExposeContext';

// Export types
export type { 
  ExposeContextType, 
  ExposeProviderProps,
  ExposeWrapperProps,
} from './types';

// Import styles
import './components/styles.css';