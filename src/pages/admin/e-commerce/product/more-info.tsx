import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from 'src/layouts/admin';
import {
  PublisherNewEditForm,
  AuthorNewEditForm,
  GenreNewEditForm,
} from 'src/sections/@admin/e-commerce';
import {
  Container,
  Grid,
  Modal,
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useData } from 'src/hooks/data';
import Iconify from 'src/components/iconify/Iconify';
import { IAuthor, IGenre, IPublisher } from 'src/@types/book';
import { toNonAccentVietnamese as nonAccent } from 'src/utils/stringConverter';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import RoleBasedGuard from 'src/auth/RoleBasedGuard';

// ----------------------------------------------------------------------
ProductMoreInfoPage.getLayout = (page: React.ReactElement) => (
  <AdminLayout>
    <RoleBasedGuard hasContent roles={[1, 2, 3, 5]}>
      {page}
    </RoleBasedGuard>
  </AdminLayout>
);

export default function ProductMoreInfoPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { genreQuery, authorQuery, publisherQuery },
    // mutation: { authorMutation, genreMutation, publisherMutation },
  } = useData();

  const authors = authorQuery.data ?? [];
  const genres = genreQuery.data ?? [];
  const publishers = publisherQuery.data ?? [];

  const [isEdit, setIsEdit] = useState(false);

  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [searchPublisher, setSearchPublisher] = useState('');

  const [editAuthor, setEditAuthor] = useState<IAuthor | null>(null);
  const [editGenre, setEditGenre] = useState<IGenre | null>(null);
  const [editPublisher, setEditPublisher] = useState<IPublisher | null>(null);

  const [openModal, setOpenModal] = useState<null | 'genre' | 'author' | 'publisher'>(null);

  return (
    <>
      <Head>
        <title>Thông tin khác | Book Store</title>
      </Head>

      <Container
        maxWidth={themeStretch ? false : 'lg'}
        sx={{ maxHeight: '100vdh', overflow: 'hidden' }}
      >
        <Grid container spacing={2} my={2}>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Autocomplete
                options={authors.sort((a, b) =>
                  nonAccent(a.name.toLowerCase()) > nonAccent(b.name.toLowerCase()) ? 1 : -1
                )}
                clearOnBlur={false}
                fullWidth
                value={editAuthor}
                inputValue={searchAuthor}
                onChange={(e, value) => setEditAuthor(value)}
                onInputChange={(_, value) => setSearchAuthor(value)}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                getOptionLabel={(option) => (option as IAuthor).name ?? option}
                renderInput={({ InputProps, ...params }) => (
                  <TextField
                    label="Tác giả"
                    {...params}
                    InputProps={{
                      ...InputProps,
                      endAdornment: (
                        <>
                          {authorQuery.isFetching ? (
                            <CircularProgress
                              color="inherit"
                              size={20}
                              sx={{
                                color: (_theme) => _theme.palette.primary.main,
                              }}
                            />
                          ) : null}
                          {InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    onClick={() => setOpenModal('author')}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
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
                renderOption={(props, option, { inputValue }) => {
                  const partsName = parse(
                    option.name,
                    match(nonAccent(option.name), nonAccent(inputValue), {
                      insideWords: true,
                    })
                  );

                  return (
                    <Stack
                      component="li"
                      {...props}
                      direction="row"
                      justifyContent="space-between !important"
                      sx={{
                        '&:hover > .icon-edit': {
                          display: 'block',
                        },
                      }}
                    >
                      <Box>
                        {partsName.map((part, index) => (
                          <Box
                            key={index}
                            component="span"
                            sx={{ color: part.highlight ? 'primary.main' : 'text.primary' }}
                          >
                            {part.text}
                          </Box>
                        ))}
                      </Box>

                      <Iconify
                        icon="eva:edit-fill"
                        className="icon-edit"
                        fontSize={20}
                        sx={{
                          display: 'none',
                          color: (_theme) => _theme.palette.primary.main,
                        }}
                        onClick={() => {
                          setEditAuthor(option);
                          setIsEdit(true);
                          setOpenModal('author');
                        }}
                      />
                      {/* <CircularProgress
                          size={20}
                          sx={{
                            color: (_theme) => _theme.palette.primary.main,
                          }}
                        /> */}
                    </Stack>
                  );
                }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setSearchAuthor('');
                  setOpenModal('author');
                }}
                sx={{ height: 40, minWidth: 120 }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Thêm mới
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Autocomplete
                options={genres.sort((a, b) =>
                  nonAccent(a.name.toLowerCase()) > nonAccent(b.name.toLowerCase()) ? 1 : -1
                )}
                clearOnBlur={false}
                fullWidth
                value={editGenre}
                inputValue={searchGenre}
                onChange={(e, value) => setEditGenre(value)}
                onInputChange={(_, value) => setSearchGenre(value)}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                getOptionLabel={(option) => (option as IGenre).name ?? option}
                renderInput={({ InputProps, ...params }) => (
                  <TextField
                    label="Thể loại"
                    {...params}
                    InputProps={{
                      ...InputProps,
                      endAdornment: (
                        <>
                          {genreQuery.isFetching ? (
                            <CircularProgress
                              color="inherit"
                              size={20}
                              sx={{
                                color: (_theme) => _theme.palette.primary.main,
                              }}
                            />
                          ) : null}
                          {InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    onClick={() => setOpenModal('genre')}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
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
                renderOption={(props, option, { inputValue }) => {
                  const partsName = parse(
                    option.name,
                    match(nonAccent(option.name), nonAccent(inputValue), {
                      insideWords: true,
                    })
                  );

                  return (
                    <Stack
                      component="li"
                      {...props}
                      direction="row"
                      justifyContent="space-between !important"
                      sx={{
                        '&:hover > .icon-edit': {
                          display: 'block',
                        },
                      }}
                    >
                      <Box>
                        {partsName.map((part, index) => (
                          <Box
                            key={index}
                            component="span"
                            sx={{ color: part.highlight ? 'primary.main' : 'text.primary' }}
                          >
                            {part.text}
                          </Box>
                        ))}
                      </Box>

                      <Iconify
                        icon="eva:edit-fill"
                        className="icon-edit"
                        fontSize={20}
                        sx={{
                          display: 'none',
                          color: (_theme) => _theme.palette.primary.main,
                        }}
                        onClick={() => {
                          setEditGenre(option);
                          setIsEdit(true);
                          setOpenModal('genre');
                        }}
                      />
                      {/* <CircularProgress
                          size={20}
                          sx={{
                            color: (_theme) => _theme.palette.primary.main,
                          }}
                        /> */}
                    </Stack>
                  );
                }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setSearchGenre('');
                  setOpenModal('genre');
                }}
                sx={{ height: 40, minWidth: 120 }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Thêm mới
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Autocomplete
                options={publishers.sort((a, b) =>
                  nonAccent(a.name.toLowerCase()) > nonAccent(b.name.toLowerCase()) ? 1 : -1
                )}
                clearOnBlur={false}
                fullWidth
                value={editPublisher}
                inputValue={searchPublisher}
                onChange={(e, value) => setEditPublisher(value)}
                onInputChange={(_, value) => setSearchPublisher(value)}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                getOptionLabel={(option) => (option as IPublisher).name ?? option}
                renderInput={({ InputProps, ...params }) => (
                  <TextField
                    label="Nhà xuất bản"
                    {...params}
                    InputProps={{
                      ...InputProps,
                      endAdornment: (
                        <>
                          {publisherQuery.isFetching ? (
                            <CircularProgress
                              color="inherit"
                              size={20}
                              sx={{
                                color: (_theme) => _theme.palette.primary.main,
                              }}
                            />
                          ) : null}
                          {InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    onClick={() => setOpenModal('publisher')}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      px: 2,
                      py: 0.75,
                      '&:hover': {
                        bgcolor: 'rgba(145, 158, 171, 0.08)',
                      },
                    }}
                  >
                    <Iconify icon="eva:plus-fill" />
                    <Typography variant="subtitle2">
                      Thêm thể loại &ldquo;<strong>{searchPublisher}</strong>&rdquo;
                    </Typography>
                  </Stack>
                }
                renderOption={(props, option, { inputValue }) => {
                  const partsName = parse(
                    option.name,
                    match(nonAccent(option.name), nonAccent(inputValue), {
                      insideWords: true,
                    })
                  );

                  return (
                    <Stack
                      component="li"
                      {...props}
                      direction="row"
                      justifyContent="space-between !important"
                      sx={{
                        '&:hover > .icon-edit': {
                          display: 'block',
                        },
                      }}
                    >
                      <Box>
                        {partsName.map((part, index) => (
                          <Box
                            key={index}
                            component="span"
                            sx={{ color: part.highlight ? 'primary.main' : 'text.primary' }}
                          >
                            {part.text}
                          </Box>
                        ))}
                      </Box>

                      <Iconify
                        icon="eva:edit-fill"
                        className="icon-edit"
                        fontSize={20}
                        sx={{
                          display: 'none',
                          color: (_theme) => _theme.palette.primary.main,
                        }}
                        onClick={() => {
                          setEditPublisher(option);
                          setIsEdit(true);
                          setOpenModal('publisher');
                        }}
                      />
                      {/* <CircularProgress
                          size={20}
                          sx={{
                            color: (_theme) => _theme.palette.primary.main,
                          }}
                        /> */}
                    </Stack>
                  );
                }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setSearchPublisher('');
                  setOpenModal('publisher');
                }}
                sx={{ height: 40, minWidth: 120 }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Thêm mới
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Modal open={!!openModal} onClose={() => setOpenModal(null)}>
          <Box>
            {openModal === 'author' && (
              <AuthorNewEditForm
                isEdit={isEdit}
                author={isEdit ? editAuthor : { name: searchAuthor }}
                onCancel={() => setOpenModal(null)}
                onSuccess={() => {
                  setEditAuthor(null);
                  setSearchAuthor('');
                }}
                onCloseModal={() => setOpenModal(null)}
              />
            )}
            {openModal === 'genre' && (
              <GenreNewEditForm
                isEdit={isEdit}
                genre={isEdit ? editGenre : { name: searchGenre }}
                onCancel={() => setOpenModal(null)}
                onSuccess={() => {
                  setEditGenre(null);
                  setSearchGenre('');
                }}
                onCloseModal={() => setOpenModal(null)}
              />
            )}
            {openModal === 'publisher' && (
              <PublisherNewEditForm
                isEdit={isEdit}
                publisher={isEdit ? editPublisher : { name: searchPublisher }}
                onCancel={() => setOpenModal(null)}
                onSuccess={() => {
                  setEditPublisher(null);
                  setSearchPublisher('');
                }}
                onCloseModal={() => setOpenModal(null)}
              />
            )}
          </Box>
        </Modal>
      </Container>
    </>
  );
}
