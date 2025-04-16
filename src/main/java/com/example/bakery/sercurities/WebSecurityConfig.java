package com.example.bakery.sercurities;

import com.example.bakery.models.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private UserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;



    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(jwtUserDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        // We don't need CSRF for this example
        httpSecurity.cors()
                .and()
                .csrf().disable()
                // dont authenticate this particular request
                .authorizeRequests()

                // .antMatchers("/requireToken")
                // .authenticated()
                // // .and()
                // // .exceptionHandling()
                // // .authenticationEntryPoint(jwtAuthenticationEntryPoint)

                // .anyRequest().permitAll()
                
                // .and()
                // .sessionManagement()
                // .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

                .antMatchers("/authenticate").permitAll()
                .antMatchers("/news/**").permitAll()
                .antMatchers("/properties/**").permitAll()
                .antMatchers("/product/findByProperties").permitAll()
                .antMatchers(HttpMethod.GET,"/product/").permitAll()
                .antMatchers("/product/find-by-name/**").permitAll()
                .antMatchers("/resources/static/**").permitAll()
                .antMatchers("/users/create").permitAll()
                .antMatchers("/orders/export/0/order_report.xlsx").permitAll()
                .antMatchers("/providers/**").permitAll()
                .antMatchers("/files/**").permitAll()
                .antMatchers(HttpMethod.GET,"/product/{^[\\\\d]$}").permitAll()
                .antMatchers("/client/**").permitAll()
                .antMatchers("/admin/**").permitAll()

                // .antMatchers("/**")
                // config role member
                // config role admin
                .anyRequest().authenticated().and().
                        exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Add a filter to validate the tokens with every request
        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }


}
