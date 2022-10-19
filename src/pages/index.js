import React, { useState, useEffect } from "react";
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
  const [new_magazine, setNewMagazine] = useState([]);
  const [thumbnail_image, setThumbnailImage] = useState([]);
  useEffect(() => {
    const sparkMagazine = async () => {
      await fetch(
        "https://api.github.com/repos/prince-deriv/deriv-static/contents/public/magazine"
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.length) {
            const magazineDetails = [...result];
            const data = magazineDetails.map(({ name, path }) => ({
              name,
              path,
            }));

            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "september",
              "October",
              "November",
              "December",
            ];

            const filtered_data = data.filter((elem) => {
              const [filtered_month, year] = elem.name.split("-");
              if (
                months.includes(filtered_month) &&
                year.split(".")[0].length === 4
              ) {
                const month_year = filtered_month + `${"-"}` + year;
                return elem.name === month_year;
              }
            });

            setNewMagazine(filtered_data);
          }
        });
    };
    const sparkMagazineImage = async () => {
      await fetch(
        "https://api.github.com/repos/prince-deriv/deriv-static/contents/public/thumbnails"
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.length) {
            const thumbnailImages = [...result];
            setThumbnailImage(thumbnailImages);
          }
        });
    };
    sparkMagazineImage();
    sparkMagazine();
  }, []);

  return (
    <section>
      <GalleryBox>
        {new_magazine.map(({ name, path }) => {
          return (
            <GalleryItem
              onClick={() => {
                window.open(path.replace("public", ""));
              }}
            >
              {thumbnail_image.map(({ name, path }) => {
                return <img src={path.replace("public", ".")} />;
              })}

              <span className="title">
                {name.toUpperCase().replace("-", " ").split(".PDF")}
              </span>
            </GalleryItem>
          );
        })}
      </GalleryBox>
    </section>
  );
};

export default IndexPage;
