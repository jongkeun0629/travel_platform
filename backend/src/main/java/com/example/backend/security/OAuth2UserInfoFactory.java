package com.example.backend.security;

import com.example.backend.security.info.GoogleOAuth2UserInfo;
import com.example.backend.security.info.KakaoOAuth2UserInfo;
import com.example.backend.security.info.OAuth2UserInfo;

import java.util.Map;

public class OAuth2UserInfoFactory {
    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase("google")) {
            return new GoogleOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase("kakao")) {
            return new KakaoOAuth2UserInfo(attributes);
        }
        // 지원하지 않는 서비스인 경우 예외 처리
        throw new IllegalArgumentException("지원하지 않는 소셜 로그인 서비스입니다: " + registrationId);
    }
}
