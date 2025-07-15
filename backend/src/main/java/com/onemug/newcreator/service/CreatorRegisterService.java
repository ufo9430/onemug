package com.onemug.newcreator.service;

import com.onemug.global.entity.Creator;
import com.onemug.global.entity.User;
import com.onemug.newcreator.repository.CreatorRegisterRepository;
import com.onemug.newcreator.repository.CreatorTempUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreatorRegisterService {
    @Autowired
    private CreatorRegisterRepository creatorRepository;


    @Autowired // todo : 임시
    private CreatorTempUserRepository userRepository;

    public void register(String introduce, Long userId) {

        User user = userRepository.findById(userId).get();

        Creator newCreator = Creator.builder()
                .user(user)
                .introduceText(introduce)
                .build();

        creatorRepository.save(newCreator);
    }

    public boolean checkAlreadyExist(Long userId){
        return creatorRepository.existsByUserUserId(userId);
    }
}
