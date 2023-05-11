import { m } from 'framer-motion';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets/illustrations';
//
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  excludes?: boolean;
  roles?: number[];
  permissions?: string[];
  views?: string[];
  children: React.ReactNode;
};

export default function RoleBasedGuard({
  hasContent,
  excludes,
  roles,
  views,
  permissions,
  children,
}: RoleBasedGuardProp) {
  // Logic here to get current user role
  const { user } = useAuthContext();

  // const currentRole = 'user';
  const currentRole = user?.roleId; // admin;

  if (
    currentRole &&
    typeof roles !== 'undefined' &&
    (excludes ? roles.includes(currentRole) : !roles.includes(currentRole))
  ) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Yêu cầu truy cập bị từ chối
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Bạn không có quyền truy cập trang này
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
