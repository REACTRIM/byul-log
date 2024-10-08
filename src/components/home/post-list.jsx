import styled, { keyframes } from "styled-components";
import testImg from "../../assets/imgs/testImage.jpg";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { dummyData } from "../../assets/data/post-data";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { users } from "../../assets/data/users";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";

const PostList = () => {
  const [data, setData] = useState(dummyData);
  const [isLoading, setIsLoading] = useState(false);
  const userList = users;
  const navigate = useNavigate();
  const location = useLocation();
  const { range } = useParams();

  // const page = {
  //   _page: 1,
  //   _scrollchk: false,

  //   list: {
  //     search: async function () {
  //       if (page._scrollchk) return;

  //       page._scrollchk = true;
  //       try {
  //         setIsLoading(true);
  //         // 서버로부터 데이터를 가져오는 로직 (현재는 setTimeout으로 대체)
  //         setTimeout(() => {
  //           const newData = Array(10).fill({
  //             id: 1,
  //             imgUrl: "/imgs/testImage1.jpg",
  //             title: "모험의 시작: 새로운 세계로 떠나다!",
  //             content:
  //               "어느 날 갑자기 문 앞에 나타난 신비한 초대장, 나는 결심했다. 새로운 세계로의 모험이 시작된다!",
  //             createAt: "2024010112345",
  //             user_id: "starstar1",
  //             heart_count: 12,
  //             comment_id: [101, 102],
  //           });

  //           setData((prev) => [...prev, ...newData]);
  //         }, 2000);
  //       } catch (error) {
  //         console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
  //       } finally {
  //         setTimeout(() => {
  //           setIsLoading(false);
  //         }, 2000);
  //         page._scrollchk = false;
  //       }
  //     },
  //   },
  // };
  useEffect(() => {
    const path = location.pathname.split("/");
    if (path[1] == "trending")
      setData([...data].sort((a, b) => b.heart_count - a.heart_count));
    else if (path[1] === "recent")
      setData([...data].sort((a, b) => b.createdAt - a.createdAt));
    else if (!path[1])
      setData([...data].sort((a, b) => b.heart_count - a.heart_count));
    const dayAgo = Number(
      dayjs().subtract(1, "days").startOf("day").format("YYYYMMDDHHmmss")
    );
    const weekAgo = Number(
      dayjs().subtract(7, "days").startOf("day").format("YYYYMMDDHHmmss")
    );
    if (range === "week") {
      // const filtered = data.filter((el) => el.createdAt >= weekAgo);
      setData(dummyData.filter((el) => el.createdAt >= weekAgo));
      // console.log(filtered);
    } else if (range === "day") {
      // const filtered = data.filter((el) => el.createdAt >= dayAgo);
      // console.log(filtered);
      setData(dummyData.filter((el) => el.createdAt >= dayAgo));
    }
  }, [location]);
  // useEffect(() => {
  //   const io = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (!entry.isIntersecting) return;
  //       if (page._scrollchk) return;
  //       page._page += 1;
  //       page.list.search();
  //     });
  //   });
  //   const sentinel = document.getElementById("sentinel");
  //   if (sentinel) {
  //     io.observe(sentinel);
  //   }
  //   return () => io.disconnect(); // 컴포넌트 언마운트 시 observer 해제
  // }, []);
  useEffect(() => {
    // console.log(isLoading);
  }, [isLoading]);
  return (
    <Wrapper>
      {data.map((el, i) => {
        const el_name = userList.find(
          (item) => item.user_id === el.user_id
        ).user_name;
        return (
          <PostCard
            onClick={() =>
              navigate(
                `/@${encodeURIComponent(el.user_id)}/${encodeURIComponent(
                  el.title
                )}`
              )
            }
            key={i}
          >
            <ImgDiv imgUrl={el.imgUrl}></ImgDiv>
            <DescDiv>
              <div className="title-content">
                <div className="title">{el.title}</div>
                <div className="desc">{el.desc}</div>
              </div>
              <div className="created-at">
                {dayjs(el.createdAt).format("YYYY년 M월 DD일")}
              </div>
            </DescDiv>
            <Footer>
              <div className="footer-profile">
                <img src="/profile.png" />
                <span>by</span> {el_name}
              </div>
              <div className="heart-box">
                <HeartIcon />
                {el.heart_count}
              </div>
            </Footer>
          </PostCard>
        );
      })}
      {/* {isLoading &&
        Array(4)
          .fill(0)
          .map((el) => (
            <PostCard>
              <Skeleton />
              <SkelTextDiv>
                <SkeletonText />
              </SkelTextDiv>
              <SkelTextDiv>
                <SkeletonText />
              </SkelTextDiv>
            </PostCard>
          ))}
      <div id="sentinel">
        <img src="/loading.gif" alt="" />
      </div> */}
    </Wrapper>
  );
};

