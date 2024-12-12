# React N Forms

This is currently in alpha. **Please do not use in production.**

## Simple usage

```jsx
const MyForm = () => {
  const [errors, setErrors] = useState({
    name: 'You cannot be named John Doe'
  });
  const [values, setValues] = useState({});

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form
      onSubmit={onSubmit}
      errors={errors}
      setErrors={setErrors}
      initalValues={{
        name: 'John Doe'
      }}
    >
      <Form.Field name="name">
        {({ value, onChange, name, error }) => (
          <div>
            <label>Name</label>
            <input value={value} onChange={onChange} name={name} />
            {error && <span>{error}</span>}
          </div>
        )}
      </Form.Field>
      <button type="submit">Submit</button>
    </Form>
  );
};
```
