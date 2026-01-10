package com.libstack.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        
        String role = authorities.stream()
            .map(GrantedAuthority::getAuthority)
            .findFirst()
            .orElse("ROLE_USER")
            .replace("ROLE_", "");
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("name", oauth2User.getAttribute("name"));
        userData.put("email", oauth2User.getAttribute("email"));
        userData.put("role", role);
        
        String targetUrl = "/?auth=success&role=" + role;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
