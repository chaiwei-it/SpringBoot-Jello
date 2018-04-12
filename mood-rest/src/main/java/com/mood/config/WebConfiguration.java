package com.mood.config;

import com.baidu.fis.velocity.spring.FisBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CharacterEncodingFilter;
import javax.servlet.Filter;


/**
 * Created by alddim
 */
@Configuration
class WebConfiguration {

    @Bean
    public Filter characterEncodingFilter() {
        CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("UTF-8");
        characterEncodingFilter.setForceEncoding(true);
        return characterEncodingFilter;
    }

    @Bean
    public FisBean fisBean() {
        return new FisBean();
    }

}