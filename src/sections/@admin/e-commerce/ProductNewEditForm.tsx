import * as Yup from 'yup';
import { compact } from 'lodash';
import { paramCase } from 'change-case';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, InputAdornment, Modal, Stack, Typography } from '@mui/material';
// @types
import { NumberFormatValues } from 'react-number-format/types/types';
// routes
import { PATH_ADMIN } from '../../../routes/paths';
// components
import { CustomFile } from '../../../components/upload';
import FormProvider, {
  RHFAutocomplete,
  RHFEditor,
  RHFSwitch,
  RHFTextField,
  RHFUpload,
} from '../../../components/hook-form';
import { IAuthor, IBook, IGenre, IPublisher } from '../../../@types/book';
import { useData } from '../../../hooks/data';
import NumericFormatCustom from '../../../components/numeric-format-custom';
import { toNonAccentVietnamese } from '../../../utils/stringConverter';
import { cloudinaryApi } from '../../../api-client/cloudinary';
import bookApi from '../../../api-client/book';
import { getLinkImage } from '../../../utils/cloudinary';
import Iconify from '../../../components/iconify';
import GenreNewEditForm from './GenreNewEditForm';

// ----------------------------------------------------------------------

interface FormValuesProps
  extends Omit<IBook, 'id' | 'author' | 'genre' | 'publisher' | 'cover' | 'images'> {
  stopSale: boolean;
  author: IAuthor | null;
  genre: IGenre | null;
  publisher: IPublisher | null;
  cover: CustomFile | string;
  images: (CustomFile | string)[];
}

type Props = {
  isEdit?: boolean;
  currentProduct?: IBook;
};

