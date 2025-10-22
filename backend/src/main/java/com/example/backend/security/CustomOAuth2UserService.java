package com.example.backend.security;

import com.example.backend.entity.Provider;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.info.OAuth2UserInfo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Spring Security의 기본 로직으로 소셜 사용자 정보(Map) 로드
            OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. 서비스 식별 (google, kakao) 및 정보 표준화
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Provider provider = Provider.valueOf(registrationId.toUpperCase());

        // 💡 Google/Kakao의 복잡한 속성을 표준 인터페이스로 변환하는 Adapter 사용
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        String email = userInfo.getEmail();
        String providerId = userInfo.getId();

        // 3. DB에 사용자 저장/업데이트 로직
        // 이메일을 기준으로 사용자를 찾습니다.
        User user = userRepository.findByEmail(email)
//                .map(entity -> {
//                    // 3-1. 기존 사용자: 정보(이름, 프로필 이미지 등)를 업데이트하고 반환
//                    entity.updateSocialUser(providerId, userInfo.getName(), userInfo.getImageUrl());
//                    return userRepository.save(entity); // 변경 사항 저장
//                })
                .orElseGet(() -> {
                    // 3-2. 새로운 사용자: User 엔티티 생성 후 DB에 저장 (최초 로그인)
                    User newUser = User.builder()
                            .email(email)
                            .username(userInfo.getName()) // 또는 고유 username 생성 로직 사용
                            .provider(provider)
                            .providerId(providerId)
                            .password("") // 소셜 로그인은 비밀번호 필드를 비워둡니다.
                            .build();
                    return userRepository.save(newUser);
                });

        // 4. Custom UserDetails 객체(User 엔티티)를 반환하여 최종 인증 완료
        // 💡 User 엔티티는 OAuth2User와 UserDetails를 모두 구현해야 합니다.
        return user;
    }
}