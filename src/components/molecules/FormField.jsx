import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,
  required,
  className = '',
  rows,
  ...props
}) => {
  const inputId = `form-field-${label.toLowerCase().replace(/\s/g, '-')}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            id={inputId}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full"
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full"
            {...props}
          />
        );
      default:
        return (
          <Input
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full"
            {...props}
          />
        );
    }
  };

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-sm font-medium text-surface-700 mb-1">
        {label} {required && '*'}
      </label>
      {renderInput()}
    </div>
  );
};

export default FormField;