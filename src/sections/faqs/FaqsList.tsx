// @mui
import { Typography, Box, Table, TableRow, TableCell } from '@mui/material';

// ----------------------------------------------------------------------
export const _faqs = [];
export default function FaqsList() {
  return (
    <div>
      <Typography>
        Chúng tôi luôn trân trọng sự tin tưởng và ủng hộ của quý khách hàng khi trải nghiệm mua hàng
        tại BookStore. Do đó chúng tôi luôn cố gắng hoàn thiện dịch vụ tốt nhất để phục vụ mọi nhu
        cầu mua sắm của quý khách.
      </Typography>
      <br />{' '}
      <Typography>
        <br /> BookStore chúng tôi luôn luôn cam kết tất cả các sản phẩm bán tại BookStore 100% là
        những sản phẩm chất lượng và xuất xứ nguồn gốc rõ ràng, hợp pháp cũng như an toàn cho người
        tiêu dùng.
        <br />
      </Typography>
      <br />
      Để việc mua sắm của quý khách tại BookStore là trải nghiệm dịch vụ thân thiện, chúng tôi hy
      vọng quý khách sẽ kiểm tra kỹ các nội dung sau trước khi nhận hàng:
      <br />
      &emsp;&emsp; • Thông tin sản phẩm: tên sản phẩm và chất lượng sản phẩm.
      <br />
      &emsp;&emsp; • Số lượng sản phẩm.
      <br />
      <Typography>
        Trong trường hợp hiếm hoi sản phẩm quý khách nhận được có khiếm khuyết, hư hỏng hoặc không
        như mô tả, BookStore cam kết bảo vệ khách hàng bằng chính sách đổi trả/ hoàn tiền trên tinh
        thần bảo vệ quyền lợi người tiêu dùng nhằm cam kết với quý khách về chất lượng sản phẩm và
        dịch vụ của chúng tôi.
      </Typography>
      <br />
      <Typography>
        Khi quý khách hàng có sách mua tại BookStore cần đổi/ trả/bảo hành/hoàn tiền, xin quý khách
        hàng liên hệ với chúng tôi qua hotline 0966521770 hoặc truy cập
        “https://book-store-fe-l15c.vercel.app/chinh-sach-doi-tra-hang” để tìm hiểu thêm về chính
        sách đổi/trả:
      </Typography>
      <br />
      <Typography>
        Thời gian kể từ khi giao hàng thành công Sản phẩm lỗi do nhà cung cấp Sản phẩm không lỗi Sản
        phẩm lỗi do người sử dụng 30 ngày đầu tiên Đổi mới Trả không thu phí Không hỗ trợ đổi/ trả
        Trả không thu phí Từ ngày thứ 30 trở đi Không hỗ trợ đổi/ trả
      </Typography>
      <br />
      <Typography>
        BookStore sẽ tiếp nhận thông tin yêu cầu đổi trả của quý khách trong vòng 3 ngày kể từ khi
        quý khách nhận hàng thành công.
      </Typography>
      <br />
      <Typography>
        Sau khi BookStore xác nhận mail tiếp nhận yêu cầu kiểm tra xử lý, BookStore sẽ liên hệ đến
        quý khách để xác nhận thông tin hoặc nhờ bổ sung thông tin (nếu có). Trường hợp không liên
        hệ được BookStore rất tiếc xin được phép từ chối xử lý yêu cầu. Thời gian BookStore liên hệ
        trong giờ hành chính tối đa 3 lần trong vòng 7 ngày sau khi nhận thông tin yêu cầu.
      </Typography>
      <br />
      <Typography>
        Chúng tôi sẽ kiểm tra các trường hợp trên và giải quyết cho quý khách tối đa trong 30 ngày
        làm việc kể từ khi quý khách nhận được hàng, quá thời hạn trên rất tiếc chúng tôi không giải
        quyết khiếu nại.
      </Typography>
      <br />
      <Typography fontWeight={700} fontSize={20}>
        2. Các trường hợp yêu cầu đổi trả
      </Typography>
      <Box sx={{ ml: 2 }}>
        <br />• Lỗi kỹ thuật của sản phẩm - do nhà cung cấp (sách thiếu trang, sút gáy, trùng nội
        dung, sản phẩm điện tử, đồ chơi điện – điện tử không hoạt động..)
        <br />• Giao nhầm/ giao thiếu (thiếu sản phẩm đã đặt, thiếu phụ kiện, thiếu quà tặng kèm
        theo)
        <br />• Chất lượng sách kém, hư hại do vận chuyển. • Hình thức sản phẩm không giống mô tả
        ban đầu.
        <br />• Quý khách đặt nhầm/ không còn nhu cầu (*)
        <br />
      </Box>
      <Typography mt={2}>
        (*) Đối với các Sản phẩm không bị lỗi, chỉ áp dụng khi sản phẩm đáp ứng đủ điều kiện sau:
      </Typography>
      <Box sx={{ ml: 2 }}>
        <br />
        Quý khách có thể trả lại sản phẩm đã mua tại BookStore trong vòng 30 ngày kể từ khi nhận
        hàng với đa số sản phẩm khi thỏa mãn các điều kiện sau:
        <br />• Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác hay niêm phong của
        nhà sản xuất.
        <br />• Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng kèm theo (nếu có).
        <br />• Nếu là sản phẩm điện – điện tử thì chưa bị kích hoạt, chưa có sao ghi dữ liệu vào
        thiết bị.
      </Box>
      <br />
      <Typography fontWeight={700} fontSize={20}>
        3. Điều kiện đổi trả
      </Typography>
      <br />
      BookStore hỗ trợ đổi/ trả sản phẩm cho quý khách nếu:
      <Box sx={{ ml: 2 }}>
        <br />• Sản phẩm còn nguyên bao bì như hiện trạng ban đầu.
        <br />• Sản phầm còn đầy đủ phụ kiện, quà tặng khuyến mãi kèm theo.
        <br />• Hóa đơn GTGT (nếu có).
        <br />• Cung cấp đầy đủ thông tin đối chứng theo yêu cầu (điều 4).
        <br />
      </Box>
      <Typography fontWeight={700} fontSize={20} sx={{ mt: 2 }}>
        4. Quy trình đổi trả
      </Typography>
      <br />
      <Box sx={{ mb: 2 }}>
        • Quý khách vui lòng thông tin đơn hàng cần hỗ trợ đổi trả theo Hotline 0966521770 hoặc
        email về địa chỉ: 19h1120074@sv.ut.edu.vn với tiêu đề [Đổi Trả Đơn Hàng] [Mã đơn hàng].
        <br />• Quý khách cần cung cấp đính kèm thêm các bằng chứng để đối chiếu/ khiếu nại sau:
        <br />+ Video clip mở kiện hàng từ lúc bắt đầu khui ngoại quan đến kiểm tra sản phẩm bên
        trong thùng hàng.
        <br />+ Hình chụp tem kiện hàng có thể hiện mã đơn hàng.
        <br />+ Hình chụp tình trạng ngoại quan (băng keo, seal, hình dạng thùng hàng, bao bì), đặc
        biệt các vị trí nghi ngờ có tác động đến sản phẩm (móp méo, ướt, rách...) + Hình chụp tình
        trạng sản phẩm bên trong, nêu rõ lỗi kỹ thuật nếu có.
        <br />• Để đảm bảo quyền lợi khách hàng và để BookStore có cơ sở làm việc với các bộ phận
        liên quan, tất cả yêu cầu đổi/ trả/ bảo hành quý khách cần cung cấp hình ảnh/ clip sản phẩm
        lỗi. Quá thời gian đổi/ trả sản phẩm nếu chưa nhận được đủ hình ảnh/ clip từ quý khách,
        BookStore xin phép từ chối hỗ trợ.
      </Box>
      <Table>
        <TableRow>
          <th>STT</th>
          <th>Nội dung</th>
          <th>Cách thức giải quyết</th>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>
            1 Lỗi kỹ thuật của sản phẩm - do nhà cung cấp (sách thiếu trang, sút gáy, trùng nội
            dung, sản phẩm điện tử không hoạt động..) BookStore có sản phẩm→ đổi mới cùng sản phẩm
            BookStore hết hàng→ Hoàn tiền hoặc quý khách có thể chọn mặt hàng khác tại website
            https://book-store-fe-l15c.vercel.app/ Đổi/trả không thu phí
          </TableCell>
          <TableCell>
            1 Lỗi kỹ thuật của sản phẩm - do nhà cung cấp (sách thiếu trang, sút gáy, trùng nội
            dung, sản phẩm điện tử không hoạt động..) BookStore có sản phẩm→ đổi mới cùng sản phẩm
            BookStore hết hàng→ Hoàn tiền hoặc quý khách có thể chọn mặt hàng khác tại website
            “https://book-store-fe-l15c.vercel.app/”. Đổi/trả không thu phí
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>Sản phẩm hỏng do quý khách</TableCell>
          <TableCell>2 Sản phẩm hỏng do quý khách Không hỗ trợ đổi/ trả</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell>Lý do đổi/trả sản phẩm như: khách đặt nhầm hoặc không còn nhu cầu.</TableCell>
          <TableCell>
            Hỗ trợ thu hồi và hoàn tiền 100% giá trị sản phẩm cho quý khách hàng. **Lưu ý: BookStore
            rất tiếc sẽ không hỗ trợ hoàn lại chi phí vận chuyển trong đơn hàng cho trường hợp này.
            Đổi /trả không thu phí
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>4</TableCell>
          <TableCell>
            Giao nhầm/ giao thiếu (thiếu sản phẩm đã đặt, thiếu phụ kiện, thiếu quà tặng kèm theo)
          </TableCell>
          <TableCell>
            Giao nhầm → Đổi lại đúng sản phẩm đã đặt. Giao thiếu → Giao bù thêm số lượng còn thiếu
            theo đơn hàng. Đổi /trả không thu phí
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>5</TableCell>
          <TableCell>Chất lượng sách kém do vận chuyển</TableCell>
          <TableCell>
            Khi quý khách hàng nhận gói hàng bị móp méo, ướt, chúng tôi khuyến cáo khách hàng nên
            kiểm tra thực tế sách bên trong ngay thời điểm nhận hàng, vui lòng phản ảnh hiện trang
            sách lên bill nhận hàng từ phía nhân viên giao nhận và liên lạc với chúng tôi về hotline
            0966521770 trong vòng 48 giờ để được hỗ trợ giải quyết cụ thể. Đổi /trả không thu phí
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>6</TableCell>
          <TableCell>Hình thức sản phẩm không giống mô tả ban đầu</TableCell>
          <TableCell>
            Hãy liên hệ với chúng tôi qua số hotline 0966521770, chúng tôi sẵn sàng lắng nghe và
            giải quyết cho bạn (cụ thể theo từng trường hợp). Đổi /trả không thu phí
          </TableCell>
        </TableRow>
      </Table>
      5. Cách thức chuyển sản phẩm đổi trả về BookStore
      <br />• Khi yêu cầu đổi trả được giải quyết, quý khách vui lòng đóng gói sản phẩm như hiện
      trạng khi nhận hàng ban đầu (bao gồm sản phẩm, quà tặng, phụ kiện kèm theo sản phẩm,…nếu có).
      <br />• Hóa đơn giá trị gia tăng của BookStore (nếu có).
      <br />• Phụ kiện đi kèm sản phẩm và quà tặng khuyến mãi kèm theo (nếu có).
      <br />• Quý khách cần quay video clip đóng gói sản phẩm để làm bằng chứng đối chiếu/ khiếu nại
      liên quan đến đổi trả về sau (nếu cần).
      <br />• Quý khách vui lòng chịu trách nhiệm về trạng thái nguyên vẹn của sản phẩm khi gửi về
      BookStore. <br />• Sau khi nhận được sản phẩm quý khách gởi về, BookStore sẽ phản hồi và cập
      nhật thông tin trên từng giai đoạn xử lý đến quý khách qua điện thoại/email .
      <br />
      Lưu ý khác:
      <br />
      (*) Nếu quý khách hủy đơn hàng cũ, đã thanh toán thành công, mà không có nhu cầu đặt lại đơn
      hàng khác, hoặc quý khách yêu cầu trả hàng hoàn tiền → chúng tôi sẽ hoàn tiền lại cho quý
      khách qua hình thức thanh toán ban đầu, đối với các đơn hàng quý khách thanh toán bằng tiền
      mặt sẽ được hoàn qua tài khoản Ngân hàng do quý khách chỉ định
      <br />
      Thời gian hoàn tiền được quy định tại Điều 6. (*) Không áp dụng đổi / trả / hoàn tiền đối với
      mặt hàng Chăm Sóc Cá Nhân và các Đơn Hàng Bán Sỉ.
      <br />
      6. Thời gian hoàn tiền
      <br />• Đối với những đơn hàng thanh toán trả trước: sau khi cập nhật hủy, thời gian hoàn tiền
      sẽ tùy thuộc vào phương thức thanh toán. Quý khách vui lòng tham khảo thời gian hoàn tiền như
      sau:
      <table border={1}>
        <TableRow>
          <th>Phương thức thanh toán</th>
          <th>Thời gian hoàn tiền</th>
        </TableRow>
        <TableRow>
          <TableCell>ATM nội địa/ Cổng Zalo Pay/ Cổng VNPay</TableCell>
          <TableCell> 5 - 7 ngày làm việc</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Chuyển khoản</TableCell>
          <TableCell>5 - 7 ngày làm việc (*)</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Visa/ Master/ JCB</TableCell>
          <TableCell>5 - 7 ngày làm việc</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ví Momo/ Moca/Zalopay/ShopeePay</TableCell>
          <TableCell>1 - 3 ngày làm</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Fpoint</TableCell>
          <TableCell> 24 giờ</TableCell>
        </TableRow>
      </table>
      <br />
      (*) Lưu ý:
      <br />- Đối với thẻ Visa/ Master/ JCB, số tiền hoàn sẽ được ngân hàng chuyển vào tài khoản quý
      khách dao động 1-3 tuần làm việc (tùy theo chính sách của từng ngân hàng).
      <br />- Ngày làm việc không bao gồm thứ 7, chủ nhật và ngày lễ. • Đối với những đơn hàng trả
      hàng hoàn tiền:
      <br />• Thời gian hoàn tiền được bắt đầu tính kể từ thời điểm BookStore nhận được hàng hoàn
      trả và xác nhận với quý khách về việc hàng hoàn trả đáp ứng các điều kiện trả hàng được quy
      định tại chính sách này. Thời gian hoàn tiền tuân thủ theo quy định tại Mục 6 này.
      <br />• Đối với các đơn hàng hoàn tiền, hình thức thanh toán của quý khách là tiền mặt (COD):
      BookStore sẽ hoàn tiền qua tài khoản Ngân hàng do quý khách chỉ định.
      <br />
      Trong trường hợp đã quá thời gian trên quý khách chưa nhận được tiền hoàn, vui lòng liên hệ
      ngân hàng phát hành thẻ hoặc liên hệ bộ phận Chăm sóc khách hàng của BookStore .
      <br />
      Nếu cần hỗ trợ thêm bất kì thông tin nào, BookStore nhờ quý khách liên hệ trực tiếp quahotline
      0966521770để được hỗ trợ nhanh chóng.
    </div>
  );
}
