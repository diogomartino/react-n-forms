import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';
import { TValidate } from '../../context/form-context';
import { useFormContext } from '../../hooks/use-form-context';

type THandlerType = 'native' | 'raw';
type TNativeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
type TRawOnChange = (newValue: any) => void;

type OnChangeType<T extends THandlerType> = T extends 'native'
  ? TNativeOnChange
  : TRawOnChange;

type TFieldProps<T extends THandlerType = 'native'> = {
  name: string;
  initialValue?: any;
  handlerType?: T;
  validate?: TValidate;
  children?: (props: {
    value: any;
    values: Record<string, any>;
    name: string;
    onChange: OnChangeType<T>;
    error?: string | undefined;
    onChangeField: (key: string, newValue: any) => void;
  }) => ReactElement;
};

const Field = <T extends THandlerType = 'native'>({
  name,
  initialValue,
  children,
  handlerType,
  validate
}: TFieldProps<T>) => {
  const { onChange, values, internalErrors, errors, setValidators } =
    useFormContext();
  const currentValue = useMemo(() => values[name], [values, name]);
  const error = useMemo(
    () => internalErrors[name] ?? errors[name],
    [internalErrors, name, errors]
  );

  const resolvedHandlerType = useMemo(
    () => handlerType ?? 'native',
    [handlerType]
  );

  const onNativeChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, type } = e.target;

      onChange(value, name, type);
    },
    [onChange, name]
  );

  const onRawChangeHandler = useCallback(
    (newValue: string) => {
      onChange(newValue, name);
    },
    [onChange, name]
  );

  const onChangeHandler = useMemo(
    () =>
      resolvedHandlerType === 'native'
        ? onNativeChangeHandler
        : onRawChangeHandler,
    [resolvedHandlerType, onNativeChangeHandler, onRawChangeHandler]
  );

  const onChangeFieldHandler = useCallback(
    (key: string, newValue: any) => {
      onChange(newValue, key);
    },
    [onChange]
  );

  useEffect(() => {
    if (initialValue === undefined) return;

    onChange(initialValue, name);
  }, [initialValue, name, onChange]);

  useEffect(() => {
    if (validate) {
      setValidators((prev) => ({ ...prev, [name]: validate }));
    } else {
      setValidators((prev) => {
        const validators = { ...prev };

        delete validators[name];

        return validators;
      });
    }
  }, [validate, name, setValidators]);

  return children?.({
    value: currentValue ?? '',
    values,
    name,
    onChange: onChangeHandler as OnChangeType<T>,
    error,
    onChangeField: onChangeFieldHandler
  });
};

export { Field };