export default PostList;

export const Footer = styled.div`
  width: 100%;
  padding: 0 20px;
  border-top: 1px solid var(--border3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .footer-profile {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    span {
      margin-right: 5px;
      color: var(--text3);
    }
    img {
      border-radius: 50%;
      width: 25px;
      margin-right: 10px;
    }
  }
  .heart-box {
    display: flex;
    gap: 5px;
    align-items: center;
    font-size: 0.9rem;
    color: var(--text2);
    svg {
      stroke: var(--text2);
      fill: var(--text2);
      width: 15px;
    }
  }
`;
export const DescDiv = styled.div`
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  .title-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .title {
      font-size: 1.1rem;
      font-weight: 800;
    }
    .desc {
      font-weight: 100;
      color: var(--text3);
    }
  }
  .created-at {
    color: var(--text3);
    font-size: 0.8rem;
  }
`;
export const ImgDiv = styled.div`
  width: 100%;
  background-image: url(${(props) => props.imgUrl});
  background-size: cover;
`;
const skeletonAnimation = keyframes`
  0%{
    background: linear-gradient(90deg, rgba(224,224,224,1) 0%, rgba(255,255,255,1) 0%, rgba(224,224,224,1) 100%);
  }
  20%{
    background: linear-gradient(90deg, rgba(224,224,224,1) 0%, rgba(255,255,255,1) 20%, rgba(224,224,224,1) 100%);
  }
  40%{
    background: linear-gradient(90deg, rgba(224,224,224,1) 0%, rgba(255,255,255,1) 41%, rgba(224,224,224,1) 100%)
  }
  60%{
    background: linear-gradient(90deg, rgba(224,224,224,1) 0%, rgba(255,255,255,1) 62%, rgba(224,224,224,1) 100%);
  }
  80%{
    background: linear-gradient(90deg, rgba(224,224,224,1) 0%, rgba(255,255,255,1) 81%, rgba(224,224,224,1) 100%);
  }
  100%{
    background: linear-gradient(90deg, rgba(224,224,224,1) 0%, rgba(255,255,255,1) 100%, rgba(224,224,224,1) 100%);
  }
`;
const Skeleton = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(212, 212, 212);
  animation: ${skeletonAnimation} 1s ease-in-out infinite;
`;
const SkeletonText = styled.div`
  width: 90%;
  height: 70%;
  border-radius: 0px;
  background: rgb(212, 212, 212);
  animation: ${skeletonAnimation} 1s infinite;
`;
const SkelTextDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const PostCard = styled.div`
  width: 100%;
  height: 23rem;
  background-color: #ffffff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  display: grid;
  grid-template-rows: 5fr 3.8fr 1.2fr;
  cursor: pointer;
  @media screen and (max-width: 1056px) {
    height: 29rem;
  }
  @media screen and (max-width: 768px) {
    height: 33rem;
  }
  img {
    width: 100%;
  }
  &:hover {
    transform: translateY(-3%);
    transition: transform 0.3s ease-in;
  }
`;
const Wrapper = styled.div`
  width: 100%;
  height: 50vh;
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(5, 1fr);
  @media screen and (max-width: 1800px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 1056px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
  #sentinel {
    height: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    bottom: -100px;
    transform: translate(45vw) translateX(-50%);
  }
`;
