import { forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { CustomProps } from './types';

const NumericFormatCustom: any = forwardRef<NumericFormatProps, CustomProps>((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      decimalScale={0}
      decimalSeparator=","
      thousandSeparator="."
      allowNegative={false}
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
});

export default NumericFormatCustom;
