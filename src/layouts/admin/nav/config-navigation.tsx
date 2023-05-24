// routes
import { PATH_ADMIN } from '../../../routes/paths';
// components
// import Label from '../../../components/label';
// import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Tổng quan',
    items: [
      // { title: 'Trang chủ', path: PATH_ADMIN.general.app, icon: ICONS.dashboard },
      {
        title: 'Trang chủ',
        path: PATH_ADMIN.general.ecommerce,
        icon: ICONS.ecommerce,
        roles: [1, 2, 3, 5],
      },
      // { title: 'Thống kê', path: PATH_ADMIN.general.analytics, icon: ICONS.analytics },
      // { title: 'Vận chuyển', path: PATH_ADMIN.general.banking, icon: ICONS.banking },
      // { title: 'booking', path: PATH_ADMIN.general.booking, icon: ICONS.booking },
      // { title: 'file', path: PATH_ADMIN.general.file, icon: ICONS.file },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // E-COMMERCE
      {
        title: 'Sản phẩm',
        roles: [1, 2, 3, 5],
        path: PATH_ADMIN.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'Danh sách', path: PATH_ADMIN.eCommerce.list },
          { title: 'Tạo mới', path: PATH_ADMIN.eCommerce.new },
          { title: 'Flash sale', path: PATH_ADMIN.eCommerce.flashSale },
          { title: 'Thông tin khác', path: PATH_ADMIN.eCommerce.moreInfo },
        ],
      },

      // INVOICE
      {
        title: 'Đơn hàng',
        path: PATH_ADMIN.invoice.root,
        icon: ICONS.invoice,
      },

      // USER
      {
        title: 'Nhân viên',
        roles: [1, 2, 3, 5],
        path: PATH_ADMIN.user.root,
        icon: ICONS.user,
        children: [
          // { title: 'profile', path: PATH_ADMIN.user.profile },
          // { title: 'cards', path: PATH_ADMIN.user.cards },
          { title: 'Danh sách', path: PATH_ADMIN.user.root },
          { title: 'Thêm nhân viên', path: PATH_ADMIN.user.new },
          // { title: 'edit', path: PATH_ADMIN.user.demoEdit },
          { title: 'Tài khoản', path: PATH_ADMIN.user.account },
        ],
      },

      // BLOG
      // {
      //   title: 'blog',
      //   path: PATH_ADMIN.blog.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'posts', path: PATH_ADMIN.blog.posts },
      //     { title: 'post', path: PATH_ADMIN.blog.demoView },
      //     { title: 'create', path: PATH_ADMIN.blog.new },
      //   ],
      // },
      // {
      //   title: 'File manager',
      //   path: PATH_ADMIN.fileManager,
      //   icon: ICONS.folder,
      // },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'Ứng dụng',
  //   items: [
  //     {
  //       title: 'Mail',
  //       path: PATH_ADMIN.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">+32</Label>,
  //     },
  //     {
  //       title: 'Trò chuyện',
  //       path: PATH_ADMIN.chat.root,
  //       icon: ICONS.chat,
  //     },
  //     {
  //       title: 'Lịch',
  //       path: PATH_ADMIN.calendar,
  //       icon: ICONS.calendar,
  //     },
  //     {
  //       title: 'Kanban',
  //       path: PATH_ADMIN.kanban,
  //       icon: ICONS.kanban,
  //     },
  //   ],
  // },

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'item_by_roles',
  //       path: PATH_ADMIN.permissionDenied,
  //       icon: ICONS.lock,
  //       roles: ['admin'],
  //       caption: 'only_admin_can_see_this_item',
  //     },
  //     {
  //       title: 'menu_level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'menu_level_2a',
  //           path: '#/dashboard/menu_level/menu_level_2a',
  //         },
  //         {
  //           title: 'menu_level_2b',
  //           path: '#/dashboard/menu_level/menu_level_2b',
  //           children: [
  //             {
  //               title: 'menu_level_3a',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
  //             },
  //             {
  //               title: 'menu_level_3b',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
  //               children: [
  //                 {
  //                   title: 'menu_level_4a',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
  //                 },
  //                 {
  //                   title: 'menu_level_4b',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: 'item_disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },

  //     {
  //       title: 'item_label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'item_caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'item_external_link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //     },
  //     {
  //       title: 'blank',
  //       path: PATH_ADMIN.blank,
  //       icon: ICONS.blank,
  //     },
  //   ],
  // },
];

export default navConfig;
