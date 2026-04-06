package com.project.product_admin;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // 🛠️ ALLOW CORS preflight (OPTIONS) requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Allow login and H2 console endpoints
        if (request.getRequestURI().contains("/auth") || request.getRequestURI().startsWith("/h2-console")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            String user = jwtUtil.validateToken(token);

            if (user != null) {
                String role = jwtUtil.extractRole(token);
                request.setAttribute("role", role);
                filterChain.doFilter(request, response);
                return;
            }
        }

        // ❌ BLOCK request properly
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return; // 🔥 THIS LINE WAS MISSING
    }
}