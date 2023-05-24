// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

type IProps = {
  name: string;
  label: string;
};

type Props = IProps & Partial<DatePickerProps<unknown, unknown>>;

export default function RHFDatePicker({ name, label, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          value={field.value}
          inputFormat="dd/MM/yyyy"
          {...other}
          onChange={(newValue) => {
            setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              inputProps={{
                ...params.inputProps,
                placeholder: 'dd/MM/yyyy',
              }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  );
}
