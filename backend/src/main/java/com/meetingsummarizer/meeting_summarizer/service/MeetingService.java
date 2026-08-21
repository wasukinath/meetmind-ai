package com.meetingsummarizer.meeting_summarizer.service;

import com.meetingsummarizer.meeting_summarizer.dto.MeetingResponse;
import com.meetingsummarizer.meeting_summarizer.dto.SummaryResult;
import com.meetingsummarizer.meeting_summarizer.model.Meeting;
import com.meetingsummarizer.meeting_summarizer.model.MeetingStatus;
import com.meetingsummarizer.meeting_summarizer.repository.MeetingRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final TranscriptionService transcriptionService;
    private final SummaryService summaryService;

    public MeetingService(MeetingRepository meetingRepository,
                           TranscriptionService transcriptionService,
                           SummaryService summaryService) {
        this.meetingRepository = meetingRepository;
        this.transcriptionService = transcriptionService;
        this.summaryService = summaryService;
    }

    public MeetingResponse processAndSave(MultipartFile audioFile, String title) {
        Meeting meeting = new Meeting();
        meeting.setFileName(audioFile.getOriginalFilename());
        meeting.setTitle((title == null || title.isBlank()) ? audioFile.getOriginalFilename() : title);
        meeting.setStatus(MeetingStatus.PROCESSING);
        meeting = meetingRepository.save(meeting);

        try {
            String transcript = transcriptionService.transcribe(audioFile);
            meeting.setTranscript(transcript);

            SummaryResult result = summaryService.summarize(transcript);
            meeting.setSummary(result.getSummary());
            meeting.setKeyDecisions(result.getKeyDecisions());

            List<Meeting.ActionItem> actionItems = new ArrayList<>();
            if (result.getActionItems() != null) {
                actionItems = result.getActionItems().stream()
                        .map(a -> new Meeting.ActionItem(a.getTask(), a.getOwner(), a.getPriority()))
                        .collect(Collectors.toList());
            }
            meeting.setActionItems(actionItems);
            meeting.setStatus(MeetingStatus.COMPLETED);

        } catch (Exception e) {
            meeting.setStatus(MeetingStatus.FAILED);
            meeting.setErrorMessage(e.getMessage());
        }

        meeting = meetingRepository.save(meeting);
        return MeetingResponse.from(meeting);
    }

    public List<MeetingResponse> getAll() {
        return meetingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(MeetingResponse::from)
                .collect(Collectors.toList());
    }

    public MeetingResponse getById(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + id));
        return MeetingResponse.from(meeting);
    }

    public void delete(Long id) {
        meetingRepository.deleteById(id);
    }
}