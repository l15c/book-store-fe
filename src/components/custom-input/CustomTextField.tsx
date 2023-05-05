// @mui
import { styled } from '@mui/material/styles';
import { TextField, TextFieldProps } from '@mui/material';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  width?: number;
};

const CustomTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'width',
})<Props>(({ width, theme }) => ({
  background: '#f6f5f7',
  borderRadius: 999,
  '& fieldset': {
    display: 'none',
  },
  '& .MuiOutlinedInput-root': {
    width,
    borderRadius: 999,

    '&.Mui-focused': {
      boxShadow: theme.customShadows.z20,
      outline: `solid 3.6px ${theme.palette.primary.light}`,
    },
  },
}));

export default CustomTextField;
