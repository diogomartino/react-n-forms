import { createContext } from 'react';

export type TOnChange = (newValue: any, key: string, type?: string) => void;
export type TOnNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type TValidate = (
  value: any,
  values: TFormContextValue['values']
) => string | undefined;

export type TFormContextValue = {
  values: Record<string, any>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  internalErrors: Record<string, string | undefined>;
  setInternalErrors: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
  setErrors: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onChange: TOnChange;
  validators: Record<string, TValidate>;
  setValidators: React.Dispatch<
    React.SetStateAction<Record<string, TValidate>>
  >;
};

const FormContext = createContext<TFormContextValue>({
  values: {},
  setValues: () => {},
  internalErrors: {},
  setInternalErrors: () => {},
  setErrors: () => {},
  errors: {},
  touched: {},
  setTouched: () => {},
  onChange: () => {},
  validators: {},
  setValidators: () => {}
});

export { FormContext };
