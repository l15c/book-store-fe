import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
//
import Iconify from '../../iconify';
import { varFade } from '../../animate';
import FileThumbnail, { fileData } from '../../file-thumbnail';
//
import { PreviewProps, UploadProps } from '../types';

// ----------------------------------------------------------------------

export default function MultiFilePreview({
  thumbnail,
  files,
  onRemove,
  sx,
  itemPerRow = 2,
  gridProps,
  scrollX,
}: PreviewProps & UploadProps) {
  if (!files?.length) {
    return null;
  }

  return (
    <Grid
      container
      {...gridProps}
      columns={itemPerRow}
      {...(scrollX && { wrap: 'nowrap', sx: { overflowX: 'overlay', pb: 1.5 } })}
    >
      <AnimatePresence initial={false}>
        {files.map((file) => {
          const { key, name = '', size = 0 } = fileData(file);

          const isNotFormatFile = typeof file === 'string';

          if (thumbnail) {
            if (gridProps) {
              return (
                <Grid
                  item
                  key={key}
                  component={m.div}
                  {...varFade().inUp}
                  xs={1}
                  {...(scrollX && { minWidth: '66%' })}
                >
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 1,
                      height: 400,
                      borderRadius: 1.25,
                      overflow: 'hidden',
                      position: 'relative',
                      border: (theme) => `solid 1px ${theme.palette.divider}`,
                      ...sx,
                    }}
                  >
                    <FileThumbnail
                      tooltip
                      imageView
                      file={file}
                      sx={{ position: 'absolute', objectFit: 'contain' }}
                      imgSx={{ position: 'absolute', objectFit: 'contain' }}
                    />

                    {onRemove && (
                      <IconButton
                        size="small"
                        onClick={() => onRemove(file)}
                        sx={{
                          top: 4,
                          right: 4,
                          p: '1px',
                          position: 'absolute',
                          color: (theme) => alpha(theme.palette.common.white, 0.72),
                          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                          },
                        }}
                      >
                        <Iconify icon="eva:close-fill" width={16} />
                      </IconButton>
                    )}
                  </Stack>
                </Grid>
              );
            }

            return (
              <Stack
                key={key}
                component={m.div}
                {...varFade().inUp}
                alignItems="center"
                display="inline-flex"
                justifyContent="center"
                sx={{
                  m: 0.5,
                  width: 400,
                  height: 400,
                  borderRadius: 1.25,
                  overflow: 'hidden',
                  position: 'relative',
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                  ...sx,
                }}
              >
                <FileThumbnail
                  tooltip
                  imageView
                  file={file}
                  sx={{ position: 'absolute' }}
                  imgSx={{ position: 'absolute' }}
                />

                {onRemove && (
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 4,
                      right: 4,
                      p: '1px',
                      position: 'absolute',
                      color: (theme) => alpha(theme.palette.common.white, 0.72),
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      },
                    }}
                  >
                    <Iconify icon="eva:close-fill" width={16} />
                  </IconButton>
                )}
              </Stack>
            );
          }

          return (
            <Stack
              key={key}
              component={m.div}
              {...varFade().inUp}
              spacing={2}
              direction="row"
              alignItems="center"
              sx={{
                my: 1,
                px: 1,
                py: 0.75,
                borderRadius: 0.75,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                ...sx,
              }}
            >
              <FileThumbnail file={file} />

              <Stack flexGrow={1} sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {isNotFormatFile ? file : name}
                </Typography>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {isNotFormatFile ? '' : fData(size)}
                </Typography>
              </Stack>

              {onRemove && (
                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              )}
            </Stack>
          );
        })}
      </AnimatePresence>
    </Grid>
  );
}
