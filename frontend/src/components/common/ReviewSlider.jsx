import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode } from "swiper/modules"

import "swiper/css"
import "swiper/css/free-mode"

import { FaStar } from "react-icons/fa"

import Img from './Img'
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"


// ─── Skeleton card ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col gap-3 rounded-lg bg-richblack-800 p-3 min-h-[180px]">
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-full skeleton shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3 w-28 rounded skeleton" />
        <div className="h-2.5 w-20 rounded skeleton" />
      </div>
    </div>
    <div className="h-3 w-full rounded skeleton" />
    <div className="h-3 w-4/5 rounded skeleton" />
    <div className="h-3 w-3/5 rounded skeleton" />
  </div>
)


// ─── Main ────────────────────────────────────────────────────────────────────
function ReviewSlider() {
  const [reviews, setReviews] = useState(null)   // null = loading, [] = loaded empty
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) {
          setReviews(data?.data)
        } else {
          setReviews([])
        }
      } catch {
        setReviews([])
      }
    })()
  }, [])


  // ── Loading state ─────────────────────────────────────────────────────────
  if (reviews === null) {
    return (
      <div className="my-[50px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (reviews.length === 0) {
    return (
      <div className="my-[50px] flex flex-col items-center justify-center rounded-2xl border border-richblack-700 bg-richblack-800 py-12 text-center">
        <FaStar className="text-4xl text-richblack-600 mb-3" />
        <p className="text-richblack-400 font-medium">No reviews yet</p>
        <p className="text-richblack-500 text-sm mt-1">
          Be the first to review a course!
        </p>
      </div>
    )
  }


  // ── Slider ────────────────────────────────────────────────────────────────
  return (
    <div className="text-white">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          modules={[FreeMode, Autoplay]}
          breakpoints={{
            640:  { slidesPerView: 1 },
            768:  { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          className="w-full"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 rounded-lg bg-richblack-800 p-3 text-[14px] text-richblack-25 min-h-[180px] max-h-[180px]">
                <div className="flex items-center gap-4">
                  <Img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5 capitalize">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>

                <p className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                    : review?.review}
                </p>

                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-yellow-100">{review.rating}</h3>
                  <ReactStars
                    count={5}
                    value={parseInt(review.rating)}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
