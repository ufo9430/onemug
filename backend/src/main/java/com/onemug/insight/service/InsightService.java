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

    public Map<String, Object> getInsights(Long userId, Long days){
        Map<String, Object> response = new HashMap<>();

        Creator creator = creatorRepository.findByUserId(userId)
                .orElseThrow(EntityNotFoundException::new);

        Long creatorId = creator.getId();

        // 기간 단위로 날짜 자르기
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);;


        List<Map<String, Object>> chartData = getViews(creatorId,startDate, days);
        Map<String, Integer> incomeMap = getIncome(creatorId, startDate);
        Map<String, Integer> currentSubscribers = getCurrentSubscribers(creatorId, startDate);

        // 조회수 수집
        response.put("views_chartData", chartData); // 현재 기간 조회수
        // 멤버십 수입 수집
        response.put("incomes", incomeMap); // 멤버십 수입(~일간)

        response.put("subscribers", currentSubscribers);
        // 조회수를 한 8개씩 뽑아두고싶어요
        //글쵸 도와주시죠
        // 구독자 내역 수집


        //totalSubscribers
        Integer total = 0;
        for (String key : currentSubscribers.keySet()) {
            total += currentSubscribers.get(key);
        }
        response.put("totalSubscribers", total);

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

    private Map<String, Integer> getIncome(Long creatorId, LocalDateTime startDate) {
        Map<String, Integer> incomeMap = new  HashMap<>();

        List<Membership> incomeMemberships = membershipHistoryRepository
                .findMembershipsByCreatorIdAndCreatedAtAfter(creatorId, startDate);

        Integer totalCurrentIncome = 0;

        for (Membership incomeMembership : incomeMemberships) {
            totalCurrentIncome += incomeMembership.getPrice();
        }

        incomeMap.put("total", totalCurrentIncome);

        return incomeMap;
    }

    private List<Map<String, Object>> getViews(Long creatorId, LocalDateTime startDate, Long days) {
        List<Map<String, Object>> mapList = new ArrayList<>();
        Map<String, Object> viewsMap = new  HashMap<>();

        Integer currentViews = postViewLogRepository.countPostViewLogsByCreatorIdAndStartDate(creatorId, startDate);
        viewsMap.put("time", startDate.plusDays(days));
        viewsMap.put("value", currentViews);

        mapList.add(viewsMap);

        for (int i = 0; i <= 6; i++){
            viewsMap = new HashMap<>();

            Integer current = postViewLogRepository
                    .countPostViewLogsByCreatorIdAndStartDate(creatorId, startDate.minusDays(i * days));

            Integer past = postViewLogRepository
                    .countPostViewLogsByCreatorIdAndStartDate(creatorId, startDate.minusDays((i+1) * days));

            viewsMap.put("time", startDate.minusDays((i)*days));
            viewsMap.put("value", past - current);

            mapList.add(viewsMap);
        }

        return mapList;
    }
}
