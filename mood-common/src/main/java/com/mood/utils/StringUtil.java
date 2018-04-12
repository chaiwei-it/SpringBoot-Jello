package com.mood.utils;

import java.util.regex.Pattern;

/**
 * 字符串工具类
 *
 * @author chaiwei
 * @time 2018-01-14 10:17
 */
public class StringUtil {

    public static boolean isInteger(String str) {
        Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");
        return pattern.matcher(str).matches();

    }
}
