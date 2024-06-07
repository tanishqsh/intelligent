import React, { createContext, useContext, useState, ReactNode } from 'react';
import Duration from './Overview/Duration';

// Define the shape of the context state
interface DurationContextType {
	duration: string;
	setDuration: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value
const DurationContext = createContext<DurationContextType | undefined>(undefined);

// Custom hook to use the duration context
export const useDuration = (): DurationContextType => {
	const context = useContext(DurationContext);
	if (!context) {
		throw new Error('useDuration must be used within a DurationProvider');
	}
	return context;
};

// Provider component
interface DurationProviderProps {
	children: ReactNode;
}

export const DurationProvider: React.FC<DurationProviderProps> = ({ children }) => {
	const [duration, setDuration] = useState<string>(Duration.HOURS_24);

	return <DurationContext.Provider value={{ duration, setDuration }}>{children}</DurationContext.Provider>;
};
export default DurationContext;
