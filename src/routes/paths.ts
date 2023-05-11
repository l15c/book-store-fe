// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_ADMIN = '/admin';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  changPassword: path(ROOTS_AUTH, '/change-password'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_SHOP = {
  root: '/',
  product: {
    root: '/products',
    view: (name: string) => `/products/${name}`,
    checkout: '/checkout',
  },
  order: {
    root: '/orders',
    detail: (id: string) => `/orders/${id}`,
  },
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  login: path(ROOTS_ADMIN, '/login'),
  kanban: path(ROOTS_ADMIN, '/kanban'),
  calendar: path(ROOTS_ADMIN, '/calendar'),
  fileManager: path(ROOTS_ADMIN, '/files-manager'),
  permissionDenied: path(ROOTS_ADMIN, '/permission-denied'),
  blank: path(ROOTS_ADMIN, '/blank'),
  general: {
    app: path(ROOTS_ADMIN, '/app'),
    ecommerce: path(ROOTS_ADMIN, '/ecommerce'),
    analytics: path(ROOTS_ADMIN, '/analytics'),
    banking: path(ROOTS_ADMIN, '/banking'),
    booking: path(ROOTS_ADMIN, '/booking'),
    file: path(ROOTS_ADMIN, '/file'),
  },
  mail: {
    root: path(ROOTS_ADMIN, '/mail'),
    all: path(ROOTS_ADMIN, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_ADMIN, '/chat'),
    new: path(ROOTS_ADMIN, '/chat/new'),
    view: (name: string) => path(ROOTS_ADMIN, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_ADMIN, '/user'),
    new: path(ROOTS_ADMIN, '/user/new'),
    cards: path(ROOTS_ADMIN, '/user/cards'),
    profile: path(ROOTS_ADMIN, '/user/profile'),
    account: path(ROOTS_ADMIN, '/user/account'),
    edit: (name: string) => path(ROOTS_ADMIN, `/user/${name}/edit`),
    demoEdit: path(ROOTS_ADMIN, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_ADMIN, '/e-commerce'),
    list: path(ROOTS_ADMIN, '/e-commerce/product'),
    new: path(ROOTS_ADMIN, '/e-commerce/product/new'),
    edit: (name: string) => path(ROOTS_ADMIN, `/e-commerce/product/${name}/edit`),
    moreInfo: path(ROOTS_ADMIN, '/e-commerce/product/more-info'),
  },
  invoice: {
    root: path(ROOTS_ADMIN, '/invoice'),
    list: path(ROOTS_ADMIN, '/invoice/list'),
    new: path(ROOTS_ADMIN, '/invoice/new'),
    view: (id: string) => path(ROOTS_ADMIN, `/invoice/${id}`),
    edit: (id: string) => path(ROOTS_ADMIN, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_ADMIN, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_ADMIN, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_ADMIN, '/blog'),
    posts: path(ROOTS_ADMIN, '/blog/posts'),
    new: path(ROOTS_ADMIN, '/blog/new'),
    view: (title: string) => path(ROOTS_ADMIN, `/blog/post/${title}`),
    demoView: path(ROOTS_ADMIN, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};
