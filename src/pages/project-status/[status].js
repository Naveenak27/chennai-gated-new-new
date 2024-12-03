//Import Pagkages
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import styles from "../../styles/projects.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import { db } from "<cgch-ch>/config/firebaseConfig";
import Link from "next/link";
import Pagination from "<cgch-ch>/pagination/Pagination";
import { useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";


const ProjectStatus = () => {
  const router = useRouter();
  // Getting Last path for Porject Type & Project Category
  const [projecttypeLastpath, setProjecttypeLatpath] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);
  function formatString(inputString) {
    if(inputString==="new-launch"){
      const formattedString = inputString.replace(/-/g, " ");
      const capitalizedString = formattedString.replace(
        /\b\w/g,
        (match) => match.toUpperCase()
      );
    return capitalizedString
    }else if(inputString === "ready-to-built"){
      return "Ready to Built"
    }
    else{
    // Capitalize the first letter
    const capitalizedString =
      inputString.charAt(0).toUpperCase() + inputString.slice(1);

    // Replace hyphens with empty spaces
    const formattedString = capitalizedString.replace(/-/g, " ");

    return formattedString;
  }
  }
  useEffect(() => {
    fetchData();
  }, [router]);
  function fetchData() {
    const projectcategoryPathseg = window.location.pathname.split("/");
    const projectcategoryLastpath =
      projectcategoryPathseg[projectcategoryPathseg.length - 1];
    const removeHyphen = formatString(projectcategoryLastpath); 
    const capitalProjectcategoryLastpath =
      removeHyphen.charAt(0).toUpperCase() +
      removeHyphen.slice(1);
    db.collection("Project_Details")
      .where("city", "==", "Chennai")
      .where("project_status", "==", capitalProjectcategoryLastpath)
      .get()
      .then((querySnapshot) => {
        const projectCategoryType = querySnapshot.docs.map((doc) => doc.data());
        console.log(projectCategoryType);
        setProjectDetail(projectCategoryType);
      });
}
  let PageSize = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProjectArray, setCurrentPageProjectArray] = useState([]);
  const [sliceArrayBool, setSliceArrayBool] = useState(false);
  const splitDataForPagination = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    setCurrentPageProjectArray(projectDetail.slice(firstPageIndex, lastPageIndex));
    setSliceArrayBool(true);
  };
  useMemo(() => {
    splitDataForPagination();
  }, [currentPage, projectDetail]);
  // const handleChange = (builder_name, builder_zone) => {
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
  //     let projectBuilderZoneMatch = [];
  //     projectDetail.forEach((obj) => {
  //       if (obj.builder_area === builder_zone) {
  //         projectBuilderZoneMatch.push(obj);
  //       }
  //     });
  //     console.log(projectBuilderZoneMatch);
  //     setCurrentPageProjectArray(projectBuilderZoneMatch);
  //     console.log("please select bulider section");
  //   } else if (builder_zone === "") {
  //     let projectBuildersNameMatch = [];
  //     projectDetail.forEach((obj) => {
  //       if (obj.builder_details.builder_name === builder_name) {
  //         projectBuildersNameMatch.push(obj);
  //       }
  //     });
  //     console.log(projectBuildersNameMatch);
  //     setCurrentPageProjectArray(projectBuildersNameMatch);
  //     console.log("please select zone section");
  //   } else {
  //     console.log("Done!");
  //     let nameAndZone = [];
  //     projectDetail.forEach((obj) => {
  //       if (
  //         obj.builder_details.builder_name === builder_name &&
  //         obj.builder_area === builder_zone
  //       ) {
  //         nameAndZone.push(obj);
  //       }
  //     });
  //     console.log(nameAndZone);
  //     setCurrentPageProjectArray(nameAndZone);
  //   }
  // };
  
  const handleChangeFunction = (selectSearchOption) => {
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
      let searchInput = "";
      const projectcategoryPathseg = window.location.pathname.split("/");
      const projectcategoryLastpath =
        projectcategoryPathseg[projectcategoryPathseg.length - 1];
      const removeHyphen = formatString(projectcategoryLastpath); 
      const capitalProjectcategoryLastpath =
        removeHyphen.charAt(0).toUpperCase() +
        removeHyphen.slice(1);
      db.collection("Project_Details")
        .where("city", "==", "Chennai")
        .where("project_status", "==", capitalProjectcategoryLastpath)
        .get()
        .then((querySnapshot) => {
          const projectCategoryType = querySnapshot.docs.map((doc) => doc.data());
          console.log(projectCategoryType);
          let filteredBuilder = projectCategoryType.filter((item) => {
            return item.Address.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.project_name.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.builder_details.builder_name.toLowerCase().includes(selectSearchOption.toLowerCase());
        });
        console.log(filteredBuilder);
        setProjectDetail(filteredBuilder);
        })
    }
  }
  return (
    <>
      <Header onChange={handleChangeFunction} />
      {/* Container fluid starts */}
      <Container fluid className={styles.container}>
        <Container>
          <Row className="mt-5 mb-5">
            {currentPageProjectArray.map((item) => (
              <div className="col-md-4 mb-3">
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
        {/* container fluid ends */}
        {currentPageProjectArray.length === 0?
        <Container>
            <Row>
              <Image src="/no record found.svg" width={600} height={600} />
            </Row>
          </Container>
          :null}
      </Container>
      <Footer />
    </>
  );
};
export default ProjectStatus;
