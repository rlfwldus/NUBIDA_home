"use client"

import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Home,
  Search,
  Plus,
  Briefcase,
  Settings,
  BookmarkIcon,
  ChevronRight,
  Plane,
  User,
  HelpCircle,
  LogOut,
  MapPin,
  Calendar,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ============================================
// 데이터 정의
// ============================================

// 해시태그 목록
const hashtags = ["#맛집투어", "#부평", "#에버랜드", "#롯데월드"]

// 게시물 목록
const posts = [
  {
    id: 1,
    username: "여행러버",
    userAvatar: "/travel-user-avatar.jpg",
    location: "에버랜드",
    address: "경기도 용인시 처인구 포곡읍 에버랜드로 199",
    image: "/jeju-island-sunrise-peak-beautiful-scenery.jpg",
    likes: 2529,
    caption: "에버랜드에서의 즐거운 하루 🎢 #에버랜드 #놀이공원",
    comments: [],
    timeAgo: "2시간 전",
  },
  {
    id: 2,
    username: "트래블메이트",
    userAvatar: "/traveler-profile.png",
    location: "한국민속촌",
    address: "경기도 용인시 기흥구 민속촌로 90",
    image: "/busan-haeundae-sunset.png",
    likes: 1856,
    caption: "전통의 아름다움 🏯 #한국민속촌 #전통문화",
    comments: [],
    timeAgo: "5시간 전",
  },
  {
    id: 3,
    username: "맛집탐방가",
    userAvatar: "/world-traveler-avatar.jpg",
    location: "부평 맛집거리",
    address: "인천광역시 부평구 부평대로",
    image: "/paris-eiffel-tower-romantic-view.jpg",
    likes: 3421,
    caption: "부평 맛집 투어 🍜 #맛집투어 #부평",
    comments: [],
    timeAgo: "1일 전",
  },
]

// 일자리 목록
const jobListings = [
  {
    id: 1,
    title: "제주도 카페 바리스타",
    location: "제주도",
    image: "/jeju-island-sunrise-peak-beautiful-scenery.jpg",
    description: "제주 애월 카페에서 바리스타를 모집합니다",
    salary: "시급 12,000원",
  },
  {
    id: 2,
    title: "부산 해변 리조트 스태프",
    location: "부산 해운대",
    image: "/busan-haeundae-sunset.png",
    description: "해운대 리조트 프론트 데스크 직원 모집",
    salary: "월급 250만원",
  },
]

// ============================================
// 메인 컴포넌트
// ============================================

