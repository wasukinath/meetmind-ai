package com.meetingsummarizer.meeting_summarizer.controller;

import com.meetingsummarizer.meeting_summarizer.dto.MeetingResponse;
import com.meetingsummarizer.meeting_summarizer.service.MeetingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<MeetingResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title) {
        MeetingResponse response = meetingService.processAndSave(file, title);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MeetingResponse>> getAll() {
        return ResponseEntity.ok(meetingService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        meetingService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Meeting deleted"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }
}