import {
  HtmlHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  FormContext,
  TFormContextValue,
  TValidate
} from '../../context/form-context';
import { Field } from './field';

export type TFormRootProps = {
  submitOnlyTouched?: boolean;
  submitValuesWhenInvalid?: boolean;
  onSubmit?: (values: TFormContextValue['values'] | undefined) => void;
  initialValues?: TFormContextValue['values'];
  errors?: TFormContextValue['errors'];
  setErrors?: React.Dispatch<React.SetStateAction<TFormContextValue['errors']>>;
} & HtmlHTMLAttributes<HTMLFormElement>;

const Form = ({
  children,
  onSubmit,
  initialValues,
  errors = {},
  setErrors = () => {},
  submitOnlyTouched = false,
  submitValuesWhenInvalid = false,
  ...formProps
}: TFormRootProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [validators, setValidators] = useState<Record<string, TValidate>>({});
  const [values, setValues] = useState<TFormContextValue['values']>(
    initialValues ?? {}
  );
  const [internalErrors, setInternalErrors] = useState<
    TFormContextValue['internalErrors']
  >({});
  const [touched, setTouched] = useState<TFormContextValue['touched']>({});

  useEffect(() => {
    setValues(initialValues ?? {});
  }, [initialValues]);

  const onSubmitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      let hasErrors = false;

      const returnValues: typeof values = Object.keys(values).reduce<
        typeof values
      >((acc, key) => {
        const wasTouched = touched[key];
        const value = values[key];
        const validator = validators[key];

        if (validator) {
          const error = validator(value, values);

          if (error) {
            hasErrors = true;

            setErrors((prev) => ({ ...prev, [key]: error }));
            setInternalErrors((prev) => ({ ...prev, [key]: error }));

            return acc;
          }
        }

        if (!submitOnlyTouched || wasTouched) {
          acc[key] = values[key];
        }

        return acc;
      }, {});

      setTouched({});
      onSubmit?.(
        hasErrors && !submitValuesWhenInvalid ? undefined : returnValues
      );
    },
    [
      onSubmit,
      values,
      validators,
      touched,
      submitOnlyTouched,
      submitValuesWhenInvalid,
      setErrors
    ]
  );

  const onChange = useCallback((newValue: any, key: string, type?: string) => {
    const value = type === 'number' ? +newValue : newValue;

    setInternalErrors((prev) => ({ ...prev, [key]: undefined }));
    setValues((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const contextValue = useMemo<TFormContextValue>(
    () => ({
      values,
      setValues,
      internalErrors,
      setInternalErrors,
      touched,
      errors,
      setErrors,
      setTouched,
      onChange,
      validators,
      setValidators
    }),
    [values, internalErrors, touched, onChange, validators, errors, setErrors]
  );

  return (
    <FormContext.Provider value={contextValue}>
      <form ref={formRef} onSubmit={onSubmitHandler} {...formProps}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

Form.Field = Field;

export { Form };
