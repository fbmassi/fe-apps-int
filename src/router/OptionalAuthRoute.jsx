import { useSelector } from 'react-redux';
import { logout } from '../helpers/authenticationHelper';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '../components/common/LoadingScreen';
import useAuth from '../hooks/useAuth';
import { sleep } from '../helpers';
import { useTheme } from '../hooks/useTheme';

export const OptionalAuthRoute = ({ children }) => {
  const accountStore = useSelector((state) => state.account);
  const { initSession } = useAuth();
  const { theme } = useTheme();

  const [intentInProgress, setIntentInProgress] = useState(true);

  const initTheme = () => {
    document.body.style.background = theme.primary;
    document.body.style.color = theme.secondary;
  };

  const sessionIntent = async () => {
    setIntentInProgress(true);
    try {
      await initSession();
      initTheme();
      await sleep(400);
    } catch (e) {
      console.error(e);
      logout();
    }
    setIntentInProgress(false);
  };

  useEffect(() => {
    const startIntent = async () => {
      if (localStorage.getItem('token') && !accountStore.authenticated) {
        await sessionIntent();
      } else {
        initTheme();
        await sleep(400);
        setIntentInProgress(false);
      }
    };
    startIntent();
  }, []);

  if (intentInProgress) {
    return <LoadingScreen />;
  } else {
    return children;
  }
};
