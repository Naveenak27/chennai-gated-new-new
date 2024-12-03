import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../../styles/projects.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import { db } from "<cgch-ch>/config/firebaseConfig";
import Card from "react-bootstrap/Card";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../pagination/Pagination";
import { useMemo } from "react";
import Link from "next/link";
import { Oval } from "react-loader-spinner";
import Image from "next/image";

const BuilderProject = () => {
    const [projectList, setProjectList] = useState([]);
    const [projectDetailsArray, setProjectDetailsArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sliceProjectListArray, setSliceProjectListArray] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const PageSize = 12;
    useEffect(() => {
        const fetchData = async () => {
            const projectcategoryPathseg = window.location.pathname.split("/");
            const projectcategoryLastpath =
                projectcategoryPathseg[projectcategoryPathseg.length - 1];
            const fireBase = await db
                .collection("Project_Details")
                .where("city", "==", "Chennai")
                .get();
            const projectDetailsArray = await fireBase.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            let filterbuilder = projectDetailsArray.filter((i) => {
                return i.builder_details.builder_name === projectcategoryLastpath.replace(/-/g, " ")
            })
            console.log(filterbuilder);
            setProjectList(filterbuilder);
            splitDataForPagination();
            setPageLoading(false);
        };
        fetchData();
    }, []);
    const splitDataForPagination = () => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        setSliceProjectListArray(projectList.slice(firstPageIndex, lastPageIndex));
    };
    function formatString(inputString) {
        // Capitalize the first letter
        const capitalizedString =
            inputString.charAt(0).toUpperCase() + inputString.slice(1);

        // Replace hyphens with empty spaces
        const formattedString = capitalizedString.replace(/-/g, " ");

        return formattedString;
    }
    useMemo(() => {
        splitDataForPagination();
    }, [currentPage, projectList]);
    // const handleChange = (builder_name, builder_zone) => {
    //     if (builder_name === "" && builder_zone === "") {
    //         toast.warn("Please Select any Option!", {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",
    //         });
    //         console.log("please Select any one");
    //     } else if (builder_name === "") {
    //         let projectBuilderZoneMatch = [];
    //         projectList.forEach((obj) => {
    //             if (obj.builder_area === builder_zone) {
    //                 projectBuilderZoneMatch.push(obj);
    //             }
    //         });
    //         console.log(projectBuilderZoneMatch);
    //         setSliceProjectListArray(projectBuilderZoneMatch);
    //         console.log("please select bulider section");
    //     } else if (builder_zone === "") {
    //         let projectBuildersNameMatch = [];
    //         projectList.forEach((obj) => {
    //             if (obj.builder_details.builder_name === builder_name) {
    //                 projectBuildersNameMatch.push(obj);
    //             }
    //         });
    //         console.log(projectBuildersNameMatch);
    //         setSliceProjectListArray(projectBuildersNameMatch);
    //         console.log("please select zone section");
    //     } else {
    //         console.log("Done!");
    //         let nameAndZone = [];
    //         projectList.forEach((obj) => {
    //             if (
    //                 obj.builder_details.builder_name === builder_name &&
    //                 obj.builder_area === builder_zone
    //             ) {
    //                 nameAndZone.push(obj);
    //             }
    //         });
    //         console.log(nameAndZone);
    //         setSliceProjectListArray(nameAndZone);
    //     }
    // };
    const handleChangeFunction = async(selectSearchOption) => {
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
            const fireBase = await db
                .collection("Project_Details")
                .where("city", "==", "Chennai")
                .get();
            const projectDetailsArray = await fireBase.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            let filterbuilder = projectDetailsArray.filter((i) => {
                return i.builder_details.builder_name === projectcategoryLastpath.replace(/-/g, " ")
            })
            console.log(filterbuilder);
            let filteredSearch = filterbuilder.filter((item) => {
                return item.Address.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.project_name.toLowerCase().includes(selectSearchOption.toLowerCase()) || item.builder_details.builder_name.toLowerCase().includes(selectSearchOption.toLowerCase());
            });
            console.log(filteredSearch);
            setProjectList(filteredSearch);
        }
      }
    return (
        <>
            <Head>
                <title>BuilderDetails</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="og:title" content="Projects" />
                <meta
                    name="og:description"
                    content="Cgc about best property portal is the fastest growing real estate portal, you can buy flat, new flats, resale flats and sell residential property for best price"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/style.css" />
            </Head>
            <Header onChange={handleChangeFunction} />
            <Container fluid className={styles.container}>
                {/* container starts */}
                <Container>
                    <Row className="mt-5 mb-5">
                        {sliceProjectListArray.map((project) => (
                            <Col key={project.id} md={4} className="mb-3">
                                <Link
                                    href={`/project-details/${project.project_name_keyword}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div className="hoverbox">
                                        <div className="position-relative">
                                            <img
                                                src={project.project_img}
                                                alt={project.project_img}
                                                className={styles.projectimg}
                                            />
                                            <p className={styles.pprice}>
                                                {project.project_highlights.Price_range}
                                            </p>
                                        </div>
                                        <h3 className={styles.pheading}>{project.project_name}</h3>
                                        <p className={styles.ppara}>{project.Address}</p>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                    {sliceProjectListArray.length > 11 ? (
                        <Pagination
                            className={styles.paginationbar}
                            currentPage={currentPage}
                            totalCount={projectList.length}
                            pageSize={PageSize}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    ) : null}
                    {pageLoading === true ? (
                        <Row className="mt-5">
                            <div className="centered-loader-container">
                                <Oval
                                    height={80}
                                    width={80}
                                    color="gray"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel="oval-loading"
                                    secondaryColor="white"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}
                                />
                            </div>
                        </Row>
                    ) : null}
                    {/* container fluid ends */}
                </Container>
                {/* container fluid ends */}
            </Container>
            {sliceProjectListArray.length === 0 ?
                <Container>
                    <Row>
                        <Image src="/no record found.svg" width={600} height={600} />
                    </Row>
                </Container>
                : null}
            <Footer />
        </>
    )
}

export default BuilderProject;