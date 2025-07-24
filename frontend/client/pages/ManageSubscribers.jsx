import { useState, useEffect } from "react";
import { Search, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";

// 타입 제거
const mockSubscribers = [
    {
        id: "1",
        name: "김지수",
        email: "jisoo.kim@email.com",
        joinDate: "2024-01-15",
        membershipType: "무료",
        avatarUrl: "https://api.builder.io/api/v1/image/assets/TEMP/c64db750b88673752fe1a3b54e8bbdd9d94642f0?width=96",
    },
    {
        id: "2",
        name: "박민호",
        email: "minho.park@email.com",
        joinDate: "2024-02-03",
        membershipType: "프리미엄",
        avatarUrl: "https://api.builder.io/api/v1/image/assets/TEMP/c64db750b88673752fe1a3b54e8bbdd9d94642f0?width=96",
    },
    {
        id: "3",
        name: "이서연",
        email: "seoyeon.lee@email.com",
        joinDate: "2024-01-28",
        membershipType: "VIP",
        avatarUrl: "https://api.builder.io/api/v1/image/assets/TEMP/c64db750b88673752fe1a3b54e8bbdd9d94642f0?width=96",
    },
    {
        id: "4",
        name: "정우진",
        email: "woojin.jung@email.com",
        joinDate: "2024-02-10",
        membershipType: "VIP",
        avatarUrl: "https://api.builder.io/api/v1/image/assets/TEMP/c64db750b88673752fe1a3b54e8bbdd9d94642f0?width=96",
    },
    {
        id: "5",
        name: "최하늘",
        email: "haneul.choi@email.com",
        joinDate: "2024-02-15",
        membershipType: "무료",
        avatarUrl: "https://api.builder.io/api/v1/image/assets/TEMP/c64db750b88673752fe1a3b54e8bbdd9d94642f0?width=96",
    },
];

const CreatorSubscribers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [membershipFilter, setMembershipFilter] = useState("all");
    const [subscribers, setSubscribers] = useState(mockSubscribers);
    const navigate = useNavigate();

    //fetch subscribers list
    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const res = await axios.get("/c/manage-subscriber");
                console.log("구독자 목록:", res.data);
                setSubscribers(res.data || mockSubscribers);
            } catch (err) {
                console.error("알림 상태를 불러오지 못했습니다:", err);
            }
        };

        fetchSubscribers();
    }, []);

    const handleMessageClick = async(subscriberId) => {
        // 메시지 보내기 로직 구현
        try {
                const res = await axios.get(`/community/new/${subscriberId}`);
                console.log("메시지 보내기: 구독자 ID",res.data);
                navigate(`/creator/messages/${res.data.chatroomId}`);
            } catch (err) {
                console.error("채팅방 이동 실패", err);
            }
    }

    const filteredSubscribers = subscribers.filter((subscriber) => {
        const matchesSearch =
            subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMembership =
            membershipFilter === "all" || subscriber.membershipType === membershipFilter;

        return matchesSearch && matchesMembership;
    });

    // 타입 지정 제거
    const getMembershipBadgeVariant = (type) => {
        switch (type) {
            case "VIP":
                return "bg-gray-100 text-gray-600 hover:bg-gray-100";
            case "프리미엄":
                return "bg-gray-100 text-gray-600 hover:bg-gray-100";
            default:
                return "bg-gray-100 text-gray-600 hover:bg-gray-100";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Top Header */}
                    <div className="bg-white border-b border-gray-200 h-[73px] flex items-center justify-between px-6">
                        <h1 className="text-xl font-semibold text-gray-900">구독자</h1>
                        <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2">
                            새 글 작성
                        </Button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-0 overflow-hidden">
                            {/* Search and Filter Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between space-x-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="구독자 검색..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 border-gray-200"
                                        />
                                    </div>
                                    <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                                        <SelectTrigger className="w-[140px] border-gray-300">
                                            <SelectValue placeholder="모든 멤버십" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">모든 멤버십</SelectItem>
                                            {[...new Set(subscribers.map(s => s.membershipType))].map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">총 {filteredSubscribers.length}명</p>
                                </div>
                            </div>

                            {/* Subscribers List */}
                            <div className="divide-y divide-gray-200">
                                {filteredSubscribers.map((subscriber) => (
                                    <div key={subscriber.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={subscriber.avatarUrl} />
                                                <AvatarFallback>{subscriber.name.charAt(0)}</AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-gray-900">{subscriber.name}</h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className={getMembershipBadgeVariant(subscriber.membershipType)}
                                                    >
                                                        {subscriber.membershipType}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{subscriber.email}</p>
                                                <p className="text-xs text-gray-400 mt-1">가입일: {subscriber.joinDate}</p>
                                            </div>
                                        </div>

                                        <Button
                                        size="icon"
                                        className="bg-brand-primary hover:bg-brand-primary/90 text-white w-10 h-10"
                                        onClick={() => handleMessageClick(subscriber.id)}
                                        >
                                        <Mail className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorSubscribers;
