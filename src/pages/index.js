import React, { useState, useEffect } from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  background-color: #0e0e0e;
  padding: 10px;
  height: 100vh;
`;
const GalleryBox = styled.div`
  margin-top: 100px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const GalleryItem = styled.div`
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.8);
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
  // const [image_name, setImageName] = useState([]);

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
    let image = "./thumbnails/default_image_thumbnail.png";
    thumbnail_image
      .filter((item) => {
        const filtered_month = item.name.split("-")[0];
        return name.toLowerCase() === filtered_month.toLowerCase();
      })
      .map((item) => {
        image = item.download_url;
      });

    return <img src={image} />;
  };

  return (
    <section>
      <GridContainer>
        <GalleryBox>
          {new_magazine.map(({ name, path }) => {
            const new_name = name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <>
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
              </>
            );
          })}
        </GalleryBox>
      </GridContainer>
    </section>
  );
};

export default IndexPage;
