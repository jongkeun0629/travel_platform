package com.example.backend.security.info;

import java.util.Map;

public class GoogleOAuth2UserInfo implements OAuth2UserInfo {
    private final Map<String, Object> attributes;

    // 생성자: Google이 반환한 원본 Map을 받음
    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getId() {
        // Google은 고유 ID를 'sub' 키로 제공
        return (String) attributes.get("sub");
    }

    @Override
    public String getName() {
        // Google은 이름을 'name' 키로 제공
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        // Google은 이메일을 'email' 키로 제공
        return (String) attributes.get("email");
    }

//    @Override
//    public String getImageUrl() {
//        // Google은 이미지 URL을 'picture' 키로 제공
//        return (String) attributes.get("picture");
//    }
//
//    @Override
//    public Map<String, Object> getAttributes() {
//        return attributes;
//    }
}