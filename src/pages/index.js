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
  margin-right: 90px;
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
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const domain = "https://sparkchive.vercel.app/";

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

            const filtered_data = data.filter((elem) => {
              const [filtered_month, year] = elem.name.split("-");
              if (
                months.some(
                  (item) => item.toLowerCase() === filtered_month.toLowerCase()
                ) &&
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
            const image_data = thumbnailImages.map(({ name, path }) => ({
              name,
              path,
            }));
            const image_filtered_data = image_data.filter((elem) => {
              const [filtered_month, year] = elem.name.split("-");
              if (
                months.some(
                  (item) => item.toLowerCase() === filtered_month.toLowerCase()
                ) &&
                year.split(".")[0].length === 4
              ) {
                const month_year = filtered_month + `${"-"}` + year;
                return elem.name === month_year;
              }
            });
            setThumbnailImage(image_filtered_data);
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
          const new_name = name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <GalleryItem
              onClick={() => {
                window.open(domain + path.replace("public", ""));
              }}
            >
              {thumbnail_image.length > 0 ? (
                thumbnail_image.map(({ name, path }) => {
                  return <img src={path.replace("public", ".")} />;
                })
              ) : (
                <img
                  src="./thumbnails/Default_Image_Thumbnail.png"
                  placeholder="no image to display"
                />
              )}
              <span className="title">
                {new_name.replace("-", " ").split(".pdf")}
              </span>
            </GalleryItem>
          );
        })}
      </GalleryBox>
    </section>
  );
};

export default IndexPage;
