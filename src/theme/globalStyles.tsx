// @mui
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const inputGlobalStyles = (
    <MUIGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
          /* Scrollbar CSS */
          '&::-webkit-scrollbar': {
            borderRadius: '10px',
            width: '6px',
            height: '6px',
          },

          '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            backgroundColor: 'rgba(75, 72, 72, 0.5)',
          },
          '&::-webkit-scrollbar-track': {
            borderRadius: '10px',
            backgroundColor: '#dadada',
          },
          /* Scrollbar CSS */
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          overflow: 'overlay',
        },
        '#__next': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
        ul: {
          margin: 0,
          padding: 0,
        },
        a: {
          textDecoration: 'none',
        },
      }}
    />
  );

  return inputGlobalStyles;
}
