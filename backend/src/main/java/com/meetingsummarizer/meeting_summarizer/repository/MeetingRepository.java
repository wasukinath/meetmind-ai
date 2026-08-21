package com.meetingsummarizer.meeting_summarizer.repository;

import com.meetingsummarizer.meeting_summarizer.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findAllByOrderByCreatedAtDesc();
}