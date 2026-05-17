package com.example.back.Service;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    JwtAuthFilter jwtAuthFilter;

    @Autowired
    UserDetailsServiceImpl userDetailsServiceImpl;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
               // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(
                                "/camunda/**",
                                "/engine-rest/**",
                                "/camunda-welcome/**",
                                "/camunda/app/**",
                                "/camunda/api/**",
                                "/camunda/lib/**"

                        ).permitAll()
                        .requestMatchers("/conge/**").authenticated()
                        .requestMatchers("/historyleaves/**").authenticated()
                        .requestMatchers("/manager-history/**").authenticated()
                        .requestMatchers("/rh-history/**").authenticated()
                        // what i added Malek
                        .requestMatchers("/api/employee-skill/**").authenticated()
                        .requestMatchers("/notifications/events").permitAll() // ✅ Autorise SSE ouvert
                        .requestMatchers("/notifications/**").authenticated()
                        .requestMatchers("/employee/**").authenticated()
                        .requestMatchers("/diplomas/**").authenticated()
                        .requestMatchers("/insurances/**").authenticated()
                        .requestMatchers("/other-informations/**").authenticated()
                        .requestMatchers("/year-evaluations/**").authenticated()
                        .requestMatchers("/leave-requests/**").authenticated()
                        .requestMatchers("/contract-types/**").authenticated() // ici
                        .requestMatchers("/departments/**").authenticated() // ici
                        .requestMatchers("/tasks/**").authenticated()
                        .requestMatchers("/leaves/**").authenticated()
                        .requestMatchers("/attendances/**").authenticated()
                        .requestMatchers("/projects/**").authenticated()
                        .requestMatchers("/photos/**").authenticated()
                        // Offers request_matchers
                                .requestMatchers(  "/api/offers/**").authenticated()
                        .requestMatchers(  "/api/applications/**").authenticated()
                        .requestMatchers(  "/api/currencies/**").authenticated()
                        .requestMatchers(  "/api/diploma-type/**").authenticated()
                        .requestMatchers(  "/api/experiences/**").authenticated()
                        .requestMatchers(  "/api/resumes/**").authenticated()
                        .requestMatchers(  "/api/workflowjoboffer/**").authenticated()
                        .requestMatchers(  "/api/work-modes/**").authenticated()
                        .requestMatchers("/api/site/**").authenticated()
                        .requestMatchers("/api/room/**").authenticated()
                        .requestMatchers("/api/interviews/**").authenticated()
                        .requestMatchers("/events").permitAll()

                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.disable()))
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsServiceImpl);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization", "X-Requested-With"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
