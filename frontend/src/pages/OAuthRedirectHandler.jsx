import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StorageService from '../services/storage';

function OAuthRedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('token');
    const refreshToken = params.get('refresh');

    if (accessToken) {
      StorageService.setAccessToken(accessToken);
      if (refreshToken) {
         StorageService.setRefreshToken(refreshToken);
      }
      
      navigate('/'); 
    } else {
      navigate('/login?error=social_login_failed');
    }
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}