export default function ProductNewEditForm({ isEdit, currentProduct }: Props) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const {
    query: { genreQuery, authorQuery, publisherQuery },
  } = useData();

  const authors = authorQuery.data ?? [];
  const genres = genreQuery.data ?? [];
  const publishers = publisherQuery.data ?? [];

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      publishedYear: currentProduct?.publishedYear || 0,
      cover: currentProduct
        ? (getLinkImage(currentProduct.cover, `products/${currentProduct.slug}`) as string)
        : '',
      images: currentProduct
        ? (getLinkImage(currentProduct.images, `products/${currentProduct.slug}`) as string[])
        : [],
      price: currentProduct?.price || 0,
      discount: currentProduct?.discount || 0,
      quantity: Math.max(currentProduct?.quantity || 0, 0),
      stopSale: (currentProduct?.quantity ?? 0) < 0,
      author: currentProduct?.author || null,
      genre: currentProduct?.genre || null,
      publisher: currentProduct?.publisher || null,
    }),
    [currentProduct]
  );

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng thêm tên sách'),
    description: Yup.string().required('Vui lòng nhập mô tả'),
    publishedYear: Yup.number()
      .min(1990, `Năm xuất bản trong khoảng (1990 - ${new Date().getFullYear()})`)
      .max(
        new Date().getFullYear(),
        `Năm xuất bản trong khoảng (1990 - ${new Date().getFullYear()})`
      ),
    cover: Yup.mixed().test('requiredCover', 'Vui lòng thêm ảnh bìa', (value) => !!value),
    author: Yup.object().required('Vui lòng thêm tác giả'),
    genre: Yup.object().required('Vui lòng thêm thể loại'),
    publisher: Yup.object().required('Vui lòng thêm nhà xuất bản'),
    images: Yup.array().min(1, 'Vui lòng thêm ít nhất 1 ảnh'),
    price: Yup.number().moreThan(1000, 'Đơn giá phải lớn hơn 1.000đ'),
    quantity: Yup.number().required('Vui lòng thêm số lượng'),
  });

  const methods = useForm<FormValuesProps>({
    mode: 'onBlur',
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
  } = methods;

  const values = watch();

  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [searchPublisher, setSearchPublisher] = useState('');

  const [openModal, setOpenModal] = useState<null | 'genre' | 'author' | 'publisher'>(null);

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (data: FormValuesProps) => {
    const {
      name,
      cover,
      images,
      description,
      price,
      discount,
      quantity,
      author,
      stopSale,
      publishedYear,
      genre,
      publisher,
    } = data;
    try {
      const slug = paramCase(toNonAccentVietnamese(name.toLowerCase()));

      let coverUrl;
      if (typeof cover !== 'string') {
        await cloudinaryApi.uploadSign(cover, {
          public_id: 'cover',
          folder: `products/${slug}`,
        });
        coverUrl = 'cover';
      } else coverUrl = cover;

      const listPromise = compact(
        images.map((e, index) => {
          if (typeof e === 'string') return undefined;
          return { file: e, index };
        })
      ).map((e) =>
        cloudinaryApi
          .uploadSign(e.file, { public_id: `image${e.index + 1}`, folder: `products/${slug}` })
          .then((res) => {
            images[e.index] = `image${e.index + 1}`;
            return res;
          })
      );

      await Promise.all(listPromise);

      const body = {
        name,
        description,
        slug,
        cover: coverUrl,
        images: images as string[],
        price,
        discount,
        quantity: stopSale ? -1 : quantity,
        publishedYear,
        sold: isEdit ? currentProduct?.sold : 0,
        authorId: author!.id,
        genreId: genre!.id,
        publisherId: publisher!.id,
        releaseDate: isEdit ? currentProduct?.releaseDate : new Date().toISOString(),
      };

      await bookApi.add(body);
      reset();
      enqueueSnackbar(!isEdit ? 'Thêm sản phẩm thành công!' : 'Cập nhật thành công!');
      push(PATH_ADMIN.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleDropCover = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });

      setValue('cover', newFiles, { shouldValidate: true });
    },
    [setValue]
  );

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField
                  name="name"
                  label="Tên sách"
                  onChange={(event) =>
                    setValue('name', event.target.value, { shouldValidate: true })
                  }
                />

                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Mô tả
                  </Typography>

                  <RHFEditor simple name="description" placeholder="Nhập mô tả..." />
                </Stack>

                <Stack spacing={2}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Ảnh bìa
                    </Typography>
                    <RHFUpload
                      name="cover"
                      maxSize={3145728}
                      sx={{
                        '& img': { objectFit: 'contain' },
                        ...(!values.cover && { '& > div:first-of-type': { p: 2 } }),
                      }}
                      onDrop={handleDropCover}
                      onRemove={handleRemoveFile}
                      onUpload={() => console.log('ON UPLOAD')}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Ảnh minh họa
                    </Typography>
                    <RHFUpload
                      name="images"
                      multiple
                      thumbnail
                      maxSize={3145728}
                      sx={{ '& > div:first-of-type': { p: 2 } }}
                      previewProps={{
                        gridProps: { spacing: 2 },
                      }}
                      onDrop={handleDrop}
                      onRemove={handleRemoveFile}
                      onRemoveAll={handleRemoveAllFiles}
                      onUpload={() => console.log('ON UPLOAD')}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <RHFSwitch name="stopSale" label="Ngừng kinh doanh" />

                <Stack spacing={3} mt={2}>
                  <RHFTextField
                    name="quantity"
                    label="Số lượng"
                    onChange={(event) =>
                      setValue('quantity', Number(event.target.value), { shouldValidate: true })
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ inputComponent: NumericFormatCustom }}
                  />

                  <RHFTextField
                    name="publishedYear"
                    label="Năm xuất bản"
                    placeholder={`1990 - ${new Date().getFullYear()}`}
                    onChange={(event) =>
                      setValue('publishedYear', Number(event.target.value), {
                        shouldValidate: true,
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ inputComponent: NumericFormatCustom }}
                    inputProps={{
                      isAllowed: (_val: NumberFormatValues) => {
                        const { formattedValue, floatValue = 0 } = _val;
                        return formattedValue === '' || floatValue <= new Date().getFullYear();
                      },
                      thousandSeparator: false,
                    }}
                  />

                  <RHFAutocomplete
                    name="author"
                    label="Tác giả"
                    options={authors}
                    clearOnBlur={false}
                    ChipProps={{ size: 'small' }}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    getOptionLabel={(option) => (option as IAuthor).name ?? option}
                    onInputChange={(_, value) => setSearchAuthor(value)}
                    noOptionsText={
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        onClick={() => setOpenModal('author')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          my: 1,
                          px: 2,
                          py: 0.75,
                          '&:hover': {
                            bgcolor: 'rgba(145, 158, 171, 0.08)',
                          },
                        }}
                      >
                        <Iconify icon="eva:plus-fill" />
                        <Typography variant="subtitle2">
                          Thêm tác giả &ldquo;<strong>{searchAuthor}</strong>&rdquo;
                        </Typography>
                      </Stack>
                    }
                  />

                  <RHFAutocomplete
                    name="genre"
                    label="Thể loại"
                    options={genres}
                    ChipProps={{ size: 'small' }}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    getOptionLabel={(option) => (option as IGenre).name ?? option}
                    clearOnBlur={false}
                    onInputChange={(_, value) => setSearchGenre(value)}
                    noOptionsText={
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        onClick={() => setOpenModal('genre')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          my: 1,
                          px: 2,
                          py: 0.75,
                          '&:hover': {
                            bgcolor: 'rgba(145, 158, 171, 0.08)',
                          },
                        }}
                      >
                        <Iconify icon="eva:plus-fill" />
                        <Typography variant="subtitle2">
                          Thêm thể loại &ldquo;<strong>{searchGenre}</strong>&rdquo;
                        </Typography>
                      </Stack>
                    }
                  />

                  <RHFAutocomplete
                    name="publisher"
                    label="Nhà xuất bản"
                    options={publishers}
                    clearOnBlur={false}
                    ChipProps={{ size: 'small' }}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    getOptionLabel={(option) => (option as IPublisher).name ?? option}
                    onInputChange={(_, value) => setSearchPublisher(value)}
                    noOptionsText={
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        onClick={() => setOpenModal('publisher')}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          my: 1,
                          px: 2,
                          py: 0.75,
                          '&:hover': {
                            bgcolor: 'rgba(145, 158, 171, 0.08)',
                          },
                        }}
                      >
                        <Iconify icon="eva:plus-fill" />
                        <Typography variant="subtitle2">
                          Thêm nhà xuất bản &ldquo;<strong>{searchPublisher}</strong>&rdquo;
                        </Typography>
                      </Stack>
                    }
                  />
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={2}>
                  <RHFTextField
                    name="price"
                    label="Đơn giá"
                    placeholder="0 - 1.000.000"
                    onChange={(event) =>
                      setValue('price', Number(event.target.value), { shouldValidate: true })
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      inputComponent: NumericFormatCustom,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            VNĐ
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <RHFTextField
                    name="discount"
                    label="Giảm giá (%)"
                    placeholder="0 - 100%"
                    onChange={(event) => setValue('discount', Number(event.target.value))}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ inputComponent: NumericFormatCustom }}
                    inputProps={{
                      isAllowed: (_val: NumberFormatValues) => {
                        const { formattedValue, floatValue = 0 } = _val;
                        return formattedValue === '' || floatValue <= 100;
                      },
                    }}
                  />
                </Stack>
              </Card>

              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                disabled={!isDirty || !isValid}
              >
                {!isEdit ? 'Thêm sản phẩm' : 'Cập nhật'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
      <Modal open={!!openModal} onClose={() => setOpenModal(null)}>
        <Box>
          {openModal === 'genre' && (
            <GenreNewEditForm
              genre={{ name: searchGenre }}
              onCancel={() => {
                setOpenModal(null);
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}
