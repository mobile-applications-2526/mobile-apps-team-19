package com.example.models;
import java.util.List;

public class Picture {
    private int id;
    private String url;
    private Event event;
    private String hashtags;



    
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;

    }
    public Event getEvent() {
        return event;
    }
    public void setEvent(Event event) {
        this.event = event;
    }
    public String getHashtags() {
        return hashtags;
    }
    public void setHashtags(String hashtags) {
        this.hashtags = hashtags;
    }
    
    public List<String> getHashtagsList() {
        return List.of(hashtags.split(","));
    }

    public void setHashtagsList(List<String> hashtagsList) {
        this.hashtags = String.join(",", hashtagsList);
    }

}


