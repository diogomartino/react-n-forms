import { useContext } from 'react';
import { FormContext } from '../context/form-context';

const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormContext');
  }
  return context;
};

export { useFormContext };
