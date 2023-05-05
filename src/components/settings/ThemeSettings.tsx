import { USER_ROLE_ID } from 'src/api-client/customer';
import { useAuthContext } from 'src/auth/useAuthContext';
import ThemeContrast from './ThemeContrast';
import ThemeRtlLayout from './ThemeRtlLayout';
import ThemeColorPresets from './ThemeColorPresets';
import SettingsDrawer from './drawer';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeSettings({ children }: Props) {
  const { user } = useAuthContext();
  return (
    <ThemeColorPresets>
      <ThemeContrast>
        <ThemeRtlLayout>
          {children}
          {user && user.roleId !== USER_ROLE_ID && <SettingsDrawer />}
        </ThemeRtlLayout>
      </ThemeContrast>
    </ThemeColorPresets>
  );
}
