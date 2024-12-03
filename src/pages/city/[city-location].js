//Import Pagkages
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import styles from "../../styles/projects.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import { ToastContainer, toast } from "react-toastify";
import { db } from "<cgch-ch>/config/firebaseConfig";
import Link from "next/link";
import Pagination from "<cgch-ch>/pagination/Pagination";
import { useMemo } from "react";
import Image from "next/image";

const ProjectsLocation = () => {
  const router = useRouter();
  // Getting Last path for Porject Type & Project Category
  const [projecttypeLastpath, setProjecttypeLatpath] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);

  useEffect(() => {
    const projectcategoryPathseg = window.location.pathname.split("/");
    const projectcategoryLastpath =
      projectcategoryPathseg[projectcategoryPathseg.length - 1];
    const removeHifen = projectcategoryLastpath.split("-")[1];
    const capitalProjectcategoryLastpath =
      removeHifen.charAt(0).toUpperCase() + removeHifen.slice(1);
    db.collection("Project_Details")
      .where("city", "==", "Chennai")
      .where("builder_area", "==", capitalProjectcategoryLastpath)
      .get()
      .then((querySnapshot) => {
        const ProjectType = querySnapshot.docs.map((doc) => doc.data());
        console.log(ProjectType);

        setProjectDetail(ProjectType);
      });
  }, [router]);

  let PageSize = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [sliceNameandZoneArray, setSliceNameandZoneArray] = useState([]);
  const [sliceArrayBool, setSliceArrayBool] = useState(false);
  const [currentPageProjectsList, setCurrentPageProjectsList] = useState([]);

  const splitDataForPagination = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    setSliceNameandZoneArray(projectDetail.slice(firstPageIndex, lastPageIndex));
    setSliceArrayBool(true);
  };
  useMemo(() => {
    splitDataForPagination();
  }, [currentPage, projectDetail]);

  // const handleChange = (builder_name, builder_zone) => {
  //   console.log("handleChangeFunction", builder_name, builder_zone);
  //   if (builder_name === "" && builder_zone === "") {
  //     toast.warn("Please Select any Option!", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //     console.log("please Select any one");
  //   } else if (builder_name === "") {
  //     let storeProjectBuilderZone = [];
  //     currentPageProjectsList.forEach((obj) => {
  //       if (obj.builder_area === builder_zone) {
  //         storeProjectBuilderZone.push(obj);
  //       }
  //     });
  //     console.log(storeProjectBuilderZone);
  //     setSliceNameandZoneArray(storeProjectBuilderZone);
  //     console.log("please select bulider section");
  //   } else if (builder_zone === "") {
  //     let builderNameMatch = [];
  //     currentPageProjectsList.forEach((obj) => {
  //       if (obj.builder_details.builder_name === builder_name) {
  //         builderNameMatch.push(obj);
  //       }
  //     });
  //     console.log(builderNameMatch);
  //     setSliceNameandZoneArray(builderNameMatch);
  //     console.log("please select zone section");
  //   } else {
  //     console.log("Done!");
  //     let nameAndZone = [];
  //     currentPageProjectsList.forEach((obj) => {
  //       if (
  //         obj.builder_details.builder_name === builder_name &&
  //         obj.builder_area === builder_zone
  //       ) {
  //         nameAndZone.push(obj);
  //       }
  //     });
  //     console.log(nameAndZone);
  //     setSliceNameandZoneArray(nameAndZone);
  //   }
  // };

  const handleSearchFunction = (selectSearchOption) => {
    console.log("SearchButtonFunction", selectSearchOption);
    if (selectSearchOption === ""){
      toast.warn("Please Select any Option!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }else{
      const projectcategoryPathseg = window.location.pathname.split("/");
    const projectcategoryLastpath =
      projectcategoryPathseg[projectcategoryPathseg.length - 1];
    const removeHifen = projectcategoryLastpath.split("-")[1];
    const capitalProjectcategoryLastpath =
      removeHifen.charAt(0).toUpperCase() + removeHifen.slice(1);
    db.collection("Project_Details")
      .where("city", "==", "Chennai")
      .where("builder_area", "==", capitalProjectcategoryLastpath)
      .get()
      .then((querySnapshot) => {
        const ProjectType = querySnapshot.docs.map((doc) => doc.data());
        console.log(ProjectType);
        let filteredBuilder = ProjectType.filter((item) => {
          return item.Address.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.project_name.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.builder_details.builder_name.toLowerCase().includes(selectSearchOption.toLowerCase());
      });
      console.log(filteredBuilder);
      setSliceNameandZoneArray(filteredBuilder)
      });
    }
  }
  return (
    <>
      <Head>
        <title>Projects</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="og:title" content="Projects" />
        <meta
          name="og:description"
          content="Cgc about best property portal is the fastest growing real estate portal, you can buy flat, new flats, resale flats and sell residential property for best price"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/style.css"/>
      </Head>
      <Header onChange={handleSearchFunction}/>
      {/* Container fluid starts */}
      <Container fluid className={styles.container}>
        {sliceNameandZoneArray.length > 0 ? (
          <Container>
            <Row className="mt-5 mb-5">
              {sliceNameandZoneArray.map((item) => (
                <div className="col-md-4 mt-4">
                  <Link
                    href={`/project-details/${item.project_name_keyword}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="hoverbox">
                    <div className="position-relative">
                      <img
                        src={item.project_img}
                        alt={item.project_img}
                        className={styles.projectimg}
                      />
                      <p className={styles.pprice}>
                        {item.project_highlights.Price_range}
                      </p>
                    </div>
                    <h3 className={styles.pheading}>{item.project_name}</h3>
                    <p className={styles.ppara}>{item.Address}</p>
                  </div>
                  </Link>
                </div>
              ))}
            </Row>
            <Pagination
              className={styles.paginationbar}
              currentPage={currentPage}
              totalCount={projectDetail.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </Container>
        ) : (
          <Container>
            <Row>
              <Image src="/no record found.svg" width={600} height={600} />
            </Row>
          </Container>
        )}
        <Footer />
        {/* container fluid ends */}
      </Container>
    </>
  );
};

export default ProjectsLocation;
