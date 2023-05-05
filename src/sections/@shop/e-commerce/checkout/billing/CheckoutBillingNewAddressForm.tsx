import { useQuery } from '@tanstack/react-query';
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
import { ICheckoutBillingAddress } from 'src/@types/product';
// assets
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
// api
import addressApi, { ProvinceAPI } from 'src/api-client/address';
import { useEffect } from 'react';
import { PHONE_REG_EXP } from 'src/utils/regex';

// ----------------------------------------------------------------------

interface FormValuesProps {
  receiver: string;
  phoneNumber: string;
  isDefault: boolean;
  address: string;
  province: ProvinceAPI | null;
  district: ProvinceAPI | null;
  ward: ProvinceAPI | null;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreateBilling: (address: ICheckoutBillingAddress) => void;
};

export default function CheckoutBillingNewAddressForm({ open, onClose, onCreateBilling }: Props) {
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Vui lòng nhập tên người nhận'),
    phoneNumber: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ'),
    address: Yup.string().required('Vui lòng nhập địa chỉ cụ thể'),
    province: Yup.object().required('Vui lòng chọn Tỉnh/Thành phố'),
    district: Yup.object().required('Vui lòng chọn Quận/Huyện/Thị xã'),
  });

  const defaultValues = {
    receiver: '',
    phoneNumber: '',
    address: '',
    isDefault: false,
    province: null,
    district: null,
    ward: null,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    resetField,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { province, district } = watch();
  const provinceId = province?.code;
  const districtId = district?.code;

  const { data: provinces = [], isFetching: pLoading } = useQuery({
    queryKey: ['province', 'all'],
    queryFn: () => addressApi.getProvinces(),
    staleTime: Infinity,
  });

  const { data: { districts = [] } = {}, isFetching: dLoading } = useQuery({
    queryKey: ['province', 'district', provinceId],
    queryFn: () => addressApi.getDistrict(provinceId!),
    enabled: !!provinceId,
    staleTime: Infinity,
  });

  const { data: { wards = [] } = {}, isFetching: wLoading } = useQuery({
    queryKey: ['province', 'ward', districtId],
    queryFn: () => addressApi.getWard(districtId!),
    enabled: !!districtId,
    staleTime: Infinity,
  });

  useEffect(() => {
    resetField('district');
    resetField('ward');
  }, [provinceId, resetField]);

  useEffect(() => {
    resetField('ward');
  }, [districtId, resetField]);

  const onSubmit = async (data: FormValuesProps) => {
    console.log(data);
    try {
      // onCreateBilling({
      //   receiver: data.receiver,
      //   phoneNumber: data.phoneNumber,
      //   fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
      //   addressType: data.addressType,
      //   isDefault: data.isDefault,
      // });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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

              <RHFTextField name="phoneNumber" label="Số điện thoại" />
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
                displayLoading
                isOptionEqualToValue={(opt, val) => opt.code === val.code}
                getOptionLabel={(option) => (option as ProvinceAPI).name ?? ''}
              />
              <RHFAutocomplete
                name="district"
                label="Quận / Huyện / Thị xã"
                noOptionsText="Không có Quận/Huyện/Thị xã phù hợp"
                options={districts}
                loading={dLoading}
                disabled={!provinceId}
                displayLoading
                isOptionEqualToValue={(opt, val) => opt.code === val.code}
                getOptionLabel={(option) => (option as ProvinceAPI).name ?? ''}
              />
              <RHFAutocomplete
                name="ward"
                label="Xã / Phường / Thị trấn"
                noOptionsText="Không có Xã/Phường/Thị trấn phù hợp"
                options={wards}
                loading={wLoading}
                disabled={!districtId}
                displayLoading
                isOptionEqualToValue={(opt, val) => opt.code === val.code}
                getOptionLabel={(option) => (option as ProvinceAPI).name}
              />
              <RHFTextField name="address" label="Địa chỉ cụ thể" />
            </Box>

            <RHFCheckbox name="isDefault" label="Địa chỉ mặc định" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Thêm mới
          </LoadingButton>

          <Button color="inherit" variant="outlined" onClick={onClose}>
            Hủy
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
