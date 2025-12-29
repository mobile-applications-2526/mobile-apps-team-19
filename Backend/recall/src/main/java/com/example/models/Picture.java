package com.example.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "pictures")
public class Picture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String hashtags;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    protected Picture() {
    }

    public Picture(String url, String hashtags, Event event) {
        this.url = url;
        this.hashtags = hashtags;
        this.event = event;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;

    }

    public String getHashtags() {
        return hashtags;
    }

    public void setHashtags(String hashtags) {
        this.hashtags = hashtags;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public List<String> getHashtagsList() {
        return List.of(hashtags.split(","));
    }

    public void setHashtagsList(List<String> hashtagsList) {
        this.hashtags = String.join(",", hashtagsList);
    }

}
