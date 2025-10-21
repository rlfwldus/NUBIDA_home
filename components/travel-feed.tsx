"use client"

import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Home,
  Search,
  Plus,
  Briefcase,
  Settings,
  BookmarkIcon,
  ChevronRight,
  Plane,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

const hashtags = [
  "#여행",
  "#여행스타그램",
  "#제주도",
  "#부산여행",
  "#서울여행",
  "#해외여행",
  "#유럽여행",
  "#동남아여행",
  "#일본여행",
  "#국내여행",
]

const posts = [
  {
    id: 1,
    username: "여행러버",
    userAvatar: "/travel-user-avatar.jpg",
    location: "제주도 성산일출봉",
    image: "/jeju-island-sunrise-peak-beautiful-scenery.jpg",
    likes: 1234,
    caption: "제주도에서의 완벽한 일출 🌅 #제주도 #여행스타그램",
    comments: [
      {
        id: 1,
        username: "트래블메이트",
        avatar: "/traveler-profile.png",
        text: "정말 멋진 사진이네요!",
        timeAgo: "1시간 전",
      },
      {
        id: 2,
        username: "세계여행가",
        avatar: "/world-traveler-avatar.jpg",
        text: "저도 가보고 싶어요",
        timeAgo: "30분 전",
      },
    ],
    timeAgo: "2시간 전",
  },
  {
    id: 2,
    username: "트래블메이트",
    userAvatar: "/traveler-profile.png",
    location: "부산 해운대",
    image: "/busan-haeundae-sunset.png",
    likes: 2156,
    caption: "해운대 바다가 너무 아름다워요 🌊 #부산여행 #해운대",
    comments: [
      { id: 1, username: "여행러버", avatar: "/travel-user-avatar.jpg", text: "부산 최고!", timeAgo: "2시간 전" },
    ],
    timeAgo: "5시간 전",
  },
  {
    id: 3,
    username: "세계여행가",
    userAvatar: "/world-traveler-avatar.jpg",
    location: "파리, 프랑스",
    image: "/paris-eiffel-tower-romantic-view.jpg",
    likes: 3421,
    caption: "에펠탑 앞에서 ✨ 파리는 언제나 로맨틱해 #유럽여행 #파리",
    comments: [
      {
        id: 1,
        username: "국내여행러",
        avatar: "/korean-traveler.jpg",
        text: "파리 너무 가고싶어요!",
        timeAgo: "5시간 전",
      },
      { id: 2, username: "여행러버", avatar: "/travel-user-avatar.jpg", text: "로맨틱하네요", timeAgo: "3시간 전" },
    ],
    timeAgo: "1일 전",
  },
  {
    id: 4,
    username: "국내여행러",
    userAvatar: "/korean-traveler.jpg",
    location: "경주 불국사",
    image: "/gyeongju-bulguksa-temple-traditional.jpg",
    likes: 987,
    caption: "천년의 역사가 살아있는 곳 🏯 #경주여행 #국내여행",
    comments: [],
    timeAgo: "2일 전",
  },
]

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
  {
    id: 3,
    title: "서울 게스트하우스 매니저",
    location: "서울 홍대",
    image: "/seoul-hongdae-guesthouse.jpg",
    description: "홍대 게스트하우스 매니저 구합니다",
    salary: "월급 280만원",
  },
  {
    id: 4,
    title: "강릉 서핑샵 강사",
    location: "강릉 경포대",
    image: "/gangneung-surfing-beach.jpg",
    description: "서핑 강사 및 샵 운영 스태프 모집",
    salary: "시급 15,000원",
  },
]

