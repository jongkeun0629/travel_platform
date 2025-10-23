package com.example.backend.security.info;

import java.util.Map;

public class KakaoOAuth2UserInfo implements OAuth2UserInfo {
    private final Map<String, Object> attributes;
    private final Map<String, Object> kakaoAccount;
    private final Map<String, Object> profile;

    // 생성자: Kakao가 반환한 원본 Map을 받음
    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;

        // Kakao는 사용자 정보가 중첩된 구조이므로, 필요한 Map을 미리 추출
        this.kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        this.profile = (Map<String, Object>) kakaoAccount.get("profile");
    }

    @Override
    public String getId() {
        // Kakao의 최상위 ID를 사용
        return String.valueOf(attributes.get("id"));
    }

    @Override
    public String getName() {
        // 이름은 'kakao_account' 아래 'profile' 아래 'nickname'에 있음
        if (profile == null) return null;
        return (String) profile.get("nickname");
    }

    @Override
    public String getEmail() {
        // 이메일은 'kakao_account' 아래 'email'에 있음
        return (String) kakaoAccount.get("email");
    }

//    @Override
//    public String getImageUrl() {
//        // 프로필 이미지는 'profile_image_url'에 있음
//        if (profile == null) return null;
//        return (String) profile.get("profile_image_url");
//    }

//    @Override
//    public Map<String, Object> getAttributes() {
//        return attributes;
//    }
}