package com.example.kanban.config;

import com.example.kanban.security.JwtAuthFilter;
import com.example.kanban.service.DbUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
public class SecurityConfig {

  private final DbUserDetailsService uds;
  private final JwtAuthFilter jwtAuthFilter;

  public SecurityConfig(DbUserDetailsService uds, JwtAuthFilter jwtAuthFilter) {
    this.uds = uds;
    this.jwtAuthFilter = jwtAuthFilter;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	  http
	    .csrf(csrf -> csrf.disable())
	    .cors(Customizer.withDefaults())
	    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	    .authorizeHttpRequests(auth -> auth
	      // ✅ Allow pre-flight requests
	      .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

	      // ✅ Auth endpoints (login/register)
	      .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/health").permitAll()

	      // ✅ Allow any authenticated user to access /api/auth/me
	      .requestMatchers("/api/auth/me").authenticated()

	      // ✅ Allow any authenticated user to access projects
	      .requestMatchers("/api/projects/**").authenticated()
	      
	      // ✅ Allow any authenticated user to access tasks
	      .requestMatchers("/api/tasks/**").authenticated()

	      // ✅ All other /api/** endpoints require ADMIN role
	      .requestMatchers("/api/**").hasRole("ADMIN")

	      // ✅ Any other unmatched path also requires ADMIN
	      .anyRequest().hasRole("ADMIN")
	    )
	    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

	  return http.build();
	}

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  // ✅ CORS for frontend dev (Vite 5173/5174)
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(java.util.List.of(
        "http://localhost:5173",
        "http://localhost:5174"
    ));
    cfg.setAllowedMethods(java.util.List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(java.util.List.of("Authorization","Content-Type"));
    cfg.setAllowCredentials(false);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
