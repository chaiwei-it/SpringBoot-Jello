package com.mood.module.api.app;

import java.util.ArrayList;

/**
 * 内容
 *
 * @author chaiwei
 * @time 2018-01-07 下午08:00
 */
public class AppTest {

    private String id;

    private String name;

    private String parentId;

    private ArrayList<AppTest> child = new ArrayList<AppTest>();

    public AppTest() {

    }

    public AppTest(String id, String name, String parentId) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.child = child;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public ArrayList<AppTest> getChild() {
        return child;
    }

    public void setChild(ArrayList<AppTest> child) {
        this.child = child;
    }
}