export function TravelFeed() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})
  const [showComments, setShowComments] = useState<Set<number>>(new Set())
  const [postComments, setPostComments] = useState<Record<number, any[]>>(
    posts.reduce((acc, post) => ({ ...acc, [post.id]: post.comments }), {}),
  )

  const toggleLike = async (postId: number) => {
    const isLiked = likedPosts.has(postId)

    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      })

      const data = await response.json()

      if (!data.success) {
        // 실패 시 상태 되돌리기
        setLikedPosts((prev) => {
          const newSet = new Set(prev)
          if (isLiked) {
            newSet.add(postId)
          } else {
            newSet.delete(postId)
          }
          return newSet
        })
        console.error("좋아요 처리 실패:", data.error)
      }
    } catch (error) {
      console.error("좋아요 API 호출 실패:", error)
      // 실패 시 상태 되돌리기
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
  }

  const toggleSave = async (postId: number) => {
    const isSaved = savedPosts.has(postId)

    setSavedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })

    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: isSaved ? "DELETE" : "POST",
      })

      const data = await response.json()

      if (!data.success) {
        // 실패 시 상태 되돌리기
        setSavedPosts((prev) => {
          const newSet = new Set(prev)
          if (isSaved) {
            newSet.add(postId)
          } else {
            newSet.delete(postId)
          }
          return newSet
        })
        console.error("저장 처리 실패:", data.error)
      }
    } catch (error) {
      console.error("저장 API 호출 실패:", error)
      // 실패 시 상태 되돌리기
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
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) return

    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (data.success) {
        console.log("AI 검색 결과:", data.results)
        // TODO: 검색 결과를 UI에 표시
      } else {
        console.error("검색 실패:", data.error)
      }
    } catch (error) {
      console.error("검색 API 호출 실패:", error)
    }
  }

  const handleHashtagClick = async (hashtag: string) => {
    try {
      const response = await fetch(`/api/posts?hashtag=${encodeURIComponent(hashtag)}`)
      const data = await response.json()

      if (data.success) {
        console.log("해시태그 필터링 결과:", data.posts)
        // TODO: 필터링된 게시물을 UI에 표시
      } else {
        console.error("해시태그 필터링 실패:", data.error)
      }
    } catch (error) {
      console.error("해시태그 API 호출 실패:", error)
    }
  }

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

  const handleCommentSubmit = async (postId: number) => {
    const commentText = commentInputs[postId]?.trim()
    if (!commentText) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText }),
      })

      const data = await response.json()

      if (data.success) {
        // 댓글 추가
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

  const renderHomePage = () => (
    <>
      {/* Question Section */}
      <div className="border-b border-border bg-card px-4 py-6">
        <h2 className="mb-4 text-balance text-2xl font-semibold text-foreground">어떤 여행을 계획하시나요?</h2>

        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <Button
              key={tag}
              variant="secondary"
              size="sm"
              className="rounded-full text-sm font-medium"
              onClick={() => handleHashtagClick(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-none border-0 border-b">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.userAvatar || "/placeholder.svg"} alt={post.username} />
                  <AvatarFallback>{post.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.username}</p>
                  <p className="text-xs text-muted-foreground">{post.location}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Post Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <img src={post.image || "/placeholder.svg"} alt={post.caption} className="h-full w-full object-cover" />
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => toggleLike(post.id)} className="h-8 w-8">
                    <Heart
                      className={`h-6 w-6 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : "text-foreground"}`}
                    />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleComments(post.id)} className="h-8 w-8">
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Send className="h-6 w-6" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => toggleSave(post.id)} className="h-8 w-8">
                  <Bookmark
                    className={`h-6 w-6 ${
                      savedPosts.has(post.id) ? "fill-foreground text-foreground" : "text-foreground"
                    }`}
                  />
                </Button>
              </div>

              <p className="mb-2 text-sm font-semibold text-foreground">
                좋아요 {likedPosts.has(post.id) ? post.likes + 1 : post.likes}개
              </p>

              <p className="mb-1 text-sm text-foreground">
                <span className="font-semibold">{post.username}</span>{" "}
                <span className="text-foreground">{post.caption}</span>
              </p>

              {postComments[post.id]?.length > 0 && (
                <button
                  onClick={() => toggleComments(post.id)}
                  className="mb-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  댓글 {postComments[post.id].length}개 모두 보기
                </button>
              )}

              {showComments.has(post.id) && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
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

                  <div className="flex items-center gap-3 border-t border-border pt-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/travel-user-avatar.jpg" alt="User1" />
                      <AvatarFallback>U1</AvatarFallback>
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

              <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  )

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
                <p className="text-sm font-medium text-primary">{job.salary}</p>
              </div>
            </div>
            <div className="border-t border-border px-4 py-3">
              <Button className="w-full" onClick={() => handleJobApply(job.id)}>
                지원하기
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderMorePage = () => (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-center text-xl font-semibold text-foreground">더보기</h2>

      {/* User Profile Section */}
      <div className="mb-8 flex items-center gap-4 px-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/travel-user-avatar.jpg" alt="User1" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">User1</p>
          <p className="text-sm text-muted-foreground">@user1</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <button
          className="flex w-full items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-muted"
          onClick={async () => {
            try {
              const response = await fetch("/api/user/settings")
              const data = await response.json()

              if (data.success) {
                console.log("사용자 설정:", data.settings)
                // TODO: 설정 페이지로 이동 또는 모달 표시
              }
            } catch (error) {
              console.error("설정 조회 실패:", error)
            }
          }}
        >
          <div className="flex items-center gap-4">
            <Settings className="h-6 w-6 text-foreground" />
            <span className="text-base text-foreground">계정 설정</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          className="flex w-full items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-muted"
          onClick={async () => {
            try {
              const response = await fetch("/api/user/travels")
              const data = await response.json()

              if (data.success) {
                console.log("내 여행 목록:", data.travels)
                // TODO: 여행 목록 페이지로 이동
              }
            } catch (error) {
              console.error("여행 목록 조회 실패:", error)
            }
          }}
        >
          <div className="flex items-center gap-4">
            <Plane className="h-6 w-6 text-foreground" />
            <span className="text-base text-foreground">내 여행</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          className="flex w-full items-center justify-between rounded-lg px-4 py-4 transition-colors hover:bg-muted"
          onClick={async () => {
            try {
              const response = await fetch("/api/user/saved-posts")
              const data = await response.json()

              if (data.success) {
                console.log("저장된 게시물:", data.savedPosts)
                // TODO: 저장된 게시물 페이지로 이동
              }
            } catch (error) {
              console.error("저장된 게시물 조회 실패:", error)
            }
          }}
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

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header - Changed from "NUBIDA누비다" to just "NUBIDA" */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <h1 className="text-2xl font-bold text-foreground">NUBIDA</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl">
        {activeTab === "home" && renderHomePage()}
        {activeTab === "search" && renderSearchPage()}
        {activeTab === "jobs" && renderJobsPage()}
        {activeTab === "more" && renderMorePage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "home" ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-6 w-6" />
            <span className="sr-only">홈</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "search" ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("search")}
          >
            <Search className="h-6 w-6" />
            <span className="sr-only">검색</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "create" ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("create")}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">여행 만들기</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "jobs" ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("jobs")}
          >
            <Briefcase className="h-6 w-6" />
            <span className="sr-only">일자리</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${activeTab === "more" ? "text-foreground" : "text-muted-foreground"}`}
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
