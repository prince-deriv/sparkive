import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../images/sparkive.png";

const Section = styled.div`
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 100px;
  align-items: center;
  padding: 30px;
  @media (max-width: 768px) {
  }
`;

const GalleryBox = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  margin-top: 100px;
  width: 100%;
  justify-content: center;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const GalleryItem = styled.div`
  flex: none;
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
  const domain =
    "https://raw.githubusercontent.com/prince-deriv/sparkive/master/public/";
  
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
                const month_year = `${filtered_month}-${year}`;
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

            const sorted_data = new_sorted_array.sort(
              (a, b) => new Date("1 " + b.name) - new Date("1 " + a.name)
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
    <Section>
      <LogoWrapper>
        <img src={Logo} alt="logo" width="300px" />
      </LogoWrapper>

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
    </Section>
  );
};

export default IndexPage;
