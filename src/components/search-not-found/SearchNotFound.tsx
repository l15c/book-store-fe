import { Paper, PaperProps, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Paper
      sx={{
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="body2">
        Không tìm thấy kết quả cho &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br />
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Vui lòng nhập nội dung tìm kiếm
    </Typography>
  );
}
