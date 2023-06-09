/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import compact from 'lodash/compact';
import { useSnackbar } from 'notistack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
// @types
import { IUserAddress } from 'src/@types/user';
// utils
import { PHONE_REG_EXP } from 'src/utils/regex';
// assets
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
// api
import addressApi, { IDistrictGHN, IProvinceGHN, IWardGHN } from 'src/api-client/address';

// ----------------------------------------------------------------------

interface FormValuesProps {
  receiver: string;
  phone: string;
  isDefault: boolean;
  address: string;
  province: IProvinceGHN | null;
  district: IDistrictGHN | null;
  ward: IWardGHN | null;
}

type Props = {
  isEdit?: boolean;
  addressCurrent?: IUserAddress;
  open: boolean;
  onClose: VoidFunction;
  onSubmit: (address: IUserAddress) => void;
};

export default function AddressNewEditForm({
  isEdit,
  addressCurrent,
  open,
  onClose,
  onSubmit,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Vui lòng nhập tên người nhận'),
    phone: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ'),
    address: Yup.string().required('Vui lòng nhập địa chỉ cụ thể'),
    province: Yup.object().required('Vui lòng chọn Tỉnh/Thành phố'),
    district: Yup.object().required('Vui lòng chọn Quận/Huyện/Thị xã'),
  });

  const defaultValues = useMemo(
    () => ({
      receiver: addressCurrent?.receiver || '',
      phone: addressCurrent?.phone || '',
      address: addressCurrent?.address || '',
      isDefault: addressCurrent?.isDefault || false,
      province: null,
      district: null,
      ward: null,
    }),
    [addressCurrent]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    resetField,
    reset,
    setError,
    watch,
    formState: { isSubmitting, isDirty, isValid, defaultValues: defaultForm },
  } = methods;
  const values = watch();

  const provinceId = values.province?.ProvinceID;
  const districtId = values.district?.DistrictID;

  const { data: provinces = [], isFetching: pLoading } = useQuery({
    queryKey: ['province', 'all'],
    queryFn: () => addressApi.getProvinces(),
  });

  const { data: districts = [], isFetching: dLoading } = useQuery({
    queryKey: ['province', 'district', provinceId],
    queryFn: () => addressApi.getDistrict(provinceId!),
    enabled: !!provinceId,
  });

  const { data: wards = [], isFetching: wLoading } = useQuery({
    queryKey: ['province', 'ward', districtId],
    queryFn: () => addressApi.getWard(districtId!),
    enabled: !!districtId,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [addressCurrent]);

  useEffect(() => {
    if (isEdit) {
      if (!defaultForm?.province) {
        const _p = provinces.find((e) => e.ProvinceID === addressCurrent?.province);

        resetField('province', {
          defaultValue: _p || null,
        });
      } else if (!defaultForm?.district) {
        const _d = districts.find((e) => e.DistrictID === addressCurrent?.district);
        resetField('district', {
          defaultValue: _d,
        });
      } else if (!defaultForm?.ward) {
        const _w = wards.find((e) => e.WardCode === addressCurrent?.ward.toString());
        resetField('ward', {
          defaultValue: _w || null,
        });
      }
    }
  }, [addressCurrent, provinces, districts, wards, defaultForm]);

  useEffect(() => {
    resetField('district');
    resetField('ward');
  }, [provinceId, resetField]);

  useEffect(() => {
    resetField('ward');
  }, [districtId, resetField]);

  const handleClose = () => {
    onClose();
  };

  const onSubmitForm = async (data: FormValuesProps) => {
    try {
      if (wards.length !== 0 && values.ward === null)
        setError('ward', { message: 'Vui lòng chọn Xã/Phường' });
      else {
        const { address, receiver, isDefault, phone, province, district, ward } = data;

        const body = {
          address,
          province: province!.ProvinceID,
          district: district!.DistrictID,
          ward: Number(ward!.WardCode),
          isDefault,
          phone,
          receiver,
          displayAddress: compact([
            address,
            ward?.NameExtension?.at(0),
            district?.NameExtension?.at(0),
            province?.ProvinceName,
          ]).join(', '),
        };

        const res = isEdit
          ? await addressApi.update({ ...body, id: addressCurrent!.id })
          : await addressApi.create(body);
        onSubmit(res);
        await queryClient.invalidateQueries({
          queryKey: ['user', 'address'],
          refetchType: 'all',
        });

        enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm'} địa chỉ thành công`);
        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm'} địa chỉ thất bại`, { variant: 'error' });
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle sx={{ pb: 0 }}>Thêm địa chỉ nhận hàng</DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="receiver" label="Tên người nhận" />

              <RHFTextField name="phone" label="Số điện thoại" />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="province"
                label="Tỉnh / Thành phố"
                noOptionsText="Không có Tỉnh/Thành phố phù hợp"
                options={provinces}
                loading={pLoading}
                disabled={pLoading}
                displayLoading
                isOptionEqualToValue={(opt, val) => opt.ProvinceID === val.ProvinceID}
                getOptionLabel={(option) => (option as IProvinceGHN)?.ProvinceName ?? ''}
              />
              <RHFAutocomplete
                name="district"
                label="Quận / Huyện / Thị xã"
                noOptionsText="Không có Quận/Huyện/Thị xã phù hợp"
                options={districts}
                loading={dLoading}
                disabled={!provinceId || dLoading}
                displayLoading
                isOptionEqualToValue={(opt, val) => opt.DistrictID === val.DistrictID}
                getOptionLabel={(option) =>
                  (option as IDistrictGHN)?.NameExtension?.at(0) ??
                  (option as IDistrictGHN).DistrictName ??
                  ''
                }
              />
              <RHFAutocomplete
                name="ward"
                label="Xã / Phường / Thị trấn"
                noOptionsText="Không có Xã/Phường/Thị trấn phù hợp"
                options={wards}
                loading={wLoading}
                disabled={!districtId || wLoading}
                displayLoading
                isOptionEqualToValue={(opt, val) => opt.WardCode === val.WardCode}
                getOptionLabel={(option) =>
                  (option as IWardGHN)?.NameExtension?.at(0) ?? (option as IWardGHN).WardName ?? ''
                }
              />
              <RHFTextField name="address" label="Địa chỉ" />
            </Box>

            <RHFCheckbox name="isDefault" label="Địa chỉ mặc định" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid || !isDirty}
          >
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </LoadingButton>

          <Button color="inherit" variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
