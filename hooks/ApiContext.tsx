// ApiContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for our context
interface ImageToUpload {
  uri: string;
  type?: string;
  name?: string;
}

interface ApiContextState {
  uploadedImages: ImageToUpload[];
  extractedData: any | null;
  isLoading: boolean;
  error: string | null;
  uploadImages: (images: ImageToUpload[]) => Promise<any>;
  clearData: () => void;
}

// Create the context with a default undefined value
const ApiContext = createContext<ApiContextState | undefined>(undefined);

// Props for the provider component
interface ApiProviderProps {
  children: ReactNode;
}

// Create the provider component
export function ApiProvider({ children }: ApiProviderProps): JSX.Element {
  // State for storing uploaded images data
  const [uploadedImages, setUploadedImages] = useState<ImageToUpload[]>([]);

  const urlToUse = 'https://nutrivision-backend-textrecog-77tx.onrender.com/extract/';
  
  // State for storing API response data
  const [extractedData, setExtractedData] = useState<any | null>(null);
  
  // State for tracking loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for errors
  const [error, setError] = useState<string | null>(null);

  // Function to upload images to the API endpoint
  const uploadImages = async (images: ImageToUpload[]): Promise<any> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Append each image to the form data
      images.forEach((image, index) => {
        // Get just the filename from the URI
        const uriParts = image.uri.split('/');
        const fileName = image.name || uriParts[uriParts.length - 1];
        
        // Determine file type
        const match = /\.(\w+)$/.exec(fileName);
        const type = image.type || (match ? `image/${match[1]}` : 'image/jpeg');
        
        // Append to form data - note FormData handling is different in React Native
        formData.append('files', {
          uri: image.uri,
          name: fileName,
          type: type
        } as unknown as Blob); // Type assertion needed for React Native FormData
      });

      // Make the POST request
      const response = await fetch(urlToUse, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          //'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`API error with status ${response.status}`);
      }

      // Parse the response
      const result = await response.json();
      
      // Update state with the response data
      setExtractedData(result);
      setUploadedImages(images);
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      setError(errorMessage);
      console.error('Upload error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear all data
  const clearData = (): void => {
    setUploadedImages([]);
    setExtractedData(null);
    setError(null);
  };

  // The value to be provided to consumers
  const value: ApiContextState = {
    uploadedImages,
    extractedData,
    isLoading,
    error,
    uploadImages,
    clearData
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

// Custom hook for using this