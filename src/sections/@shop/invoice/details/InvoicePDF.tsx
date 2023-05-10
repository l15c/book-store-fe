/* eslint-disable jsx-a11y/alt-text */
import { Page, View, Text, Document } from '@react-pdf/renderer';
// @types
import { IOrder } from 'src/@types/order';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
//
import styles from './InvoiceStyle';

// ----------------------------------------------------------------------

type Props = {
  order: IOrder;
};

export default function InvoicePDF({ order }: Props) {
  const {
    totalPrice,
    dayOfPayment,
    deliveryFee,
    discountPrice,
    displayAddress,
    orderDetails = [],
    payType,
    shipNote,
    shipPhone,
    id,
    isPay,
    orderDate,
    shipName,
    status,
  } = order;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          {/* <LogoOnly /> */}
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{status}</Text>
            <Text> {`Mã đơn hàng: ${id}`} </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Thông tin người nhận</Text>
            <Text style={styles.body1}>{shipName}</Text>
            <Text style={styles.body1}>{displayAddress}</Text>
            <Text style={styles.body1}>{shipPhone}</Text>
          </View>

          <View style={styles.col6} />
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]}>Ngày đặt hàng</Text>
            <Text style={styles.body1}>{fDate(orderDate)}</Text>
          </View>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]}>Ngày thanh toán</Text>
            <Text style={styles.body1}>{fDate(dayOfPayment)}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>Chi tiết đơn hàng</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Tên sản phẩm</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Số lượng</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Đơn giá</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>Thành tiền</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {orderDetails.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.name}</Text>
                  <Text>{item.name}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.price}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Tạm tính</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(totalPrice + deliveryFee)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Giảm giá</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(-discountPrice)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Tổng tiền</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(totalPrice)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8} />

          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Bạn cần trợ giúp?</Text>
            <Text>Liên hệ: bookstore@gmail.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
