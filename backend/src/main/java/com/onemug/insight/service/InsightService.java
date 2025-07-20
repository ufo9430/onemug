package com.onemug.insight.service;


import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Membership;
import com.onemug.insight.repository.MembershipHistoryRepository;
import com.onemug.insight.repository.PostViewLogRepository;
import com.onemug.newcreator.repository.CreatorRegisterRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InsightService {
    @Autowired
    private PostViewLogRepository postViewLogRepository;

    @Autowired
    private CreatorRegisterRepository creatorRepository;

    @Autowired
    private MembershipHistoryRepository membershipHistoryRepository;

    private final String CURRENT_VIEWS = "currentViews";
    private final String PAST_VIEWS = "pastViews";
    private final String CURRENT_INCOME = "currentIncome";
    private final String PAST_INCOME = "pastIncome";
    private final String PAST_PAST_INCOME = "pastPastIncome";
    private final String CURRENT_SUBSCRIBERS = "currentSubscribers";

    public Map<String, Object> getInsights(Long userId, Long days){
        Map<String, Object> response = new HashMap<>();

        Creator creator = creatorRepository.findByUserId(userId)
                .orElseThrow(EntityNotFoundException::new);

        Long creatorId = creator.getId();

        // 기간 단위로 날짜 자르기
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime pastStartDate =  LocalDateTime.now().minusDays(days).minusDays(days);
        LocalDateTime pastPastStartDate = LocalDateTime.now().minusDays(days).minusDays(days).minusDays(days);


        Map<String, Integer> viewsMap = getViews(creatorId,startDate,pastStartDate);
        Map<String, Integer> incomeMap = getIncome(creatorId, startDate, pastStartDate, pastPastStartDate);
        Map<String, Integer> currentSubscribers = getCurrentSubscribers(creatorId, startDate);

        // 조회수 수집
        response.put(CURRENT_VIEWS, viewsMap.get(CURRENT_VIEWS)); // 현재 기간 조회수
        response.put(PAST_VIEWS, viewsMap.get(PAST_VIEWS)); // 지난 기간 조회수
        // 멤버십 수입 수집
        response.put(CURRENT_INCOME, incomeMap.get(CURRENT_INCOME)); // 멤버십 수입(~일간)
        response.put(PAST_INCOME, incomeMap.get(PAST_INCOME)); // 지난 멤버십 수입
        response.put(PAST_PAST_INCOME, incomeMap.get(PAST_PAST_INCOME)); // 지지난 멤버십 수입
        // 구독자 내역 수집

        response.put(CURRENT_SUBSCRIBERS, currentSubscribers);

        return response;
    }

    private Map<String, Integer> getCurrentSubscribers(Long creatorId, LocalDateTime startDate) {
        Map<String, Integer> currentSubscribers = new HashMap<>();

        // 창작자의 멤버십 종류(베이직, 프리미엄, VIP)를 이름만 추출해서 Repository로 카운트
        List<Membership> memberships = membershipHistoryRepository
                .findMembershipsByCreatorIdAndCreatedAtAfter(creatorId, startDate);

        for (Membership membership : memberships) {
            String membershipName = membership.getName();
            if(!currentSubscribers.containsKey(membershipName)){
                currentSubscribers.put(membershipName, 1);
            }else{
                currentSubscribers.put(membershipName, currentSubscribers.get(membershipName) + 1);
            }
        }
        return currentSubscribers;
    }

    private Map<String, Integer> getIncome(Long creatorId, LocalDateTime startDate, LocalDateTime pastStartDate, LocalDateTime pastPastStartDate) {
        Map<String, Integer> incomeMap = new  HashMap<>();
        // 예) 7일간 대상 Creator의 멤버십 결제 내역 조회
        List<Membership> incomeMemberships = membershipHistoryRepository
                .findMembershipsByCreatorIdAndCreatedAtAfter(creatorId, startDate);
        List<Membership> pastIncomeMemberships = membershipHistoryRepository
                .findMembershipsByCreatorIdAndCreatedAtAfter(creatorId, pastStartDate);
        List<Membership> pastPastIncomeMemberships = membershipHistoryRepository
                .findMembershipsByCreatorIdAndCreatedAtAfter(creatorId, pastPastStartDate);

        Integer totalCurrentIncome = 0;
        Integer totalPastIncome = 0;
        Integer totalPastPastIncome = 0;

        for (Membership incomeMembership : incomeMemberships) {
            totalCurrentIncome += incomeMembership.getPrice();
        }
        for (Membership pastIncomeMembership : pastIncomeMemberships) {
            totalPastIncome += pastIncomeMembership.getPrice();
        }
        for (Membership pastPastIncomeMembership : pastPastIncomeMemberships) {
            totalPastPastIncome += pastPastIncomeMembership.getPrice();
        }

        incomeMap.put(CURRENT_INCOME, totalCurrentIncome);
        incomeMap.put(PAST_INCOME, totalPastIncome);
        incomeMap.put(PAST_PAST_INCOME, totalPastPastIncome);

        return incomeMap;
    }

    private Map<String, Integer> getViews(Long creatorId, LocalDateTime startDate, LocalDateTime pastStartDate) {
        Map<String, Integer> viewsMap = new  HashMap<>();

        Integer currentViews = postViewLogRepository.countPostViewLogsByCreatorIdAndStartDate(creatorId, startDate);
        Integer pastViews = postViewLogRepository.countPostViewLogsByCreatorIdAndStartDate(creatorId, pastStartDate);

        viewsMap.put(CURRENT_VIEWS, currentViews);
        viewsMap.put(PAST_VIEWS, pastViews);
        return viewsMap;
    }
}
