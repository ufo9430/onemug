package com.onemug.global.utils;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class NicknameGenerator {

    private static final String[] ADJECTIVES = {
            "따뜻한", "진한", "달콤한", "고소한", "향기로운", "깊은", "부드러운", "시원한", "쌉쌀한", "청량한"
    };

    private static final String[] NOUNS = {
            "아메리카노", "라떼", "바닐라", "모카", "드립", "카페", "크레마", "원두", "에스프레소", "브루잉"
    };

    private static final Random RANDOM = new Random();

    public String generate() {
        String adjective = ADJECTIVES[RANDOM.nextInt(ADJECTIVES.length)];
        String noun = NOUNS[RANDOM.nextInt(NOUNS.length)];
        int number = 1 + RANDOM.nextInt(9999);

        return adjective + noun + String.format("%04d", number);
    }
}