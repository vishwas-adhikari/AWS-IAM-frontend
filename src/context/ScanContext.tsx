import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { APIScanResult } from '../types';
import { API_URL, apiErrorMessage } from '../api';

interface ScanContextType {
  scanData: APIScanResult | null;
  loading: boolean;
  error: string | null;
  // Empty profile = the backend's default AWS credential chain
  startScan: (profile: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanData, setScanData] = useState<APIScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to run a NEW scan (POST)
  const startScan = async (profile: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/scan/`, { profile });
      setScanData(response.data);
    } catch (err) {
      console.error(err);
      setError(apiErrorMessage(err, "Failed to connect to scanner engine."));
      throw err; // Re-throw to handle UI redirects
    } finally {
      setLoading(false);
    }
  };

  // Function to load recent history (GET)
  const refreshHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/history/`);
      if (response.data && response.data.length > 0) {
        setScanData(response.data[0]); // Load the most recent scan
      }
    } catch (err) {
      console.error("No history found or backend offline");
    } finally {
      setLoading(false);
    }
  };

  // Load history on startup
  useEffect(() => {
    refreshHistory();
  }, []);

  return (
    <ScanContext.Provider value={{ scanData, loading, error, startScan, refreshHistory }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};