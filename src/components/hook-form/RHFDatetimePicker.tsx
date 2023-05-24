// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';

type IProps = {
  name: string;
  label: string;
};

type Props = IProps & Partial<DateTimePickerProps<unknown, unknown>>;

export default function RHFDatetimePicker({ name, label, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          value={field.value ?? null}
          inputFormat="dd/MM/yyyy HH:mm"
          onChange={(newValue) => {
            setValue(name, newValue || undefined, { shouldValidate: true, shouldDirty: true });
          }}
          dayOfWeekFormatter={(day) => day}
          {...other}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              inputProps={{
                ...params.inputProps,
                placeholder: 'dd/MM/yyyy HH:mm',
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
