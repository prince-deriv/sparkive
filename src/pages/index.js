import * as React from "react";
import styled from "styled-components";

const GalleryBox = styled.div`
  margin-top: 100px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const GalleryItem = styled.div`
  position: relative;
  display: flex;
  width: 205px;
  height: 300px;
  background: #eee;
  box-shadow: #aaa 1px 1px 12px;
  cursor: pointer;
  transition: 0.5s ease-in all;

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .title {
    background: #ff444f;
    padding: 5px;
    width: fit-content;
    color: white;
    position: absolute;
    bottom: 0px;
  }
`;

const IndexPage = () => {
  return (
    <section>
      <GalleryBox>
        <GalleryItem
          onClick={() => {
            window.open("/magazine/september-2022.pdf");
          }}
        >
          <img src="./thumbnails/thumb-1.png" />
          <span className="title">September 2022</span>
        </GalleryItem>
      </GalleryBox>
    </section>
  );
};

export default IndexPage;
