// @mui
import {
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  isFiltered: boolean;
  filterName: string;
  filterStatus: string[];
  statusOptions: {
    value: string;
    label: string;
  }[];
  onResetFilter: VoidFunction;
  onFilterStatus: (event: SelectChangeEvent<string[]>) => void;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProductTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <FormControl
        sx={{
          width: { xs: 1, md: 320 },
        }}
      >
        <InputLabel size="small" sx={{ '&.Mui-focused': { color: 'text.primary' } }}>
          Trạng thái
        </InputLabel>
        <Select
          multiple
          size="small"
          value={filterStatus}
          onChange={onFilterStatus}
          input={<OutlinedInput label="Trạng thái" />}
          renderValue={(selected) =>
            selected.map((value) => statusOptions.find((e) => e.value === value)!.label).join(', ')
          }
        >
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                p: 0,
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
              }}
            >
              <Checkbox disableRipple size="small" checked={filterStatus.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        size="small"
        value={filterName}
        onChange={onFilterName}
        placeholder="Tìm kiếm sách..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