export function TravelFeed() {
  // ============================================
  // 상태 관리
  // ============================================

  const [userProfile, setUserProfile] = useState({
    username: "User1",
    handle: "@user1",
    email: "user1@example.com",
    bio: "여행을 사랑하는 사람",
    avatar: "/placeholder.svg?height=100&width=100", // 기본 유저 아바타
  })

  // 프로필 수정 폼 데이터
  const [profileForm, setProfileForm] = useState({
    username: userProfile.username,
    email: userProfile.email,
    bio: userProfile.bio,
  })

  // 좋아요한 게시물 ID 목록
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  // 저장한 게시물 ID 목록
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set())

  // 검색어
  const [searchQuery, setSearchQuery] = useState("")

  // 현재 활성화된 탭 (home, search, jobs, more)
  const [activeTab, setActiveTab] = useState("home")

  // 각 게시물의 댓글 입력 내용
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})

  // 댓글창이 열린 게시물 ID 목록
  const [showComments, setShowComments] = useState<Set<number>>(new Set())

  // 각 게시물의 댓글 목록
  const [postComments, setPostComments] = useState<Record<number, any[]>>(
    posts.reduce((acc, post) => ({ ...acc, [post.id]: post.comments }), {}),
  )

  // 선택된 해시태그 (한 번에 하나만 선택 가능)
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null)

  // 더보기 탭의 서브 페이지 (menu, settings, travels, saved)
  const [moreSubTab, setMoreSubTab] = useState<"menu" | "settings" | "travels" | "saved">("menu")

  // 선택된 게시물 ID (저장된 게시물에서 클릭 시)
  const [selectedPost, setSelectedPost] = useState<number | null>(null)

  // ============================================
  // 이벤트 핸들러
  // ============================================

  // 좋아요 토글
  const toggleLike = async (postId: number) => {
    const isLiked = likedPosts.has(postId)

    // UI 즉시 업데이트
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })

    // API 호출
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      })
      const data = await response.json()

      if (!data.success) {
        // 실패 시 원래 상태로 복구
        setLikedPosts((prev) => {
          const newSet = new Set(prev)
          if (isLiked) {
            newSet.add(postId)
          } else {
            newSet.delete(postId)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error("좋아요 API 호출 실패:", error)
    }
  }

  // 저장 토글
  const toggleSave = async (postId: number) => {
    const isSaved = savedPosts.has(postId)

    // UI 즉시 업데이트
    setSavedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })

    // API 호출
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: isSaved ? "DELETE" : "POST",
      })
      const data = await response.json()

      if (!data.success) {
        // 실패 시 원래 상태로 복구
        setSavedPosts((prev) => {
          const newSet = new Set(prev)
          if (isSaved) {
            newSet.add(postId)
          } else {
            newSet.delete(postId)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error("저장 API 호출 실패:", error)
    }
  }

  // AI 검색
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) return

    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()

      if (data.success) {
        console.log("AI 검색 결과:", data.results)
      }
    } catch (error) {
      console.error("검색 API 호출 실패:", error)
    }
  }

  // 해시태그 클릭 (한 번에 하나만 선택)
  const handleHashtagClick = async (hashtag: string) => {
    // 같은 해시태그 클릭 시 선택 해제
    if (selectedHashtag === hashtag) {
      setSelectedHashtag(null)
    } else {
      setSelectedHashtag(hashtag)
    }

    // API 호출하여 필터링된 게시물 가져오기
    try {
      const response = await fetch(`/api/posts?hashtag=${encodeURIComponent(hashtag)}`)
      const data = await response.json()

      if (data.success) {
        console.log("해시태그 필터링 결과:", data.posts)
      }
    } catch (error) {
      console.error("해시태그 API 호출 실패:", error)
    }
  }

  // 일자리 지원
  const handleJobApply = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("지원 API 호출 실패:", error)
      alert("지원 중 오류가 발생했습니다")
    }
  }

  // 댓글 작성
  const handleCommentSubmit = async (postId: number) => {
    const commentText = commentInputs[postId]?.trim()
    if (!commentText) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      })
      const data = await response.json()

      if (data.success) {
        // 댓글 목록에 추가
        setPostComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }))
        // 입력창 초기화
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("댓글 작성 API 호출 실패:", error)
      alert("댓글 작성 중 오류가 발생했습니다")
    }
  }

  // 댓글창 토글
  const toggleComments = (postId: number) => {
    setShowComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  // 저장된 게시물 클릭 시 해당 게시물로 이동
  const viewPostDetail = (postId: number) => {
    setSelectedPost(postId)
    setActiveTab("home")
    setMoreSubTab("menu")

    // 해당 게시물로 스크롤
    setTimeout(() => {
      const postElement = document.getElementById(`post-${postId}`)
      if (postElement) {
        postElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  // 프로필 저장
  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      })
      const data = await response.json()

      if (data.success) {
        // 프로필 정보 업데이트
        setUserProfile({
          ...userProfile,
          username: profileForm.username,
          email: profileForm.email,
          bio: profileForm.bio,
        })
        alert("프로필이 저장되었습니다")
        setMoreSubTab("menu")
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("프로필 저장 API 호출 실패:", error)
      alert("프로필 저장 중 오류가 발생했습니다")
    }
  }

  // ============================================
  // 페이지 렌더링 함수
  // ============================================

  // 선택된 해시태그에 따라 게시물 필터링
  const filteredPosts = selectedHashtag ? posts.filter((post) => post.caption.includes(selectedHashtag)) : posts

  // 홈 페이지
  const renderHomePage = () => (
    <>
      {/* 상단 질문 섹션 */}
      <div className="border-b border-border bg-white px-4 py-6">
        <h2 className="mb-4 text-center text-xl font-medium text-gray-900">어떤 여행을 계획하시나요?</h2>

        {/* 해시태그 버튼들 */}
        <div className="flex flex-wrap justify-center gap-2">
          {hashtags.map((tag) => (
            <Button
              key={tag}
              variant={selectedHashtag === tag ? "default" : "secondary"}
              size="sm"
              className="rounded-full px-4 py-1 text-sm font-medium transition-all"
              style={
                selectedHashtag === tag
                  ? { backgroundColor: "#021024", color: "#ffffff" }
                  : { backgroundColor: "#9BA8E5", color: "#ffffff" }
              }
              onClick={() => handleHashtagClick(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* 게시물 피드 */}
      <div className="divide-y divide-border">
        {filteredPosts.map((post) => (
          <Card key={post.id} id={`post-${post.id}`} className="rounded-none border-0 border-b">
            {/* 게시물 헤더 (위치 정보) */}
            <div className="p-4">
              <div className="mb-2 flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground" />
                <div>
                  <p className="font-semibold text-foreground">{post.location}</p>
                  <p className="text-xs text-muted-foreground">{post.address}</p>
                </div>
              </div>
            </div>

            {/* 게시물 이미지 */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <img src={post.image || "/placeholder.svg"} alt={post.caption} className="h-full w-full object-cover" />
            </div>

            {/* 게시물 액션 버튼 */}
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* 좋아요 */}
                <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} className="h-auto p-0">
                  <Heart
                    className={`h-6 w-6 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : "text-foreground"}`}
                  />
                  <span className="ml-1 text-sm">{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
                </Button>

                {/* 댓글 */}
                <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)} className="h-auto p-0">
                  <MessageCircle className="h-6 w-6" />
                  <span className="ml-1 text-sm">{postComments[post.id]?.length || 0}</span>
                </Button>

                {/* 공유 */}
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <Send className="h-6 w-6" />
                  <span className="ml-1 text-sm">1</span>
                </Button>
              </div>

              {/* 댓글 섹션 */}
              {showComments.has(post.id) && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  {/* 기존 댓글 목록 */}
                  {postComments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.username} />
                        <AvatarFallback>{comment.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{comment.username}</span>{" "}
                          <span className="text-foreground">{comment.text}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{comment.timeAgo}</p>
                      </div>
                    </div>
                  ))}

                  {/* 댓글 입력창 */}
                  <div className="flex items-center gap-3 border-t border-border pt-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.username} />
                      <AvatarFallback>{userProfile.username[0]}</AvatarFallback>
                    </Avatar>
                    <input
                      type="text"
                      placeholder="댓글 달기..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleCommentSubmit(post.id)
                        }
                      }}
                      className="flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      className="text-primary disabled:text-muted-foreground"
                    >
                      게시
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  )

  // 검색 페이지
  const renderSearchPage = () => (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">AI챗봇에게 질문해보세요</h2>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="관광지나 숙소를 검색해보세요"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-background px-12 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  )

  // 일자리 페이지
  const renderJobsPage = () => (
    <div className="px-4 py-6">
      <h2 className="mb-6 text-2xl font-semibold text-foreground">여행지 일자리</h2>
      <div className="space-y-4">
        {jobListings.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <div className="flex gap-4 p-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={job.image || "/placeholder.svg"} alt={job.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                  <p className="mt-1 text-sm text-foreground">{job.description}</p>
                </div>
                <p className="text-sm font-medium" style={{ color: "#9BA8E5" }}>
                  {job.salary}
                </p>
              </div>
            </div>
            <div className="border-t border-border px-4 py-3">
              <Button
                className="w-full"
                style={{ backgroundColor: "#9BA8E5", color: "#ffffff" }}
                onClick={() => handleJobApply(job.id)}
              >
                지원하기
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  // 계정 설정 페이지
  const renderSettingsPage = () => (
    <div className="px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setMoreSubTab("menu")}>
          <ChevronRight className="h-6 w-6 rotate-180" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground">계정 설정</h2>
      </div>

      <div className="space-y-6">
        {/* 프로필 설정 */}
        <Card className="p-4">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <User className="h-5 w-5" />
            프로필 설정
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">사용자 이름</Label>
              <Input
                id="username"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bio">소개</Label>
              <Input
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button className="w-full" onClick={handleSaveProfile}>
              저장
            </Button>
          </div>
        </Card>

        {/* 도움말 */}
        <Button variant="outline" className="w-full bg-transparent">
          <HelpCircle className="mr-2 h-4 w-4" />
          도움말
        </Button>

        {/* 로그아웃 */}
        <Button variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  )

  // 내 여행 페이지
  const renderTravelsPage = () => (
    <div className="px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setMoreSubTab("menu")}>
          <ChevronRight className="h-6 w-6 rotate-180" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground">내 여행</h2>
      </div>

      {/* 과거 여행 기록 */}
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="relative h-40 w-full bg-muted">
            <img
              src="/jeju-island-sunrise-peak-beautiful-scenery.jpg"
              alt="제주도 여행"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-lg font-semibold text-foreground">제주도 3박 4일</h3>
            <div className="mb-3 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                2025년 11월 15일 - 18일
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                제주도
              </p>
            </div>
            <Button className="w-full">상세보기</Button>
          </div>
        </Card>
      </div>
    </div>
  )

  // 저장된 게시물 페이지
  const renderSavedPostsPage = () => {
    const savedPostsList = posts.filter((post) => savedPosts.has(post.id))

    return (
      <div className="px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setMoreSubTab("menu")}>
            <ChevronRight className="h-6 w-6 rotate-180" />
          </Button>
          <h2 className="text-xl font-semibold text-foreground">저장된 게시물</h2>
        </div>

        {/* 저장된 게시물이 없을 때 */}
        {savedPostsList.length === 0 ? (
          <div className="py-12 text-center">
            <BookmarkIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">저장된 게시물이 없습니다</p>
          </div>
        ) : (
          // 저장된 게시물 그리드
          <div className="grid grid-cols-3 gap-1">
            {savedPostsList.map((post) => (
              <button
                key={post.id}
                onClick={() => viewPostDetail(post.id)}
                className="relative aspect-square overflow-hidden bg-muted transition-opacity hover:opacity-80"
              >
                <img src={post.image || "/placeholder.svg"} alt={post.caption} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 더보기 메인 페이지
  const renderMorePage = () => {
    // 서브 페이지 렌더링
    if (moreSubTab === "settings") return renderSettingsPage()
    if (moreSubTab === "travels") return renderTravelsPage()
    if (moreSubTab === "saved") return renderSavedPostsPage()

    // 더보기 메인 메뉴
    return (
      <div className="px-4 py-6">
        <h2 className="mb-8 text-center text-xl font-semibold text-foreground">더보기</h2>

        {/* 사용자 프로필 섹션 */}
        <div className="mb-8 flex items-center gap-4 px-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.username} />
            <AvatarFallback>{userProfile.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{userProfile.username}</p>
            <p className="text-sm text-muted-foreground">{userProfile.handle}</p>
            <p className="mt-1 text-sm text-foreground">{userProfile.bio}</p>
          </div>
        </div>

        {/* 메뉴 항목들 */}
        <div className="space-y-1">
          {/* 계정 설정 */}
          <button
            className="flex w-full items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-muted"
            onClick={() => {
              setProfileForm({
                username: userProfile.username,
                email: userProfile.email,
                bio: userProfile.bio,
              })
              setMoreSubTab("settings")
            }}
          >
            <div className="flex items-center gap-4">
              <Settings className="h-6 w-6 text-foreground" />
              <span className="text-base text-foreground">계정 설정</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* 내 여행 */}
          <button
            className="flex w-full items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-muted"
            onClick={() => setMoreSubTab("travels")}
          >
            <div className="flex items-center gap-4">
              <Plane className="h-6 w-6 text-foreground" />
              <span className="text-base text-foreground">내 여행</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* 저장된 게시물 */}
          <button
            className="flex w-full items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-muted"
            onClick={() => setMoreSubTab("saved")}
          >
            <div className="flex items-center gap-4">
              <BookmarkIcon className="h-6 w-6 text-foreground" />
              <span className="text-base text-foreground">저장된 게시물</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    )
  }

  // ============================================
  // 메인 렌더링
  // ============================================

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <h1 className="text-2xl font-bold text-foreground">NUBIDA</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-2xl">
        {activeTab === "home" && renderHomePage()}
        {activeTab === "search" && renderSearchPage()}
        {activeTab === "jobs" && renderJobsPage()}
        {activeTab === "more" && renderMorePage()}
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2">
          {/* 홈 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "home" ? "text-black" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-6 w-6" />
            <span className="sr-only">홈</span>
          </Button>

          {/* 검색 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "search" ? "text-black" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("search")}
          >
            <Search className="h-6 w-6" />
            <span className="sr-only">검색</span>
          </Button>

          {/* 여행 만들기 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "create" ? "text-black" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("create")}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">여행 만들기</span>
          </Button>

          {/* 일자리 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "jobs" ? "text-black" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("jobs")}
          >
            <Briefcase className="h-6 w-6" />
            <span className="sr-only">일자리</span>
          </Button>

          {/* 더보기 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "more" ? "text-black" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("more")}
          >
            <MoreHorizontal className="h-6 w-6" />
            <span className="sr-only">더보기</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
