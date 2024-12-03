import Head from "next/head";
import {
  Container,
  Dropdown,
  Nav,
  Navbar,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import { db } from "<cgch-ch>/config/firebaseConfig";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Detail from "../project-details/[project].js";

const images = [

  'https://img.freepik.com/premium-photo/cute-little-kitten-peering-table-with-large-empty-background_578467-289.jpg?w=900',
  'https://img.freepik.com/free-photo/red-cat-walks-wooden-fence_8353-245.jpg?w=826&t=st=1684932235~exp=1684932835~hmac=eac8efd6336a9c7906a6515ef11c33dc23a0b5a6016979d50545fc2bc55fcf47',
  // Add more image URLs as needed
];

let groupingBulider = "";

function groupByKey(array, key) {
  return array.reduce(
    (result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    },
    [""]
  );
}
function Header({ onChange, title, address, priceRange, bedRooms, possesion, developmentSize }) {
  const router = useRouter();
  const [data, setData] = useState("");
  const [projectName, setProjectName] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pathName, setPathName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");
  const [selectedBuilder, setSelectedBuilder] = useState("");
  const [totalBuilder, setTotalBuilder] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [totalZone, setTotalZone] = useState([]);
  const [centerPathName, setCenterPathName] = useState("");
  const [lastPathName, setLastPathName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState([]);
  const [backgroundUrl, setBackgroundUrl] = useState("")
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [storeData, setStoreData] = useState([]);
  const [boolean, setBoolean] = useState(true);


  // useEffect(() => {
  //   const pathSegments = window.location.pathname;
  //   try {
  //     const spiltPathSegment = pathSegments.split("/")[1];
  //     const lastPathName = pathSegments.split("/").pop();
  //     console.log(lastPathName);
  //     setLastPathName(lastPathName);
  //     console.log(spiltPathSegment);
  //     setCenterPathName(spiltPathSegment);
  //   } catch (error) {}
  //   console.log(pathSegments);
  //   setPathName(pathSegments);
  //   fetchData();
  // }, [router, pathName, centerPathName]);

  useEffect(() => {
    if (boolean === true) {
      const pathSegments = window.location.pathname;
      try {
        const spiltPathSegment = pathSegments.split("/")[1];
        const lastPathName = pathSegments.split("/").pop();
        console.log(lastPathName);
        setLastPathName(lastPathName);
        console.log(spiltPathSegment);
        setCenterPathName(spiltPathSegment);
      } catch (error) { }
      console.log(pathSegments);
      setPathName(pathSegments);
      fetchData();
    }
    const interval = setInterval(() => {

      // Get the index of the next image in the array
      const currentIndex = storeData.indexOf(backgroundUrl);
      const nextIndex = (currentIndex + 1) % storeData.length;

      // Update the current image URL state
      setBackgroundUrl(storeData[nextIndex]);


    }, 6000)
    return () => clearInterval(interval);
  }, [backgroundUrl, router, pathName, centerPathName]);


  const fetchData = async () => {
    const collectionRef = db.collection("Project_Details").where("project_name_keyword", "==", lastPathName)



    const querySnapshot = await collectionRef.get();
    const documents = [];
    const builderName = [];
    const zoneName = [];
    const bannerImage = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        label: doc.data().project_name,
        value: doc.data().project_name_keyword,
      });
      builderName.push(doc.data().builder_details.builder_name);
      zoneName.push(doc.data().builder_area);
      bannerImage.push(doc.data().top_carosuel_images);

      console.log(bannerImage)

      setStoreData(doc.data().top_carosuel_images)
      setBoolean(false)
    });
    setBackgroundUrl(bannerImage[0])
    setBackgroundImage(bannerImage)
    await setData(documents);
    const grooupedValue = groupByKey(documents, "project_status");
    console.log(grooupedValue);

    const removeDupBuilderName = builderName.filter(
      (item, index) => builderName.indexOf(item) === index
    );

    setTotalBuilder(removeDupBuilderName);

    const removeDupZones = zoneName.filter(
      (item, index) => zoneName.indexOf(item) === index
    );

    setTotalZone(removeDupZones);

    // Get the documents that match the input project name
    const projectDocs = documents.filter(
      (doc) =>
        doc.project_name &&
        doc.project_name.toLowerCase().includes(projectName.toLowerCase())
    );
    console.log(projectDocs);

    if (projectDocs.length > 0) {
      console.log(`Documents with project name "${projectName}" found`);
    } else {
      console.log(`Documents with project name "${projectName}" not found`);
    }
  };


  // Function to handle changes to the project name input field
  const handleProjectNameChange = (event) => {
    setSearchResults([]);
  };

  // Function to handle a click on a search result
  const handleResultClick = (projectName) => {
    setSearchResults([]);
  };

  //Function for ProjectCategory

  const handleProjectCategory = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
  };

  //Function for Search btn

  const searchChanges = (selectedOption) => {
    setSelectedSearch(selectedOption.value);
  };

  const handleSearchSubmit = () => {
    if (selectedCategory === "" && selectedSearch === "") {
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
    } else if (selectedCategory !== "" && selectedSearch !== "") {
      router.push(`/project-details/${selectedSearch}`);
    } else if (selectedSearch === "") {
      console.log("search box empty");
      window.location.href = `/projects/${selectedCategory}`;
    } else {
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
    }
  };

  const projectSearchBar = () => {
    onChange(selectedBuilder, selectedZone);
  };

  function formatString(inputString) {
    // Capitalize the first letter
    const capitalizedString =
      inputString.charAt(0).toUpperCase() + inputString.slice(1);

    // Replace hyphens with empty spaces
    const formattedString = capitalizedString.replace(/-/g, " ");

    return formattedString;
  }

  return (
    <>
      <Container fluid id={styles.bgimage} style={{ backgroundImage: `linear-gradient(315.47deg, rgba(0, 0, 0, 0.7) 25.9%, rgba(0, 0, 0, 0.49) 79.54%), url(${backgroundUrl})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
        {/* Navbar Container Start  */}
        <Navbar expand="lg" className="navbar-dark">
          <Container>
          <Link href="/"
            className={router.pathname === "/"}>
              <Navbar.Brand>
                <Image src="/home_logo 1 (3).png" width={200} height={55} />
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto" id={styles.menu}>
                <Link
                  href="/"
                  className={router.pathname === "/" ? "active" : ""}
                  id={styles.home}
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className={router.pathname === "/projects" ? "active" : ""}
                >
                  Projects
                </Link>
                <Dropdown>
                  <Dropdown.Toggle className={styles.headerMenu}>
                    Project Types
                  </Dropdown.Toggle>
                  {/* <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link
                        href="/project-type/luxury"
                        as="/project-type/luxury"
                        className={styles.droplist}
                      >
                        Luxury
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/ultra-luxury"
                      >
                        Ultra Luxury
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/premium"
                      >
                        Premium
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/ultra-premium"
                      >
                        Ultra Premium
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/affordable"
                      >
                        Affordable
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu> */}
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/projects/[projectCategory]"
                        as="/projects/apartment"
                      >
                        Apartment
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/projects/[projectCategory]"
                        as="/projects/plot"
                      >
                        Plot
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/projects/[projectCategory]"
                        as="/projects/villa"
                      >
                        Villa
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle className={styles.headerMenu}>
                    Project Category
                  </Dropdown.Toggle>
                  {/* <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/projects/[projectCategory]"
                        as="/projects/apartment"
                      >
                        Apartment
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/projects/[projectCategory]"
                        as="/projects/plot"
                      >
                        Plot
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/projects/[projectCategory]"
                        as="/projects/villa"
                      >
                        Villa
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu> */}
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link
                        href="/project-type/luxury"
                        as="/project-type/luxury"
                        className={styles.droplist}
                      >
                        Luxury
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/ultra-luxury"
                      >
                        Ultra Luxury
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/premium"
                      >
                        Premium
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/ultra-premium"
                      >
                        Ultra Premium
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        className={styles.droplist}
                        href="/project-type/[type]"
                        as="/project-type/affordable"
                      >
                        Affordable
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
          {/* Navbar container Close */}
        </Navbar>
        {/* Heading Container Start */}

        {/* Heading Container Close */}
        {/* Container For Dropdown & Searchbar start */}
        {pathName !== "" ? (
          <>
            {pathName === "/" ? (
              <Container style={{ alignItems: "center" }}>
                <Row>
                  <div className="container">
                    <p id={styles.heading}>
                      Find a Dream Place to Live With Your Family
                    </p>
                    <p id={styles.para}>100% customer satisfication</p>
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-center home-banner-field mt-4 mb-94px">
                    <div className="p-2">
                      <Form.Select
                        id={styles.dropdownmenu}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Project Category</option>
                        <option value="apartment">Apartment</option>
                        <option value="plot">Plot</option>
                        <option value="villa">Villa</option>
                      </Form.Select>
                    </div>
                    <div className="p-2">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        id={styles.searchbar}
                        name="color"
                        options={[
                          { value: "", label: "Select Project" },
                          ...data,
                        ]}
                        // value={selectedSearch}
                        onChange={(selectedOption) => {
                          if (selectedOption.value === "") {
                            setSelectedSearch("");
                          } else {
                            setSelectedSearch(selectedOption.value);
                          }
                        }}
                      />
                    </div>
                    <p className="p-2">
                      <button
                        id={styles.btn}
                        onClick={() => handleSearchSubmit()}
                      >
                        Search
                      </button>
                    </p>
                  </div>
                </Row>
              </Container>
            ) : pathName === "/projects" ||
              centerPathName === "projects" ||
              centerPathName === "project-type" ||
              centerPathName === "city" ? (
              <Container>
                <Row>
                  <Col>
                    {lastPathName !== "projects" ? (
                      <p id={styles.heading}>
                        Project List
                        {" " + "-" + " " + formatString(lastPathName)}
                      </p>
                    ) : (
                      <p id={styles.heading}>Project List</p>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="d-flex flex-column flex-sm-row justify-content-center home-banner-field mt-4 mb-94px">
                      <div className="p-2">
                        <Form.Select
                          id={styles.projectDetails}
                          value={selectedBuilder}
                          onChange={(e) => setSelectedBuilder(e.target.value)}
                        >
                          <option value="">Select Builder</option>
                          {totalBuilder.map((builders) => (
                            <option value={builders}>{builders}</option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="p-2">
                        <Form.Select
                          id={styles.ProjectDetails}
                          value={selectedZone}
                          onChange={(e) => setSelectedZone(e.target.value)}
                        >
                          <option value="">Select Zone</option>
                          {totalZone.map((zones) => (
                            <option value={zones}>{zones}</option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="p-2">
                        <button
                          id={styles.btn1}
                          onClick={() => projectSearchBar()}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            ) : pathName === "/about-us" ||
              pathName === "/privacy-policy" ||
              pathName === "/disclaimer" ? (
              <Container>
                <Row>
                  <Col>
                    <p id={styles.heading}>
                      {formatString(pathName.split("/")[1])}
                    </p>
                  </Col>
                </Row>
              </Container>
            ) : (
              <>
                <Container>
                  <Row>
                    <p id={styles.heading}>{title}</p>
                    <p id={styles.para}>{address}</p>
                  </Row>
                  <Row>
                    <Col className="mt-3">
                      <p id={styles.projectList} className="text-center">
                        {priceRange !== '' ? `₹${priceRange} | ` : ''}
                        {bedRooms !== '' ? `${bedRooms} | ` : ''}
                        {developmentSize !== '' ? `${developmentSize} | ` : ''}
                        {possesion !== '' ? `${possesion} ` : ''}
                      </p>
                    </Col>
                  </Row>
                </Container>
                <Container className="mt-5">
                  <Link href="tel:099406 14444" target="_blank" style={{textDecoration:"none"}}>
                  <p id={styles.phone}>
                    <Image src="/Vector (3).svg" width={14} height={14} />
                    <span style={{ marginLeft: "16px" }}>099406 14444</span>
                  </p>
                  </Link>
                  <div>
                    {/* For Banner Bottom height */}
                    <p className={styles.phoneBox}>Hello</p>
                  </div>
                </Container>
              </>
            )}
          </>
        ) : null}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Container>
    </>
  );
}

export default Header;
