import { useState, useEffect } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// next
import { useRouter } from 'next/router';
// @mui
import { Link, Typography, Autocomplete, InputAdornment } from '@mui/material';
// utils
// routes
import { PATH_SHOP } from '../../../../routes/paths';
// @types
import { IProduct } from '../../../../@types/product';
// components
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import { CustomTextField } from '../../../../components/custom-input';
// import SearchNotFound from '../../../../components/search-not-found';

// ----------------------------------------------------------------------

export default function ShopProductSearch() {
  const { push, query } = useRouter();

  const searchText = (typeof query.q === 'string' ? query.q : '') ?? '';

  const [searchProducts, setSearchProducts] = useState(searchText);

  useEffect(() => {
    if (searchText) setSearchProducts(searchText);
  }, [searchText]);

  const handleChangeSearch = async (value: string) => {
    try {
      setSearchProducts(value);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGotoProduct = (name: string) => {
    push({
      pathname: PATH_SHOP.product.root,
      query: {
        ...(name && { q: name }),
      },
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGotoProduct(searchProducts);
    }
  };

  return (
    <Autocomplete
      size="small"
      open={false}
      fullWidth
      autoHighlight
      popupIcon={null}
      options={[]} // searchResults
      inputValue={searchProducts}
      onInputChange={(_, value) => handleChangeSearch(value)}
      clearOnBlur={false}
      getOptionLabel={(product: IProduct) => product.name}
      // noOptionsText={<SearchNotFound query={searchProducts} />}
      // eslint-disable-next-line react/jsx-no-useless-fragment
      noOptionsText={<></>}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      componentsProps={{
        paper: {
          sx: {
            mt: 0.5,
            '& .MuiAutocomplete-option': {
              px: `8px !important`,
            },
          },
        },
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          placeholder="Tìm kiếm sách, tác giả,..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" onClick={() => handleGotoProduct(searchProducts)}>
                <Iconify
                  icon="eva:search-fill"
                  sx={{ ml: 1, color: (theme) => theme.palette.primary.main, cursor: 'pointer' }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, product, { inputValue }) => {
        const { name, cover } = product;
        const matches = match(name, inputValue);
        const parts = parse(name, matches);

        return (
          <li {...props}>
            <Image
              alt={cover}
              src={cover}
              sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }}
            />

            <Link underline="none" onClick={() => handleGotoProduct(name)}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  variant="subtitle2"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}
