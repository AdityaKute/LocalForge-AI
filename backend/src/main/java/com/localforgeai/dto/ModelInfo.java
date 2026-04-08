package com.localforgeai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ModelInfo {

    @JsonProperty("name")
    private String name;

    public ModelInfo() {
    }


    public ModelInfo(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
