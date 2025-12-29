package com.example.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.role.key}")
    private String supabaseServiceRoleKey;

    @Value("${supabase.storage.bucket:event-pictures}")
    private String bucketName;

    /**
     * Upload a file to Supabase Storage
     * @param file the file to upload
     * @param eventId the event ID to organize files
     * @return the public URL of the uploaded file
     */
    public String uploadFile(MultipartFile file, Long eventId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String uniqueFilename = "event-" + eventId + "/" + UUID.randomUUID() + fileExtension;

        try {
            // Get file bytes
            byte[] fileBytes = file.getBytes();

            // Make HTTP request to Supabase Storage API
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + uniqueFilename;
            
            // Using simple HTTP POST - in production, consider using a proper HTTP client
            java.net.URI uri = new java.net.URI(uploadUrl);
            java.net.URL url = uri.toURL();
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Authorization", "Bearer " + supabaseServiceRoleKey);
            connection.setRequestProperty("Content-Type", file.getContentType());
            connection.setDoOutput(true);

            try (java.io.OutputStream os = connection.getOutputStream()) {
                os.write(fileBytes);
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == 200 || responseCode == 201) {
                // Return the public URL
                return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + uniqueFilename;
            } else {
                throw new IOException("Failed to upload file. Response code: " + responseCode);
            }

        } catch (Exception e) {
            throw new IOException("Failed to upload file to Supabase Storage", e);
        }
    }

    /**
     * Delete a file from Supabase Storage
     * @param fileUrl the public URL of the file
     */
    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || !fileUrl.contains(bucketName)) {
            throw new IllegalArgumentException("Invalid file URL");
        }

        // Extract the path from the URL
        String filePath = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);

        try {
            String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;
            java.net.URI uri = new java.net.URI(deleteUrl);
            java.net.URL url = uri.toURL();
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
            connection.setRequestMethod("DELETE");
            connection.setRequestProperty("Authorization", "Bearer " + supabaseServiceRoleKey);

            int responseCode = connection.getResponseCode();
            if (responseCode != 204 && responseCode != 200) {
                throw new IOException("Failed to delete file. Response code: " + responseCode);
            }
        } catch (Exception e) {
            throw new IOException("Failed to delete file from Supabase Storage", e);
        }
    }
}
