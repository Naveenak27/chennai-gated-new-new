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
import BuilderProject from "../builder-address/[builderaddress]";
import Detail from "../project-details/[project].js";
import { Search } from "@mui/material"

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
function Header({ onChange, title, address, }) {
  const router = useRouter();
  const [data, setData] = useState("");
  const [projectName, setProjectName] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pathName, setPathName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");
  const [selectSearchOption, setSelectSearchOption] = useState("");
  const [selectedSearchhandle, setSelectedSearchhandle] = useState("");
  const [selectedBuilder, setSelectedBuilder] = useState("");
  const [totalBuilder, setTotalBuilder] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [totalZone, setTotalZone] = useState([]);
  const [centerPathName, setCenterPathName] = useState("");
  const [lastPathName, setLastPathName] = useState("");
  const [lastPathNameBuilder, setLastPathNameBuilder] = useState("");


  useEffect(() => {
    const pathSegments = window.location.pathname;

    try {
      const spiltPathSegment = pathSegments.split("/")[1];
      const lastPathName_ = pathSegments.split("/").pop();
      console.log(window.location.search.split("=")[1]);
      setLastPathName(lastPathName_);
      if (lastPathName_ === "search-option") {
        setLastPathNameBuilder(window.location.search.split("=")[1])
      }

      console.log(spiltPathSegment);
      setCenterPathName(spiltPathSegment);
    } catch (error) { }
    console.log(pathSegments);
    setPathName(pathSegments);
    fetchData();
  }, [router, pathName, centerPathName, lastPathName]);

  const fetchData = async () => {
    const collectionRef = db.collection("Project_Details")
      .where("city", "==", "Chennai")
    const querySnapshot = await collectionRef.get();
    const documents = [];
    const builderName = [];
    const zoneName = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        label: doc.data().project_name,
        value: doc.data().project_name_keyword,
        keyword: "project_name",
      });
      documents.push({
        label: doc.data().builder_details.builder_name,
        value: doc.data().builder_details.builder_name,
        keyword: "builder_name",
      });
      documents.push({
        label: doc.data().Address,
        value: doc.data().Address,
        keyword: "address",
      });
      builderName.push(doc.data().builder_details.builder_name);
      zoneName.push(doc.data().builder_area);
    });

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
    if (selectedSearchhandle === "") {
      toast.warn("Please Select any!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      const query = encodeURIComponent(selectSearchOption);
      console.log(query);
      const keyQuery = { key: query };
      const search = new URLSearchParams(keyQuery).toString();
      router.push({
        pathname: "/builder-address/search-option",
        search: search,
      });
    }
  };

  const handleSearchButton = () => {
    if (lastPathName.split("?")[0] === "search-option") {
      const query = encodeURIComponent(selectSearchOption);
      router.replace({
        pathname: "/builder-address/search-option",
        query: { key: query },
      });
    } else {
      console.log(selectSearchOption);
      onChange(selectSearchOption);
    }
  }

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
  const [text, setText] = useState('');
  const fullText = "Find a Dream Place to Live With Your Family.";
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      // Set the base timeout
      const typingSpeed = isDeleting ? 50 : 100; // Faster when deleting
      let timeout;

      if (!isDeleting && index === fullText.length) {
        // When finished typing, wait longer before starting to delete
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1000);
      } else if (isDeleting && index === 0) {
        // When finished deleting, wait before starting to type again
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      } else {
        // Regular typing/deleting
        timeout = setTimeout(() => {
          setText(fullText.substring(0, index));
          setIndex(prev => isDeleting ? prev - 1 : prev + 1);
        }, typingSpeed);
      }

      return () => clearTimeout(timeout);
    };

    handleTyping();
  }, [index, isDeleting]);  return (
    <>
      <Container fluid id={styles.navbar}>
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
                  <div className="relative">
      <p 
        className="font-bold text-4xl animationtext overflow-hidden border-r-4 border-black whitespace-nowrap"
        style={{
          color:"white",
          animation: 'blinkCursor 0.7s infinite'
        }}
        id={styles.homeheading}
        data-text="Find a Dream Place to Live With Your Family"
      >
        {text}<span class="blinking-cursor">!</span>
      </p>
      <style jsx>{`
        @keyframes blinkCursor {
          0%, 100% {
            border-right-color: transparent;
          }
          50% {
            border-right-color: black;
          }
        }
      `}</style>
    </div>    <p id={styles.para}>100% customer satisfication</p>
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-center home-banner-field mt-4 mb-94px">
                    {/* <div className="p-2">
                      <Form.Select
                        style={{ display: "none" }}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Project Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="plot">Plot</option>
                        <option value="villa">Villa</option>
                      </Form.Select>
                    </div> */}
                    <div className="p-2">
                      {/* <Select
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
                            console.log(selectedOption.keyword);
                            setSelectedSearch(selectedOption.value);
                            setSelectedSearchhandle(selectedOption.keyword)
                          }
                        }}
                      /> */}
                      <input type="search" className="basic-single"
                        classNamePrefix="select"
                        id={styles.searchbar}
                        name="color"
                        placeholder="Search by Location, Builder and Project Name"
                        options={[
                          { value: "", label: "Select Project" },
                          ...data,
                        ]}
                        // value={selectedSearch}
                        onChange={(selectedOption) => {
                          if (selectedOption.value === "") {
                            setSelectedSearch("");
                          } else {
                            console.log(selectedOption.target.value);
                            console.log(selectedOption.value);
                            setSelectedSearch(selectedOption.value);
                            setSelectedSearchhandle(selectedOption.keyword)
                            setSelectSearchOption(selectedOption.target.value);
                          }
                        }} />
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
              centerPathName === "builder-project" ||
              centerPathName === "builder-address" ||
              centerPathName === "project-status" ||
              centerPathName === "city" ? (
              <Container>
                <Row>
                  <Col>
                    {lastPathName !== "projects" ? (
                      <>
                        <p id={styles.heading}>
                          Project List
                          {" " +
                            "-" +
                            " " +
                            formatString(lastPathNameBuilder && lastPathNameBuilder || lastPathName).replace(/%20/g, " ")}
                        </p>
                        {lastPathName === "apartment" ? (
                          <p className="project-type-content">
                            Apartments, also known as flats or condominiums, are
                            multi-unit residential buildings with individual
                            living units. They offer a range of options,
                            including studio apartments, one-bedroom,
                            two-bedroom, or larger units. Apartments often come
                            with shared amenities such as parking spaces, gyms,
                            swimming pools, and common areas.
                          </p>
                        ) : null}
                        {lastPathName === "plot" ? (
                          <p className="project-type-content">
                            Plots refer to undeveloped land parcels that are
                            available for sale. These plots are typically sold
                            with the intention of constructing a residential
                            property on them. Buyers can purchase plots and then
                            design and build their own customized homes
                            according to their preferences and requirements.
                          </p>
                        ) : null}
                        {lastPathName === "villa" ? (
                          <p className="project-type-content">
                            Villas are standalone residential units, typically
                            larger in size, and often designed with a luxurious
                            and spacious layout. They are usually located within
                            gated communities or housing complexes and offer
                            privacy, exclusivity, and independent living spaces.
                            Villas often come with private gardens, parking
                            spaces, and additional amenities such as clubhouses
                            and recreational facilities.
                          </p>
                        ) : null}
                        {lastPathName === "luxury" ? (
                          <p className="project-type-content">
                            Luxury projects are characterized by their high-end
                            features, superior quality construction, and premium
                            finishes. They often boast luxurious amenities like
                            spas, concierge services, high-tech security
                            systems, and designer interiors. These projects are
                            designed to cater to affluent buyers seeking
                            exclusivity and a luxurious lifestyle.
                          </p>
                        ) : null}
                        {lastPathName === "ultra-luxury" ? (
                          <p className="project-type-content">
                            Ultra luxury projects represent the epitome of
                            luxury living. They are characterized by their
                            exceptional design, unparalleled craftsmanship, and
                            breathtaking locations. These projects cater to a
                            select clientele who seek the finest residences with
                            extraordinary features, customizations, and
                            world-class amenities.
                          </p>
                        ) : null}
                        {lastPathName === "premium" ? (
                          <p className="project-type-content">
                            Premium projects target a higher-income bracket and
                            offer a range of amenities and features beyond the
                            standard offerings. These projects may include
                            additional facilities such as swimming pools,
                            landscaped gardens, fitness centers, and community
                            spaces.
                          </p>
                        ) : null}
                        {lastPathName === "ultra-premium" ? (
                          <p className="project-type-content">
                            {" "}
                            Ultra-premium projects take luxury to the next
                            level. They offer an even higher level of opulence
                            and exclusivity, often targeting
                            ultra-high-net-worth individuals. These projects may
                            include lavish penthouses, personalized services,
                            private elevators, panoramic views, and
                            state-of-the-art smart home technology.
                          </p>
                        ) : null}
                        {lastPathName === "affordable" ? (
                          <p className="project-type-content">
                            These projects are focused on providing housing
                            solutions that are reasonably priced and cater to
                            middle-income or lower-income segments of the
                            population. They typically offer basic amenities and
                            functional living spaces at affordable rates.
                          </p>
                        ) : null}
                        {lastPathName === "ready-to-move" ? (
                          <p className="project-type-content">
                            Ready to move in projects, as the name suggests, are
                            fully completed and ready for occupancy. These
                            projects have obtained all necessary approvals and
                            certifications, and the units are finished and
                            furnished. Buyers can immediately move into these
                            properties upon purchase. Ready-to-move-in projects
                            are particularly attractive to those who want to
                            avoid the waiting period associated with
                            under-construction projects.
                          </p>
                        ) : null}
                        {lastPathName === "new-launch" ? (
                          <p className="project-type-content">
                            New launch refers to a project that has recently
                            been announced or introduced to the market. These
                            projects are typically in the early stages of
                            development, with construction yet to commence or in
                            its initial phases. Buyers can book units during the
                            new launch phase, often at competitive prices and
                            with various promotional offers.
                          </p>
                        ) : null}
                        {lastPathName === "ongoing" ? (
                          <p className="project-type-content">
                            Ongoing projects are those that are currently under
                            construction. These projects have already started
                            the construction process and are actively being
                            developed. Buyers can typically purchase units in
                            ongoing projects, with the advantage of being able
                            to choose specific units, floor plans, and sometimes
                            even customize certain aspects of the property. The
                            completion timeline for ongoing projects may vary,
                            depending on the size and complexity of the
                            development.
                          </p>
                        ) : null}
                        {lastPathName === "ready-to-built" ? (
                          <p className="project-type-content">
                            Ready-to-construct projects typically refer to plots
                            or land parcels that are fully developed and ready
                            for construction. These projects offer buyers the
                            opportunity to design and build their own homes or
                            structures according to their preferences. The land
                            is typically equipped with necessary infrastructure
                            such as roads, water supply, and electricity
                            connections.
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p id={styles.heading}>Project List</p>
                    )}
                  </Col>
                </Row>
                {/* <Row>
                  <Col>
                    <div className="d-flex flex-column flex-sm-row justify-content-center home-banner-field mt-4 mb-94px">
                      {centerPathName !== "builder-project" ? (
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
                      ) : null}
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
                </Row> */}
                <div className="d-flex flex-column flex-sm-row justify-content-center home-banner-field mt-4 mb-94px">
                  {/* <div className="p-2">
                      <Form.Select
                        style={{ display: "none" }}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Project Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="plot">Plot</option>
                        <option value="villa">Villa</option>
                      </Form.Select>
                    </div> */}
                  <div className="p-2">
                    {/* <Select
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
                            console.log(selectedOption.keyword);
                            setSelectedSearch(selectedOption.value);
                            setSelectedSearchhandle(selectedOption.keyword)
                          }
                        }}
                      /> */}
                    <input type="search" className="basic-single"
                      classNamePrefix="select"
                      id={styles.searchbar}
                      name="color"
                      placeholder="Search by Location, Builder and Project Name"
                      options={[
                        { value: "", label: "Select Project" },
                        ...data,
                      ]}
                      // value={selectedSearch}
                      onChange={(selectedOption) => {
                        if (selectedOption.value === "") {
                          setSelectedSearch("");
                        } else {
                          console.log(selectedOption.target.value);
                          console.log(selectedOption.value);
                          setSelectedSearch(selectedOption.value);
                          setSelectedSearchhandle(selectedOption.keyword)
                          setSelectSearchOption(selectedOption.target.value);
                        }
                      }} />
                  </div>
                  <p className="p-2">
                    <button
                      id={styles.btn}
                      onClick={() => handleSearchButton()}
                    >
                      Search
                    </button>
                  </p>
                </div>
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
                        ₹2.60 Cr onwards | 3, 4, 5 BHK | Area : 1925 - 2475 |
                        Possession : March 2023
                      </p>
                    </Col>
                  </Row>
                </Container>
                <Container className="mt-5">
                  <Link href="tel:099406 14444" target="_blank" style={{ textDecoration: "none" }}>
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
