import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import StorageService from '../services/storage';
import useAuthStore from "../store/authStore";


const OAuthRedirectHandler = () => {
  const location = useLocation();

  console.log(location.search);   
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get("error");
  const socialLoginSuccess = useAuthStore(state => state.socialLoginSuccess);
  useEffect(() => { 
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    if (token) {
      StorageService.setAccessToken(token);
    
    console.log("ahahah")
        const payloadJson = atob(token.split(".")[1]);
        const payload = JSON.parse(payloadJson);
        console.log("Yeahyeahyeah")
        const user = { 
            id: payload.id, 
            email: payload.email, 
            username: payload.username 
        };
        StorageService.setUser(user);

        socialLoginSuccess();
        console.log("hi");
      navigate('/'); 
    } else {
      navigate('/login?error=social_login_failed');
    }
  }, [location, navigate, searchParams]);

  return <div>로그인 처리 중...</div>;
}

export default OAuthRedirectHandler;