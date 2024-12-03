//footer content page
import Head from "next/head";
import { useRouter } from "next/router";
import { Image, Col, Row } from "react-bootstrap";
import { makeStyles } from "@mui/styles";
import { Container, Grid, Typography } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      {/* footer starts */}
      <MDBFooter
        className="footer"
        style={{ backgroundColor: "#0F0F0F", color: "white" }}
      >
        {/* section 1 starts */}
        <section className="pt-5 pb-5">
          {/* container 1 starts */}
          <div className="container">
            <MDBRow className="mt-3">
              {/* featured projects starts */}
              <MDBCol md={3} xs={12} className="mx-auto mb-4">
                <h6 className="footer-head mb-4">Featured Projects</h6>
                {/* <p>
                  <Link
                    href="/city/chennai-east"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai East
                  </Link>
                </p> */}
                <p>
                  <Link
                    href="/city/chennai-west"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai west
                  </Link>
                </p>
                <p>
                  <Link
                    href="/city/chennai-north"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai North
                  </Link>
                </p>
                <p>
                  <Link
                    href="/city/chennai-south"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai South
                  </Link>
                </p>
                <p>
                  <Link
                    href="/city/chennai-central"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai Central
                  </Link>
                </p>
              </MDBCol>
              {/* featured projects end */}

              {/* resale properties starts */}
              <MDBCol md={3} xs={12} className="mx-auto mb-4">
                <h6 className="footer-head mb-4">Resale properties</h6>
                {/* <p>
                  <Link
                    href="/city/chennai-east"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai East
                  </Link>
                </p> */}
                <p>
                  <Link
                    href="/city/chennai-west"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai West
                  </Link>
                </p>
                <p>
                  <Link
                    href="/city/chennai-north"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai North
                  </Link>
                </p>
                <p>
                  <Link
                    href="/city/chennai-south"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai South
                  </Link>
                </p>
                <p>
                  <Link
                    href="/city/chennai-central"
                    style={{ textDecoration: "none" }}
                    className=" footer-content text-reset"
                  >
                    Chennai Central
                  </Link>
                </p>
              </MDBCol>
              {/* resale properties ends */}

              {/* quick menu starts */}
              <MDBCol md={3} xs={12} className="mx-auto mb-md-0 mb-4">
                <h6 className=" footer-head mb-4">Quick Menu</h6>
                <p>
                  <Link
                    href="/about-us"
                    style={{ textDecoration: "none" }}
                    className="footer-content text-reset"
                  >
                    About Us
                  </Link>
                </p>
                <p>
                  <Link
                    href="/privacy-policy"
                    style={{ textDecoration: "none" }}
                    className="footer-content text-reset"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <p>
                  <Link
                    href="/disclaimer"
                    style={{ textDecoration: "none" }}
                    className="footer-content text-reset"
                  >
                    Disclaimer
                  </Link>
                </p>
              </MDBCol>
              {/* quick menu ends */}

              {/* contact us starts */}
              <MDBCol md={3} xs={12} className="mx-auto mb-4">
                <h6 className="footer-head mb-4">Contact Us</h6>
                <div className="d-flex">
                  <Image src="/distance (1).svg" width={20} height={26} />
                  <p className="text-reset footer-content">
                    1st floor, No.31, Vembuli Amman Kovil Street,Near
                    Pazhavanthangal Railway Station,Pazhavanthangal, Chennai –
                    600114
                  </p>
                </div>

                <div className="d-flex">
                  <Image src="/drafts (1).svg" width={20} height={26} />
                  <p className="text-reset footer-content">
                    chennaigatedcommunity@gmail.com
                  </p>
                </div>

                <div className="d-flex">
                  <Image src="/call (1).svg" width={20} height={26} />
                  <p className="text-reset footer-content">
                    099406 14444, 099406 14444
                  </p>
                </div>
              </MDBCol>
              {/* contact us ends */}
            </MDBRow>
          </div>

          {/* container 1 ends */}
        </section>
        <Container>
          <Row>
            <Col>
              <p>
                chennaigatedcommunity@gmail.com
              </p>
            </Col>
            <Col>
            <p> RERA REGISTRATION NO : TN/29/Agent/045/2017</p>
              <div class="bottom-social-icon d-flex">
               
                <Link href="tel:099406 14444" target="_blank">
                  <Image alt="phone-icon" src="/bottomcall.svg" width="45" height="45" className="social-icon"/>
                </Link>
                <Link href="mailto:cgchomesllp@gmail.com" target="_blank">
                  <Image alt="mail-icon" src="/bottommail.svg" width="45" height="45"className="social-icon"/>
                </Link>
                <Link href="https://api.whatsapp.com/send?phone=919677051111&amp;text=Hi%21+I%27m+interested+in+your+service%21+Please+share+more+details.+Thanks%21">
                  <Image alt="watsapp-icon" src="/bottomwhatsapp.svg" width="45" height="45" className="social-icon"/>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </MDBFooter>
    </div>
  );
};

export default Footer;
