package com.meetingsummarizer.meeting_summarizer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meetingsummarizer.meeting_summarizer.dto.SummaryResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SummaryService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.base-url}")
    private String baseUrl;

    @Value("${groq.chat.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SummaryResult summarize(String transcript) throws Exception {
        String url = baseUrl + "/chat/completions";

        String systemPrompt = "You are a meeting-notes assistant. Given a raw meeting transcript, "
                + "return ONLY a valid JSON object (no markdown, no extra text) with this exact shape: "
                + "{ \"summary\": \"a concise 3-5 sentence summary of the meeting\", "
                + "\"keyDecisions\": [\"decision 1\", \"decision 2\"], "
                + "\"actionItems\": [ { \"task\": \"what needs to be done\", \"owner\": \"who is responsible, or Unassigned if unclear\", \"priority\": \"High, Medium, or Low\" } ] }";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("temperature", 0.3);
        requestBody.put("response_format", Map.of("type", "json_object"));
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", "Transcript:\n\n" + transcript)
        ));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        String content = root.path("choices").get(0).path("message").path("content").asText();

        return objectMapper.readValue(content, SummaryResult.class);
    }
}