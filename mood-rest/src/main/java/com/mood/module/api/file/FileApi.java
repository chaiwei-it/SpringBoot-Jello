package com.mood.module.api.file;

import com.sun.tools.doclets.formats.html.SourceToHTMLConverter;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 文件
 * @author chaiwei
 * @time 2018-01-14 22:46
 */
@RestController
@RequestMapping("/api/{version}/file")
public class FileApi {

    public static void main(String[] args) {
//        Map<String,String> map = new HashMap();
//
//        map.put("1", "test1");
//
//        String value = map.get("1");
//
//        Set<String> set = map.keySet();
//
//        Set<Map.Entry<String, String>> entry = map.entrySet();

        for(char a1 = 'a'; a1 < 'e' ; a1++){
            for(char a2 = 'a'; a2 < 'e' ; a2++){
                for(char a3 = 'a'; a3 < 'e' ; a3++){
                    for(char a4 = 'a'; a4 < 'e' ; a4++){
                        for(char a5 = 'a'; a5 < 'e' ; a5++){
                            for(char a6 = 'a'; a6 < 'e' ; a6++){
                                for(char a7 = 'a'; a7 < 'e' ; a7++){
                                    for(char a8 = 'a'; a8 < 'e' ; a8++){
                                        for(char a9 = 'a'; a9 < 'e' ; a9++){
                                            for(char a10 = 'a'; a10 < 'e' ; a10++){
                                                if((a2 == 'a' && a5 == 'c') || (a2 == 'b' && a5 == 'd') || (a2 == 'c' && a5 == 'a') || (a2 == 'd' && a5 == 'b')){//满足条件2
                                                    if((a3 == 'a' && a3 != a2 && a3 == a4 && a3 != a6) || (a3 == 'b' && a2 != a3 && a2 == a4 && a2 != a6)
                                                            || (a3 == 'c' && a4 != a2 && a4 == a3 && a4 != a6) || (a3 == 'd' && a6 != a2 && a6 == a4 && a6 != a3)){//满足条件3
                                                        if((a4 == 'a' && a1 == a5) || (a4 == 'b' && a2 == a7) || (a4 == 'c' && a1 == a9) || (a4 == 'd' && a6 == a10)){//满足条件3
                                                            if((a5 == 'a' && a8 == a5) || (a5 == 'b' && a4 == a5) || (a5 == 'c' && a9 == a5) || (a5 == 'd' && a7 == a5)){
                                                                if((a6 == 'a' && a8 == a2 && a8 == a4) || (a6 == 'b' && a8 == a1 && a8 == a6)
                                                                        || (a6 == 'c' && a8 == a3 && a8 == a10) || (a6 == 'd' && a8 == a5 && a8 == a9)){
                                                                    int a = 0;
                                                                    int b = 0;
                                                                    int c = 0;
                                                                    int d = 0;
                                                                    if(a1 == 'a'){
                                                                        a++;
                                                                    }else if(a1 == 'b'){
                                                                        b++;
                                                                    }else if(a1 == 'c'){
                                                                        c++;
                                                                    }else if(a1 == 'd'){
                                                                        d++;
                                                                    }
                                                                    if(a2 == 'a'){
                                                                        a++;
                                                                    }else if(a2 == 'b'){
                                                                        b++;
                                                                    }else if(a2 == 'c'){
                                                                        c++;
                                                                    }else if(a2 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a3 == 'a'){
                                                                        a++;
                                                                    }else if(a3 == 'b'){
                                                                        b++;
                                                                    }else if(a3 == 'c'){
                                                                        c++;
                                                                    }else if(a3 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a4 == 'a'){
                                                                        a++;
                                                                    }else if(a4 == 'b'){
                                                                        b++;
                                                                    }else if(a4 == 'c'){
                                                                        c++;
                                                                    }else if(a4 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a5 == 'a'){
                                                                        a++;
                                                                    }else if(a5 == 'b'){
                                                                        b++;
                                                                    }else if(a5 == 'c'){
                                                                        c++;
                                                                    }else if(a5 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a6 == 'a'){
                                                                        a++;
                                                                    }else if(a6 == 'b'){
                                                                        b++;
                                                                    }else if(a6 == 'c'){
                                                                        c++;
                                                                    }else if(a6 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a7 == 'a'){
                                                                        a++;
                                                                    }else if(a7 == 'b'){
                                                                        b++;
                                                                    }else if(a7 == 'c'){
                                                                        c++;
                                                                    }else if(a7 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a8 == 'a'){
                                                                        a++;
                                                                    }else if(a8 == 'b'){
                                                                        b++;
                                                                    }else if(a8 == 'c'){
                                                                        c++;
                                                                    }else if(a8 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a9 == 'a'){
                                                                        a++;
                                                                    }else if(a9 == 'b'){
                                                                        b++;
                                                                    }else if(a9 == 'c'){
                                                                        c++;
                                                                    }else if(a9 == 'd'){
                                                                        d++;
                                                                    }

                                                                    if(a10 == 'a'){
                                                                        a++;
                                                                    }else if(a10 == 'b'){
                                                                        b++;
                                                                    }else if(a10 == 'c'){
                                                                        c++;
                                                                    }else if(a10 == 'd'){
                                                                        d++;
                                                                    }
                                                                    if((a7 == 'a' && c < a && c < b && c < d) || (a7 == 'b' && b < a && b < c && b < d)
                                                                            || (a7 == 'c' && a < b && a < c && a < d) || (a7 == 'd' && d < a && d < b && d < c)){
                                                                        System.out.println(" 1:" + a1 + " 2:" + a2 + " 3:" + a3 + " 4:" + a4 + " 5:" + a5
                                                                                + "6:" + a6 + " 7:" + a7 + " 8:" + a8 + " 9:" + a9 + " 10:" + a10);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


    }

}
