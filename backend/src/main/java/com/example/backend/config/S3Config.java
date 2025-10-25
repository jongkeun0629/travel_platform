package com.example.backend.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.internal.StaticCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class S3Config {

    @Value("${AWS-ACCESS}")
    private String accessKey;

    @Value("${AWS-SECRET}")
    private String secretKey;

    @Value("${AWS-REGION}")
    private String region;

    @Bean
    public AmazonS3 amazonS3() {
        if (accessKey == null || accessKey.isEmpty() || secretKey == null || secretKey.isEmpty()) {
            log.warn("AWS credentials not configured. S3 upload will not be available.");
            return null;
        }

        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);

        AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(Regions.fromName(region))
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();

        log.info("AWS S3 client successfully created for region: {}", region);
        return s3Client;
    }
}