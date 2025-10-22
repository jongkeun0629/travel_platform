package com.example.backend.service;

import com.example.backend.entity.EmailCode;
import com.example.backend.repository.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final VerificationCodeRepository verificationCodeRepository;
    public int generateRandomCode(){
        Random random = new Random();
        int min = 100000;
        int max = 999999;

        int code = random.nextInt(max-min+1)+min;
        return code;
    }
    public void sendCode(String email){
        int RandomCode = generateRandomCode();//코드 생성
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);//코드 유효시간(5분)
        EmailCode emailcode = EmailCode.builder()
                .email(email)
                .code(RandomCode)
                .expirationTime(expiry)
                .build();
        verificationCodeRepository.save(emailcode);

        try{
            sendEmail(email, RandomCode);
        }catch(Exception e){
            throw new RuntimeException("인증 코드 발송에 실패했습니다.");
        }
    }
    public void sendEmail(String email, int code){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("회원가입 인증 코드입니다.");
        message.setText("인증 코드: " + code + "\n이 코드는 5분후에 만료됩니다.");

        mailSender.send(message);

    }
    public boolean verifyCode(String email, int code){
        EmailCode record = verificationCodeRepository.findByEmail(email)
                .orElse(null);
        System.out.println(record);
        System.out.println("record입니다.");

        if(record == null){return false;}
        if(record.getCode()!=code){return false;}
        verificationCodeRepository.delete(record);

        return true;
    }
}
