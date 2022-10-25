import React, { useState, useEffect } from "react";
import styled from "styled-components";

const section = styled.div`
  overflow-x: hidden;
`;

const GalleryBox = styled.div`
  display: inline-grid;
  column-gap: 50px;
  padding: 10px;
  margin-top: 100px;
  width: 100%;
  justify-content: center;

  @media only screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: auto auto;
  }
  @media (min-width: 1024px) {
    grid-template-columns: auto auto auto auto;
  }
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
  margin: 30px;

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

  const MAGAZINE_URL =
    "https://api.github.com/repos/prince-deriv/deriv-static/contents/public/magazine";

  const THUMBNAIL_URL =
    "https://api.github.com/repos/prince-deriv/deriv-static/contents/public/thumbnails";

  const THUMBNAIL_PLACEHOLDER = "./thumbnails/default_image_thumbnail.png";

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
      await fetch(MAGAZINE_URL)
        .then((res) => res.json())
        .then((result) => {
          if (result.length) {
            const magazine_details = [...result];
            const data = magazine_details.map(({ name, path }) => ({
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

            const new_sorted_array = filtered_data.map((obj) => {
              if (obj.name.includes("pdf")) {
                return {
                  ...obj,
                  name: obj.name.split(".pdf")[0].replace("-", " "),
                };
              }
              return obj;
            });
            var sorted_data = new_sorted_array.sort(
              (a, b) => new Date(b.name) - new Date(a.name)
            );

            setNewMagazine(sorted_data);
          }
        });
    };

    const sparkMagazineImage = async () => {
      await fetch(THUMBNAIL_URL)
        .then((res) => res.json())
        .then((result) => {
          if (result.length) {
            const thumbnailImages = [...result];
            const image_data = thumbnailImages.map(
              ({ name, path, download_url }) => ({
                name,
                path,
                download_url,
              })
            );

            setThumbnailImage(image_data);
          }
        });
    };

    sparkMagazineImage();
    sparkMagazine();
  }, []);

  const filtered_image = (name) => {
    const new_name = name.split(" ")[0];
    let image = THUMBNAIL_PLACEHOLDER;

    thumbnail_image
      .filter((item) => {
        const filtered_month = item.name.split("-")[0];
        return new_name.toLowerCase() === filtered_month.toLowerCase();
      })
      .map((item) => {
        image = item.download_url;
      });

    return <img src={image} />;
  };

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
              {filtered_image(name.split("-")[0])}
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
