package com.libstack.config;

import com.libstack.model.User;
import com.libstack.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oauth2User.getAttribute("id");
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        if (email == null) {
            email = oauth2User.getAttribute("login") + "@" + provider + ".local";
        }
        
        if (name == null) {
            name = oauth2User.getAttribute("login");
        }

        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setProvider(provider.toUpperCase());
                newUser.setProviderId(providerId);
                newUser.setRole("USER");
                return userRepository.save(newUser);
            });

        user.setProviderId(providerId);
        return new CustomOAuth2User(
            user,
            oauth2User.getAttributes(),
            "name",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
